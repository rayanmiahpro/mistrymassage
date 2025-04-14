import { dbConect } from "@/lib/dbConect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/ options";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function GET(req: Request) {
  //TODO:Do it later
}
