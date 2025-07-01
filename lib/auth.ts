import { NextAuthOptions } from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials"
import { connectToDB } from "./db"
import User from "@/model/User"
import bcrypt from "bcryptjs"


export const authOptions: NextAuthOptions = {
    

    providers: [

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label:"email", type:"email"},
                password: {label:"password", type:"password"}
            },
            async authorize(credentials){

                if(!credentials?.email|| !credentials?.password){
                    throw new Error("email and password required")
                }

                try {
                    await connectToDB();
                    const user = await User.findOne({email: credentials.email})
                    if(!user){
                        throw new Error('No user found with this email')
                    }

                    const isMatch = await bcrypt.compare(credentials.password, user.password);
                    if(!isMatch){
                        throw new Error('Incorrect password')
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email
                    }

                } catch (error) {
                    console.error("Auth error", error); 
                    throw error;
                }
            }
        })
        

    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id;
            }
            return token;
        },
         async session({session,token, user}){
            if(session.user){
               session.user.id = token.id as string
            }
            return session;
        }
    },
    pages:{
        signIn: '/login',
        error:'/login'

    },
    session:{
        strategy:"jwt",
        maxAge: 30 * 24 * 60 * 60 //30 days
    },
    secret: process.env.NEXTAUTH_SECRET

}