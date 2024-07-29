import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
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

        const body = await req.json();

        const { title, label } = body;

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!title) {
            return new NextResponse("Name is required", {status: 400})
        }

        if(!label) {
            return new NextResponse("Value is required", {status: 400})
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

        const blog = await prismadb.blog.create({
            data: {
                title, 
                label, 
                siteId: params.siteId,
            }
        })

        return NextResponse.json(blog);

    } catch (error) {
        console.log('[SIZES_POST]', error)
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

        const posts = await prismadb.blog.findMany({
            where: {
                siteId: params.siteId
            }
        })

        return NextResponse.json(posts);

    } catch (error) {
        console.log('[POSTS_GET]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}