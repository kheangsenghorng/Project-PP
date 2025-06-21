import { resend } from "./config.js";
import {
  verificationTokenEmailTemp,
  WELCOME_EMAIL_TEMPLATE,
} from "./email-templates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email",
      html: verificationTokenEmailTemp.replace(
        "{verificationToken}",
        verificationToken
      ),
    });
  } catch (error) {
    console.log("error sending verification email ", error);
    throw new Error("error sending verification email");
  }
};
export const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to our company",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });
    if (error) throw error;
  } catch (error) {
    console.log("error sending welcome email", error);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password",
      html: `Click <a href="${resetURL}">here</a> to reset your password`,
    });
    if (error) throw error;
  } catch (error) {
    console.log("error sending password reset email", error);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Password Reset was Sucssful",
      html: `Your password was reset succssfully`,
    });
    if (error) throw error;
  } catch (error) {
    console.log("error sending password reset email", error);
  }
};
