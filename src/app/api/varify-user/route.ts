import { dbConect } from "@/lib/dbConect";
import User from "@/models/User";

export async function POST(req: Request) {
  
  await dbConect();

  try {
    const { username, varifyCode } = await req.json();

    const user = await User.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "invalid username try again leater",
        },
        { status: 404 }
      );
    }

    const validcode = user.varifyCode === varifyCode;
    const validcodeExpiry = user.verifyCodeExpiry > new Date();

    if (validcode && validcodeExpiry) {
      user.isVarified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "user varifyed sucsessfully",
        },
        { status: 200 }
      );
    } else if (validcodeExpiry) {
      return Response.json(
        {
          success: false,
          message: "varifycode has been expired",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "invalid varify code ",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("user varify error", error);

    return Response.json(
      {
        success: false,
        message: "user varify error",
      },
      { status: 500 }
    );
  }
}
