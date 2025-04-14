import { dbConect } from "@/lib/dbConect";
import User from "@/models/User";
import { z } from "zod";

import { usernameValidation } from "@/schemas/signupSchema";

const validateUsername = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConect();

  try {
    const { searchParams } = new URL(req.url);

    const quryparams = {
      username: searchParams.get("username"),
    };

    const result = validateUsername.safeParse(quryparams);

    console.log(result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(",")
              : "invalid query paramiter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const exgistingVarifyedUser = await User.findOne({
      username,
      isVarified: true,
    });

    if (exgistingVarifyedUser) {
      return Response.json(
        {
          success: false,
          message: "username is allready taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is unice",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("username name unice check error", error);

    return Response.json(
      {
        success: false,
        message: "username name unice check error",
      },
      { status: 500 }
    );
  }
}
