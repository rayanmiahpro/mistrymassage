import { dbConect } from "@/lib/dbConect";
import User from "@/models/User";
import { Massage } from "@/models/User";

export async function POST(request: Request) {
  await dbConect();

  try {
    const { content, username } = await request.json();

    const user = await User.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 403 }
      );
    }

    const massage = { content, createdAt: new Date() };

    user.massages.push(massage as Massage);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "massage send sucsessfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("unexpected error on send massage", error);

    return Response.json(
      {
        success: false,
        message: "unexpected error on send massage",
      },
      { status: 500 }
    );
  }
}
