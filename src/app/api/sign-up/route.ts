import { dbConect } from "@/lib/dbConect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendEmail";

export async function POST(req: Request) {
  await dbConect();

  try {
    const { username, email, password } = await req.json();

    const existingUserByUsername = await User.findOne({
      username,
      isVarified: true,
    });

    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "user is already exist",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await User.findOne({
      email,
    });
    let varifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVarified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.varifyCode = varifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        isVarified: false,
        varifyCode,
        varifyCodeExpiry: expiryDate,
        isMassageAllowed: true,
        massages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      username,
      email,
      varifyCode
    );

    console.log(emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Error while registering user",
      },
      { status: 500 }
    );
  }
}
