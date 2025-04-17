import { dbConect } from "@/lib/dbConect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/ options";
import { User } from "next-auth";

export async function GET(request: Request) {

    await dbConect()

  const sesstion = await getServerSession(authOptions);

  const user: User = sesstion?.user;

  if (!sesstion || !sesstion.user) {
    return Response.json(
      {
        success: false,
        message: "unothorize accses",
      },
      { status: 403 }
    );
  }
  const userId = user._id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found for user massage status",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        acceptMassage: user.isMassageAllowed,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accept massage status", error);
    return Response.json(
      {
        success: false,
        message: "Error accept massage status",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    await dbConect()
  const sesstion = await getServerSession(authOptions);

  const user: User = sesstion?.user;

  if (!sesstion || !sesstion.user) {
    return Response.json(
      {
        success: false,
        message: "unothorize accses",
      },
      { status: 403 }
    );
  }
  const userId = user._id;

  try {
    const { isMassageAllowed } = await request.json();

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        isMassageAllowed,
      },
      { new: true }
    );
  } catch (error) {
    console.error("Error accept massage status", error);
    return Response.json(
      {
        success: false,
        message: "Error update accept  massage status",
      },
      { status: 500 }
    );
  }
}
