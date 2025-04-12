import mongoose from "mongoose";


interface conectionObject {
    isConnected?: number
}

const conection:conectionObject = {}

export const dbConect = async () => {

    try {
        
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        
        conection.isConnected = db.connections[0].readyState

        console.log("mongodb connected successfully");
        
    } catch (error) {
        console.error(error)
        throw new Error("mongodb connection error",)
    }
}