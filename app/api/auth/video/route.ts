import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Video, { IVideo } from "@/model/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        await connectToDB();
        const videos = await Video.find({}).sort({createdAt:-1}).lean();

        if(!videos || videos.length === 0){
            return NextResponse.json({
                message: "No videos found"
            },
        {
            status:400
        })
        }

        return NextResponse.json(videos);
    } catch (error) {

        return NextResponse.json({
            error: "Internal server error"
        },
    
    {status:500}
)
        
    }
}

export async function POST(request:NextRequest){
    try {

        const session = await getServerSession(authOptions);

        if(!session){
            return NextResponse.json({error:"Unauthorized"},{status:401});

        }

        await connectToDB();

        const body:IVideo = await request.json();

        if(
            !body.title
            || !body.description
            || !body.videoUrl
            || !body.thumbnailUrl){
            return NextResponse.json({
                error:"Missing field"
            },
        {
            status:400
        })
        }

        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation:{
                height: 1920,
                widtth: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newVideo = await Video.create(videoData);

        return NextResponse.json(newVideo);
     
        
    } catch (error) {
        return NextResponse.json({
            error: "Internal server error"
        },{
            status:500
        })
    }
}