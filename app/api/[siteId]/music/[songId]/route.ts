import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params }: { params: { siteId: string, songId: string } }
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

        const { label, imageUrl } = body;

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!label) {
            return new NextResponse("Label is required", {status: 400})
        }

        if(!imageUrl) {
            return new NextResponse("ImageUrl is required", {status: 400})
        }

        if(!params.songId) {
            return new NextResponse("Song id is required", {status: 400})
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

        const song = await prismadb.music.updateMany({
            where: {
                id: params.songId,
            },
            data: {
                label,
            }
        })

        return NextResponse.json(song)

    } catch (error) {
        console.log('SONG_PATCH', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function DELETE (
    req: Request,
    { params }: { params: { siteId: string, songId: string } }
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

        if(!params.songId) {
            return new NextResponse("Song id is required", {status: 400})
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

        const song = await prismadb.music.deleteMany({
            where: {
                id: params.songId,
            },
        })

        return NextResponse.json(song)

    } catch (error) {
        console.log('SONG_DELETE', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function GET (
    req: Request,
    { params }: { params: { songId: string } }
) {
    try {

        if(!params.songId) {
            return new NextResponse("Song id is required", {status: 400})
        }

        const song = await prismadb.music.findUnique({
            where: {
                id: params.songId,
            },
        })

        return NextResponse.json(song)

    } catch (error) {
        console.log('SONG_GET', error)
        return new NextResponse("Internal error", {status: 500})
    }
}