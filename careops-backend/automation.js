import prisma from "./prismaClient.js";
import { sendMessage } from "./integrations.js";

// ==================== AUTOMATION ENGINE ====================

// Trigger automation based on event
export async function triggerAutomation(event, data) {
  console.log(`[AUTOMATION] Triggered: ${event}`, data);

  switch (event) {
    case "CONTACT_CREATED":
      await handleContactCreated(data);
      break;
    case "BOOKING_CREATED":
      await handleBookingCreated(data);
      break;
    case "FORM_PENDING":
      await handleFormPending(data);
      break;
    case "INVENTORY_LOW":
      await handleInventoryLow(data);
      break;
    case "STAFF_REPLY":
      await handleStaffReply(data);
      break;
  }
}

// Contact created → Welcome message (already done in endpoint)
async function handleContactCreated(data) {
  console.log("[AUTOMATION] Contact created - welcome message sent");
}

// Booking created → Confirmation + Forms
async function handleBookingCreated(data) {
  const { bookingId, workspaceId } = data;

  // Send confirmation message (already done in endpoint)
  console.log("[AUTOMATION] Booking confirmation sent");

  // Create form submissions (already done in endpoint)
  console.log("[AUTOMATION] Forms sent to customer");
}

// Form pending > 3 days → Reminder
async function handleFormPending(data) {
  const { submissionId, contactId, workspaceId } = data;

  const contact = await prisma.contact.findUnique({ where: { id: contactId } });

  // Create message in conversation
  await prisma.conversation.create({
    data: {
      contactId,
      messages: {
        create: {
          sender: "SYSTEM",
          content: "Reminder: Please complete your pending form.",
          channel: "EMAIL",
        },
      },
    },
  });

  // Send actual email
  if (contact.email) {
    await sendMessage(
      workspaceId,
      "EMAIL",
      contact.email,
      "<p>Reminder: Please complete your pending form.</p>",
      "Form Reminder"
    );
  }

  console.log("[AUTOMATION] Form reminder sent");
}

// Inventory low → Alert
async function handleInventoryLow(data) {
  const { inventoryId, workspaceId, name, quantity } = data;

  await prisma.alert.create({
    data: {
      workspaceId,
      type: "INVENTORY_LOW",
      message: `${name} is low (${quantity} remaining)`,
      link: `/inventory/${inventoryId}`,
    },
  });

  console.log("[AUTOMATION] Inventory alert created");
}

// Staff reply → Pause automation
async function handleStaffReply(data) {
  const { conversationId } = data;

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { automated: false },
  });

  console.log("[AUTOMATION] Automation paused for conversation");
}

// ==================== SCHEDULED JOBS ====================

// Check for bookings 24h before
export async function checkUpcomingBookings() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const bookings = await prisma.booking.findMany({
    where: {
      startTime: { gte: tomorrow, lt: dayAfter },
      status: "CONFIRMED",
    },
    include: { contact: true, workspace: true },
  });

  for (const booking of bookings) {
    const message = `Reminder: Your booking is tomorrow at ${booking.startTime.toLocaleTimeString()}`;

    // Create message in conversation
    await prisma.conversation.create({
      data: {
        contactId: booking.contactId,
        messages: {
          create: {
            sender: "SYSTEM",
            content: message,
            channel: "SMS",
          },
        },
      },
    });

    // Send actual SMS
    if (booking.contact.phone) {
      await sendMessage(
        booking.workspaceId,
        "SMS",
        booking.contact.phone,
        message
      );
    }
  }

  console.log(`[AUTOMATION] Sent ${bookings.length} booking reminders`);
}

// Check for pending forms > 3 days
export async function checkPendingForms() {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const submissions = await prisma.formSubmission.findMany({
    where: {
      status: "PENDING",
      createdAt: { lt: threeDaysAgo },
    },
    include: {
      booking: { include: { contact: true } },
      form: { include: { workspace: true } },
    },
  });

  for (const submission of submissions) {
    if (submission.booking?.contact) {
      await triggerAutomation("FORM_PENDING", {
        submissionId: submission.id,
        contactId: submission.booking.contactId,
        workspaceId: submission.form.workspaceId,
      });
    }
  }

  console.log(`[AUTOMATION] Checked ${submissions.length} pending forms`);
}

// Check inventory levels
export async function checkInventoryLevels() {
  const allInventory = await prisma.inventory.findMany();

  const lowInventory = allInventory.filter(
    (item) => item.quantity <= item.threshold
  );

  for (const item of lowInventory) {
    await triggerAutomation("INVENTORY_LOW", {
      inventoryId: item.id,
      workspaceId: item.workspaceId,
      name: item.name,
      quantity: item.quantity,
    });
  }

  console.log(`[AUTOMATION] Checked inventory - ${lowInventory.length} low items`);
}
