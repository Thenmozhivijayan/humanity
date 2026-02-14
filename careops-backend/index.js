import express from "express";
import cors from "cors";
import cron from "node-cron";
import bcrypt from "bcryptjs";
import prisma from "./prismaClient.js";
import {
  triggerAutomation,
  checkUpcomingBookings,
  checkPendingForms,
  checkInventoryLevels,
} from "./automation.js";
import { sendMessage, testIntegration } from "./integrations.js";

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// Health check
// --------------------
app.get("/", (req, res) => {
  res.send("CareOps Backend Running");
});

// ==================== AUTH ENDPOINTS ====================

// --------------------
// REGISTER (Owner)
// --------------------
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, workspaceName, address, timezone } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create workspace and owner user
    const workspace = await prisma.workspace.create({
      data: {
        name: workspaceName,
        email,
        address,
        timezone: timezone || "UTC",
        status: "DRAFT",
        users: {
          create: {
            email,
            password: hashedPassword,
            role: "OWNER",
          },
        },
      },
      include: { users: true },
    });

    const user = workspace.users[0];

    res.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
      workspace: { id: workspace.id, name: workspace.name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// --------------------
// LOGIN (Owner/Staff)
// --------------------
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { workspace: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        workspaceId: user.workspaceId,
        workspaceName: user.workspace.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// ==================== END AUTH ENDPOINTS ====================

// ==================== CUSTOMER AUTH ENDPOINTS ====================

// --------------------
// CUSTOMER REGISTER
// --------------------
app.post("/auth/customer/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingCustomer = await prisma.customer.findUnique({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: { name, email, phone, password: hashedPassword },
    });

    res.json({
      success: true,
      customer: { id: customer.id, name: customer.name, email: customer.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// --------------------
// CUSTOMER LOGIN
// --------------------
app.post("/auth/customer/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await prisma.customer.findUnique({ where: { email } });

    if (!customer) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, customer.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// ==================== END CUSTOMER AUTH ENDPOINTS ====================

// --------------------
// GET CUSTOMER BOOKINGS
// --------------------
app.get("/customer/:customerId/bookings", async (req, res) => {
  try {
    const { customerId } = req.params;

    const contacts = await prisma.contact.findMany({
      where: { customerId },
    });

    const contactIds = contacts.map(c => c.id);

    const bookings = await prisma.booking.findMany({
      where: { contactId: { in: contactIds } },
      include: {
        service: true,
        contact: true,
      },
      orderBy: { startTime: "desc" },
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

// ==================== END CUSTOMER ENDPOINTS ====================

// --------------------
// CREATE WORKSPACE
// --------------------
app.post("/workspace", async (req, res) => {
  try {
    const { name, timezone, email, address } = req.body;

    if (!name || !timezone || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const workspace = await prisma.workspace.create({
      data: { name, timezone, email, address, status: "DRAFT" },
    });

    res.json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// --------------------
// CREATE ALERT
// --------------------
app.post("/alert", async (req, res) => {
  try {
    const { workspaceId, type, message, link } = req.body;

    const alert = await prisma.alert.create({
      data: { workspaceId, type, message, link },
    });

    res.json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Alert creation failed" });
  }
});

// --------------------
// DASHBOARD SUMMARY
// --------------------
app.get("/dashboard", async (req, res) => {
  try {
    const { workspaceId } = req.query;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    const alerts = await prisma.alert.findMany({
      where: { workspaceId, resolved: false },
      orderBy: { createdAt: "desc" },
    });

    const bookingsToday = await prisma.booking.count({
      where: {
        workspaceId,
        startTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    const pendingForms = await prisma.formSubmission.count({
      where: {
        form: { workspaceId },
        status: "PENDING",
      },
    });

    const unansweredMessages = await prisma.conversation.count({
      where: {
        contact: { workspaceId },
        automated: true,
        messages: { some: { sender: "CUSTOMER", read: false } },
      },
    });

    res.json({
      workspace,
      alerts,
      bookingsToday,
      pendingForms,
      unansweredMessages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Dashboard load failed" });
  }
});

// --------------------
// GET ALL BOOKINGS (OWNER)
// --------------------
app.get("/bookings", async (req, res) => {
  try {
    const { workspaceId, status } = req.query;

    const bookings = await prisma.booking.findMany({
      where: {
        workspaceId,
        ...(status && { status }),
      },
      include: {
        contact: true,
        service: true,
      },
      orderBy: { startTime: "desc" },
      take: 50,
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load bookings" });
  }
});
// --------------------
// CREATE CONVERSATION (internal use)
// --------------------
app.post("/conversation", async (req, res) => {
  try {
    const { workspaceId, contactId, message } = req.body;

    const conversation = await prisma.conversation.create({
      data: {
        contactId,
        messages: {
          create: {
            sender: "CUSTOMER",
            content: message,
            channel: "INTERNAL",
          },
        },
      },
      include: { messages: true },
    });

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Conversation creation failed" });
  }
});

// --------------------
// GET INBOX
// --------------------
app.get("/inbox", async (req, res) => {
  try {
    const { workspaceId } = req.query;

    const conversations = await prisma.conversation.findMany({
      where: { contact: { workspaceId } },
      include: {
        contact: true,
        messages: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Inbox load failed" });
  }
});

// --------------------
// STAFF REPLY (PAUSES AUTOMATION)
// --------------------
app.post("/inbox/:conversationId/reply", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    // Get conversation with contact
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { contact: true },
    });

    // Create message
    await prisma.message.create({
      data: {
        conversationId,
        sender: "STAFF",
        content,
        channel: "EMAIL",
      },
    });

    // Send actual email
    if (conversation.contact.email) {
      await sendMessage(
        conversation.contact.workspaceId,
        "EMAIL",
        conversation.contact.email,
        `<p>${content}</p>`,
        "Reply from CareOps"
      );
    }

    // Pause automation
    await triggerAutomation("STAFF_REPLY", { conversationId });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Reply failed" });
  }
});

// ==================== STAFF ENDPOINTS ====================

// --------------------
// GET STAFF BOOKINGS
// --------------------
app.get("/staff/bookings", async (req, res) => {
  try {
    const { workspaceId, date } = req.query;

    const startOfDay = date ? new Date(date) : new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        workspaceId,
        startTime: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        contact: true,
        service: true,
      },
      orderBy: { startTime: "asc" },
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

// --------------------
// UPDATE BOOKING STATUS
// --------------------
app.patch("/staff/booking/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// --------------------
// GET STAFF FORMS
// --------------------
app.get("/staff/forms", async (req, res) => {
  try {
    const { workspaceId } = req.query;

    const submissions = await prisma.formSubmission.findMany({
      where: {
        form: { workspaceId },
        status: "PENDING",
      },
      include: {
        form: true,
        booking: { include: { contact: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load forms" });
  }
});

// --------------------
// MARK FORM AS REVIEWED
// --------------------
app.patch("/staff/form/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await prisma.formSubmission.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    res.json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update form" });
  }
});

// ==================== END STAFF ENDPOINTS ====================

// ==================== AUTOMATION ENDPOINTS ====================

// --------------------
// MANUAL TRIGGER (FOR TESTING)
// --------------------
app.post("/automation/trigger", async (req, res) => {
  try {
    const { event, data } = req.body;
    await triggerAutomation(event, data);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Automation trigger failed" });
  }
});

// --------------------
// RUN SCHEDULED JOBS MANUALLY
// --------------------
app.post("/automation/run/:job", async (req, res) => {
  try {
    const { job } = req.params;

    switch (job) {
      case "bookings":
        await checkUpcomingBookings();
        break;
      case "forms":
        await checkPendingForms();
        break;
      case "inventory":
        await checkInventoryLevels();
        break;
      default:
        return res.status(400).json({ error: "Invalid job" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Job execution failed" });
  }
});

// ==================== END AUTOMATION ENDPOINTS ====================

// ==================== PUBLIC ENDPOINTS ====================

// --------------------
// PUBLIC: SUBMIT CONTACT FORM
// --------------------
app.post("/public/contact", async (req, res) => {
  try {
    const { workspaceId, name, email, phone, message } = req.body;

    // Create contact
    const contact = await prisma.contact.create({
      data: { workspaceId, name, email, phone },
    });

    const welcomeMsg = "Thank you for contacting us! We'll get back to you soon.";

    // Create conversation with welcome message
    const conversation = await prisma.conversation.create({
      data: {
        contactId: contact.id,
        messages: {
          create: [
            { sender: "CUSTOMER", content: message, channel: "EMAIL" },
            {
              sender: "SYSTEM",
              content: welcomeMsg,
              channel: "EMAIL",
            },
          ],
        },
      },
    });

    // Send actual welcome email
    if (email) {
      await sendMessage(
        workspaceId,
        "EMAIL",
        email,
        `<p>${welcomeMsg}</p>`,
        "Thank You for Contacting Us"
      );
    }

    // Trigger automation
    await triggerAutomation("CONTACT_CREATED", {
      contactId: contact.id,
      workspaceId,
    });

    res.json({ success: true, contactId: contact.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Contact submission failed" });
  }
});

// --------------------
// PUBLIC: GET SERVICES
// --------------------
app.get("/public/:workspaceId/services", async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const services = await prisma.service.findMany({
      where: { workspaceId },
      include: { availability: true },
    });

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Services load failed" });
  }
});

// --------------------
// PUBLIC: GET AVAILABILITY
// --------------------
app.get("/public/availability/:serviceId", async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date } = req.query;

    const availability = await prisma.availability.findMany({
      where: { serviceId },
    });

    // TODO: Filter by existing bookings
    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Availability load failed" });
  }
});

// --------------------
// PUBLIC: CREATE BOOKING
// --------------------
app.post("/public/booking", async (req, res) => {
  try {
    const { workspaceId, serviceId, name, email, phone, startTime, endTime, customerId } = req.body;

    // Find or create contact
    let contact = await prisma.contact.findFirst({
      where: { workspaceId, OR: [{ email }, { phone }] },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: { workspaceId, name, email, phone, customerId },
      });
    } else if (customerId && !contact.customerId) {
      // Link existing contact to customer
      contact = await prisma.contact.update({
        where: { id: contact.id },
        data: { customerId },
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        workspaceId,
        serviceId,
        contactId: contact.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    const confirmMsg = `Booking confirmed for ${new Date(startTime).toLocaleString()}`;

    // Create conversation with confirmation
    await prisma.conversation.create({
      data: {
        contactId: contact.id,
        messages: {
          create: {
            sender: "SYSTEM",
            content: confirmMsg,
            channel: "EMAIL",
          },
        },
      },
    });

    // Send actual confirmation email
    if (contact.email) {
      await sendMessage(
        workspaceId,
        "EMAIL",
        contact.email,
        `<h2>Booking Confirmed</h2><p>${confirmMsg}</p>`,
        "Booking Confirmation"
      );
    }

    // Get post-booking forms
    const forms = await prisma.form.findMany({
      where: { workspaceId, type: "POST_BOOKING" },
    });

    // Create form submissions
    for (const form of forms) {
      await prisma.formSubmission.create({
        data: { formId: form.id, bookingId: booking.id, data: "{}" },
      });
    }

    // Trigger automation
    await triggerAutomation("BOOKING_CREATED", {
      bookingId: booking.id,
      workspaceId,
    });

    res.json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Booking creation failed" });
  }
});

// --------------------
// PUBLIC: GET FORM
// --------------------
app.get("/public/form/:formId", async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await prisma.form.findUnique({
      where: { id: formId },
    });

    res.json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Form load failed" });
  }
});

// --------------------
// PUBLIC: SUBMIT FORM
// --------------------
app.post("/public/form/:submissionId/submit", async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { data } = req.body;

    const submission = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: { data: JSON.stringify(data), status: "COMPLETED" },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Form submission failed" });
  }
});

// ==================== END PUBLIC ENDPOINTS ====================

// --------------------
// ONBOARDING: STEP 2 - INTEGRATIONS
// --------------------
app.post("/workspace/:id/integrations", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, provider, config } = req.body;

    const integration = await prisma.integration.create({
      data: { workspaceId: id, type, provider, config: JSON.stringify(config) },
    });

    res.json(integration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Integration setup failed" });
  }
});

// --------------------
// TEST INTEGRATION
// --------------------
app.post("/integrations/test", async (req, res) => {
  try {
    const { type, config } = req.body;
    const result = await testIntegration(type, config);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Test failed" });
  }
});

// --------------------
// GET INTEGRATIONS
// --------------------
app.get("/workspace/:id/integrations", async (req, res) => {
  try {
    const { id } = req.params;
    const integrations = await prisma.integration.findMany({
      where: { workspaceId: id },
    });
    res.json(integrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load integrations" });
  }
});

// --------------------
// ONBOARDING: STEP 3 - CONTACT FORM
// --------------------
app.post("/workspace/:id/contact-form", async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.body;

    const form = await prisma.form.create({
      data: {
        workspaceId: id,
        name: "Contact Form",
        type: "CONTACT",
        fields: JSON.stringify(fields),
      },
    });

    res.json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Contact form creation failed" });
  }
});

// --------------------
// ONBOARDING: STEP 4 - SERVICES
// --------------------
app.post("/workspace/:id/services", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, location } = req.body;

    const service = await prisma.service.create({
      data: { workspaceId: id, name, duration, location },
    });

    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Service creation failed" });
  }
});

// --------------------
// GET SERVICES
// --------------------
app.get("/workspace/:id/services", async (req, res) => {
  try {
    const { id } = req.params;

    const services = await prisma.service.findMany({
      where: { workspaceId: id },
      include: { availability: true },
    });

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load services" });
  }
});

// --------------------
// ONBOARDING: STEP 4B - AVAILABILITY
// --------------------
app.post("/services/:id/availability", async (req, res) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;

    const availability = await prisma.availability.create({
      data: { serviceId: id, dayOfWeek, startTime, endTime },
    });

    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Availability setup failed" });
  }
});

// --------------------
// ONBOARDING: STEP 5 - FORMS
// --------------------
app.post("/workspace/:id/forms", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fields } = req.body;

    const form = await prisma.form.create({
      data: {
        workspaceId: id,
        name,
        type: "POST_BOOKING",
        fields: JSON.stringify(fields),
      },
    });

    res.json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Form creation failed" });
  }
});

// --------------------
// ONBOARDING: STEP 6 - INVENTORY
// --------------------
app.post("/workspace/:id/inventory", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, threshold, unit } = req.body;

    const inventory = await prisma.inventory.create({
      data: { workspaceId: id, name, quantity, threshold, unit },
    });

    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Inventory creation failed" });
  }
});

// --------------------
// GET INVENTORY
// --------------------
app.get("/workspace/:id/inventory", async (req, res) => {
  try {
    const { id } = req.params;

    const inventory = await prisma.inventory.findMany({
      where: { workspaceId: id },
      orderBy: { name: "asc" },
    });

    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load inventory" });
  }
});

// --------------------
// UPDATE INVENTORY (USAGE)
// --------------------
app.patch("/inventory/:id/use", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const inventory = await prisma.inventory.findUnique({ where: { id } });
    const newQuantity = inventory.quantity - amount;

    const updated = await prisma.inventory.update({
      where: { id },
      data: { quantity: newQuantity },
    });

    // Check if below threshold
    if (newQuantity <= inventory.threshold) {
      await triggerAutomation("INVENTORY_LOW", {
        inventoryId: id,
        workspaceId: inventory.workspaceId,
        name: inventory.name,
        quantity: newQuantity,
      });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Inventory update failed" });
  }
});

// --------------------
// ONBOARDING: STEP 7 - STAFF
// --------------------
app.post("/workspace/:id/staff", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { workspaceId: id, email, password: hashedPassword, role: "STAFF" },
    });

    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Staff creation failed" });
  }
});

// --------------------
// GET STAFF LIST
// --------------------
app.get("/workspace/:id/staff", async (req, res) => {
  try {
    const { id } = req.params;

    const users = await prisma.user.findMany({
      where: { workspaceId: id },
      select: { id: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load staff" });
  }
});

// --------------------
// ONBOARDING: STEP 8 - ACTIVATE (WITH VALIDATION)
// --------------------
app.post("/workspace/:id/activate", async (req, res) => {
  try {
    const { id } = req.params;

    // Validation
    const integrations = await prisma.integration.count({ where: { workspaceId: id } });
    const services = await prisma.service.count({ where: { workspaceId: id } });
    const availability = await prisma.availability.count({
      where: { service: { workspaceId: id } },
    });

    if (integrations === 0) {
      return res.status(400).json({ error: "At least one integration required" });
    }
    if (services === 0) {
      return res.status(400).json({ error: "At least one service required" });
    }
    if (availability === 0) {
      return res.status(400).json({ error: "Availability must be defined" });
    }

    const workspace = await prisma.workspace.update({
      where: { id },
      data: { status: "ACTIVE" },
    });

    res.json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Activation failed" });
  }
});

// --------------------
app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");

  // Start automation jobs
  console.log("[AUTOMATION] Starting scheduled jobs...");

  // Every day at 9 AM - Check bookings 24h before
  cron.schedule("0 9 * * *", () => {
    console.log("[CRON] Running booking reminders...");
    checkUpcomingBookings();
  });

  // Every day at 10 AM - Check pending forms
  cron.schedule("0 10 * * *", () => {
    console.log("[CRON] Checking pending forms...");
    checkPendingForms();
  });

  // Every 6 hours - Check inventory
  cron.schedule("0 */6 * * *", () => {
    console.log("[CRON] Checking inventory levels...");
    checkInventoryLevels();
  });

  console.log("[AUTOMATION] Jobs scheduled successfully");
});
