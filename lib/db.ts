import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI) throw new Error("MONGODB_URI is required, its missing or null")


let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn:null, promise:null}
}

export const connectToDB = async ()=> {


    if(cached.conn) return cached.conn;


    if(!cached.promise){

        let opts = {
            bufferCommands: true,
            maxPoolSize:10
        };

        mongoose
        .connect(MONGODB_URI,opts)
        .then(()=> mongoose.connection)

    }

    try {

        cached.conn = await cached.promise
        
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;



}