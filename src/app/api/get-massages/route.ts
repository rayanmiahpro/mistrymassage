import { dbConect } from "@/lib/dbConect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/ options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConect();

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
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
   const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$massages" },
      { $sort: { "$massages.createdAt": -1 } },
      {
        $group: { _id: "$_id", massages: { $push: "$massages" } },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          messages: "massage not found",
        },
        { status: 403 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "massage found",
        massages:user[0].massages
      },
      { status: 500 }
    );

  } catch (error) {
    console.error("get massage error", error);

    return Response.json(
      {
        success: false,
        message: "get massage error",
      },
      { status: 500 }
    );
  }
}
