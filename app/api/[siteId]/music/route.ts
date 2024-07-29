import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server"

export async function POST (
    req: Request,
    {params}: {params: {siteId: string}}
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

        const { label, title, songUrl } = body;

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!label) {
            return new NextResponse("Label is required", {status: 400})
        }

        if(!songUrl) {
            return new NextResponse("Url is required", {status: 400})
        }

        if(!params.siteId) {
            return new NextResponse("Site id is required", {status: 400})
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

        const song = await prismadb.music.create({
            data: {
                label,
                title,
                songUrl,
                siteId: params.siteId
            }
        })

        return NextResponse.json(song);

    } catch (error) {
        console.log('[MUSIC_POST]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function GET (
    req: Request,
    {params}: {params: {siteId: string}}
) {
    try {

        if(!params.siteId) {
            return new NextResponse("Site id is required", {status: 400})
        }

        const songs = await prismadb.music.findMany({
            where: {
                siteId: params.siteId
            }
        })

        return NextResponse.json(songs);

    } catch (error) {
        console.log('[MUSIC_GET]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}