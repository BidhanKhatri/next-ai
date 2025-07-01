import { connectToDB } from "@/lib/db";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){

    try {
        
        const {email, password} = await request.json();

        if(!email || !password){
            return NextResponse.json(
            {
                error: "email and password both are required"
            },
             {status: 400}
             )
        }

        await connectToDB();


        const existingUser = await User.findOne({email});

        if(existingUser){
            return NextResponse.json({
                message: "User already exists with this email"
            },
        {status:400}
         )
        }

        const createdUser = await User.create({
            email,
            password
        });


        return NextResponse.json({
            message: "User registered successfully",
            data: createdUser
        },
        {status:200}
    )

    } catch (error) {

        return NextResponse.json({
            message: "Unable to register user",
            error: error
        },
        {status:500}
    )
        
    }

}