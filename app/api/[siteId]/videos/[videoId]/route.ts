import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params }: { params: { siteId: string, videoId: string } }
) {
    try {
const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
        const body = await req.json();

        const { label, videoUrl } = body;

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!label) {
            return new NextResponse("Label is required", {status: 400})
        }

        if(!videoUrl) {
            return new NextResponse("ImageUrl is required", {status: 400})
        }

        if(!params.videoId) {
            return new NextResponse("Video id is required", {status: 400})
        }

        const siteByUserId = await prismadb.site.findFirst({
            where: {
                id: params.siteId,
                userId: user.id,
            }
        })
        
        if(!siteByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const video = await prismadb.video.updateMany({
            where: {
                id: params.videoId,
            },
            data: {
                label,
                videoUrl
            }
        })

        return NextResponse.json(video)

    } catch (error) {
        console.log('VIDEO_PATCH', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function DELETE (
    req: Request,
    { params }: { params: { siteId: string, videoId: string } }
) {
    try {
const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!params.videoId) {
            return new NextResponse("Video id is required", {status: 400})
        }

        const siteByUserId = await prismadb.site.findFirst({
            where: {
                id: params.siteId,
                userId: user.id,
            }
        })
        
        if(!siteByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const video = await prismadb.video.deleteMany({
            where: {
                id: params.videoId,
            },
        })

        return NextResponse.json(video)

    } catch (error) {
        console.log('VIDEO_DELETE', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function GET (
    req: Request,
    { params }: { params: { videoId: string } }
) {
    try {

        if(!params.videoId) {
            return new NextResponse("Video id is required", {status: 400})
        }

        const video = await prismadb.video.findUnique({
            where: {
                id: params.videoId,
            },
        })

        return NextResponse.json(video)

    } catch (error) {
        console.log('VIDEO_GET', error)
        return new NextResponse("Internal error", {status: 500})
    }
}