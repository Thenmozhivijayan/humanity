import nodemailer from "nodemailer";
import twilio from "twilio";
import prisma from "./prismaClient.js";

// ==================== EMAIL PROVIDER ====================

class EmailProvider {
  constructor(config) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.host || "smtp.gmail.com",
      port: config.port || 587,
      secure: false,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  async send(to, subject, body) {
    try {
      const info = await this.transporter.sendMail({
        from: this.config.from || this.config.user,
        to,
        subject,
        html: body,
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("[EMAIL] Send failed:", error.message);
      return { success: false, error: error.message };
    }
  }
}

// ==================== SMS PROVIDER ====================

class SMSProvider {
  constructor(config) {
    this.config = config;
    this.client = twilio(config.accountSid, config.authToken);
  }

  async send(to, message) {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.config.from,
        to,
      });
      return { success: true, messageId: result.sid };
    } catch (error) {
      console.error("[SMS] Send failed:", error.message);
      return { success: false, error: error.message };
    }
  }
}

// ==================== INTEGRATION MANAGER ====================

export async function sendMessage(workspaceId, channel, to, content, subject = null) {
  try {
    // Get integration config
    const integration = await prisma.integration.findFirst({
      where: {
        workspaceId,
        type: channel,
        active: true,
      },
    });

    if (!integration) {
      console.error(`[INTEGRATION] No ${channel} integration found for workspace`);
      return { success: false, error: "Integration not configured" };
    }

    const config = JSON.parse(integration.config);

    // Send based on channel
    let result;
    if (channel === "EMAIL") {
      const provider = new EmailProvider(config);
      result = await provider.send(to, subject || "Message from CareOps", content);
    } else if (channel === "SMS") {
      const provider = new SMSProvider(config);
      result = await provider.send(to, content);
    } else {
      return { success: false, error: "Unsupported channel" };
    }

    // Log result
    console.log(`[INTEGRATION] ${channel} to ${to}:`, result.success ? "✓" : "✗");
    return result;
  } catch (error) {
    console.error("[INTEGRATION] Error:", error.message);
    return { success: false, error: error.message };
  }
}

// ==================== TEST CONNECTION ====================

export async function testIntegration(type, config) {
  try {
    if (type === "EMAIL") {
      const provider = new EmailProvider(config);
      const result = await provider.send(
        config.user,
        "CareOps Test Email",
        "<p>Your email integration is working!</p>"
      );
      return result;
    } else if (type === "SMS") {
      const provider = new SMSProvider(config);
      const result = await provider.send(
        config.testPhone,
        "CareOps: Your SMS integration is working!"
      );
      return result;
    }
    return { success: false, error: "Invalid type" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
