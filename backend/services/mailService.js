import Brevo from "@getbrevo/brevo";
import config from '../config/index.js';

// Initialize Brevo HTTP API client
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    config.BREVO_API_KEY
);

export async function sendVerificationEmail(email, verificationCode) {

    const html = `
        <div style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
          <p>Hello,</p>
          <p>Your verification code is: <strong>${verificationCode}</strong></p>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `
    const textContent = `Hello, your verification code is: ${verificationCode}. This code is valid for 10 minutes.`;

    try {
        await apiInstance.sendTransacEmail({
            sender: {
                name: "Nova Realm",
                email: config.EMAIL_USER,
            },
            to: [{ email: email }],
            subject: "Your Nova Realm Verification Code",
            htmlContent: html,
            textContent: textContent,
        });
        return { success: true }
    } catch (error) {
        console.error("Error sending verification email:", error.message);
        return { success: false }
    }
}


export async function sendPasswordResetEmail(email, resetCode) {

    const html = `
        <div style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
          <p>Hello,</p>
          <p>Your password reset code is: <strong>${resetCode}</strong></p>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `
    const textContent = `Hello, your password reset code is: ${resetCode}. This code is valid for 10 minutes.`;

    try {
        await apiInstance.sendTransacEmail({
            sender: {
                name: "Nova Realm",
                email: config.EMAIL_USER,
            },
            to: [{ email: email }],
            subject: "Your password reset Code for Nova Realm",
            htmlContent: html,
            textContent: textContent,
        });
        return { success: true }
    } catch (error) {
        console.error("Error sending password reset email:", error.message);
        return { success: false }
    }
}