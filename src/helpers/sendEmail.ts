import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/vadationEmail";
import { ApiResponce } from "@/types/ApiResponce";

export async function sendVerificationEmail(
  username: string,
  email: string,
  otp: string
): Promise<ApiResponce> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      react: VerificationEmail({ username, otp }),
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error sending verification email" };
  }
}
