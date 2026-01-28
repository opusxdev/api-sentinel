const nodemailer = require('nodemailer');
const User = require('../models/User');
const logger = require('../utils/logger');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendAlert(endpoint, checkResult) {
    try {
      const user = await User.findById(endpoint.user);
      
      if (!user) {
        logger.error('User not found for notification');
        return;
      }

      const alertData = {
        endpointName: endpoint.name,
        endpointUrl: endpoint.url,
        status: checkResult.status,
        statusCode: checkResult.statusCode,
        errorMessage: checkResult.errorMessage,
        responseTime: checkResult.responseTime,
        timestamp: checkResult.checkedAt
      };

      // Send email notification
      if (endpoint.notifications.channels.email && user.notificationPreferences.email) {
        await this.sendEmailAlert(user.email, alertData);
      }

      // SMS notification (placeholder - implement with Twilio/SNS)
      if (endpoint.notifications.channels.sms && user.notificationPreferences.sms) {
        await this.sendSMSAlert(user, alertData);
      }

      // Slack notification (placeholder - implement with Slack webhook)
      if (endpoint.notifications.channels.slack && user.notificationPreferences.slack) {
        await this.sendSlackAlert(user, alertData);
      }

      logger.info(`Alert sent for endpoint: ${endpoint.name}`);
    } catch (error) {
      logger.error(`Notification error: ${error.message}`);
    }
  }

  async sendEmailAlert(email, alertData) {
    const subject = `🚨 API Down Alert: ${alertData.endpointName}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">API Health Alert</h2>
        <p>Your API endpoint is experiencing issues:</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Endpoint:</strong> ${alertData.endpointName}</p>
          <p><strong>URL:</strong> ${alertData.endpointUrl}</p>
          <p><strong>Status:</strong> <span style="color: #dc2626;">${alertData.status.toUpperCase()}</span></p>
          ${alertData.statusCode ? `<p><strong>Status Code:</strong> ${alertData.statusCode}</p>` : ''}
          ${alertData.errorMessage ? `<p><strong>Error:</strong> ${alertData.errorMessage}</p>` : ''}
          <p><strong>Response Time:</strong> ${alertData.responseTime}ms</p>
          <p><strong>Time:</strong> ${alertData.timestamp.toLocaleString()}</p>
        </div>
        
        <p>Please investigate this issue as soon as possible.</p>
        <p style="color: #6b7280; font-size: 12px;">Sent by API-Sentinel Monitoring System</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"API-Sentinel" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html
      });
      
      logger.info(`Email alert sent to ${email}`);
    } catch (error) {
      logger.error(`Email sending failed: ${error.message}`);
    }
  }

  async sendSMSAlert(user, alertData) {
    // Implement SMS with Twilio, AWS SNS, or similar service
    logger.info(`SMS alert would be sent for ${alertData.endpointName}`);
  }

  async sendSlackAlert(user, alertData) {
    // Implement Slack webhook integration
    logger.info(`Slack alert would be sent for ${alertData.endpointName}`);
  }

  async sendRecoveryNotification(endpoint) {
    try {
      const user = await User.findById(endpoint.user);
      
      const subject = `✅ API Recovered: ${endpoint.name}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">API Recovery Notice</h2>
          <p>Your API endpoint has recovered:</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Endpoint:</strong> ${endpoint.name}</p>
            <p><strong>URL:</strong> ${endpoint.url}</p>
            <p><strong>Status:</strong> <span style="color: #16a34a;">ONLINE</span></p>
            <p><strong>Response Time:</strong> ${endpoint.lastResponseTime}ms</p>
          </div>
          
          <p style="color: #6b7280; font-size: 12px;">Sent by API-Sentinel Monitoring System</p>
        </div>
      `;

      await this.transporter.sendMail({
        from: `"API-Sentinel" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject,
        html
      });

      logger.info(`Recovery notification sent for ${endpoint.name}`);
    } catch (error) {
      logger.error(`Recovery notification error: ${error.message}`);
    }
  }
}

module.exports = new NotificationService();