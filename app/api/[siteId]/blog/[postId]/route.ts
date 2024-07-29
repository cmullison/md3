import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server"



export async function GET (
    req: Request,
    { params }: { params: { postId: string } }
) {
    try {

        if(!params.postId) {
            return new NextResponse("Post id is required", {status: 400})
        }
        
        const post = await prismadb.blog.findUnique({
            where: {
                id: params.postId,
            },
        })

        return NextResponse.json(post)

    } catch (error) {
        console.log('POST_GET', error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { siteId: string, postId: string } }
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

        if(!params.postId) {
            return new NextResponse("Post id is required", {status: 400})
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

        const post = await prismadb.blog.updateMany({
            where: {
                id: params.postId,
            },
            data: {
                title,
                label,
            }
        })

        return NextResponse.json(post)

    } catch (error) {
        console.log('POST_PATCH', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function DELETE (
    req: Request,
    { params }: { params: { siteId: string, postId: string } }
) {
    try {
        const supabase = createClient();
        
        const {
      
            data: { user },
            
        } = await supabase.auth.getUser();

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!params.postId) {
            return new NextResponse("Post id is required", {status: 400})
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

        const post = await prismadb.blog.deleteMany({
            where: {
                id: params.postId,
            },
        })

        return NextResponse.json(post)

    } catch (error) {
        console.log('POST_DELETE', error)
        return new NextResponse("Internal error", {status: 500})
    }
}