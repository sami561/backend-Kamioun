import nodemailer from "nodemailer";
import { getEnv } from "./env";

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // You can change this to your preferred email service
    auth: {
      user: getEnv("EMAIL_USER"), // Your email
      pass: getEnv("EMAIL_PASS"), // Your email password or app password
    },
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  newPassword: string
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: getEnv("EMAIL_USER"),
      to: email,
      subject: "Password Reset - Kamioun",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You have requested a password reset for your Kamioun account.</p>
          <p>Your new password is: <strong style="background-color: #f0f0f0; padding: 5px 10px; border-radius: 4px;">${newPassword}</strong></p>
          <p>Please log in with this password and consider changing it to something more secure.</p>
          <p>If you did not request this password reset, please contact our support team immediately.</p>
          <br>
          <p>Best regards,<br>The Kamioun Team</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
