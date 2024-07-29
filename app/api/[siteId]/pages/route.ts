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

        const { label, title, imageUrl } = body;

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!label) {
            return new NextResponse("Label is required", {status: 400})
        }

        if(!title) {
            return new NextResponse("Label is required", {status: 400})
        }

        if(!imageUrl) {
            return new NextResponse("ImageUrl is required", {status: 400})
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

        const page = await prismadb.page.create({
            data: {
                label, 
                title,
                imageUrl, 
                siteId: params.siteId
            }
        })

        return NextResponse.json(page);

    } catch (error) {
        console.log('[PAGES_POST]', error)
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

        const page = await prismadb.page.findMany({
            where: {
                siteId: params.siteId
            }
        })

        return NextResponse.json(page);

    } catch (error) {
        console.log('[PAGES_GET]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}