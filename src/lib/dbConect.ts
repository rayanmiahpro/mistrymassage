import mongoose from "mongoose";

interface conectionObject {
  isConnected?: number;
}

const conection: conectionObject = {};

export const dbConect = async () => {
  if (conection.isConnected) {
    console.log("mongodb already connected");

    return;
  }

  try {
    const db = await mongoose.connect(
      `${process.env.MONGODB_URI}/mistrymassage` || ""
    );

    conection.isConnected = db.connections[0].readyState;

    console.log("mongodb connected successfully");
  } catch (error) {
    console.error("mongodb connection error", error);

    process.exit(1);
  }
};
