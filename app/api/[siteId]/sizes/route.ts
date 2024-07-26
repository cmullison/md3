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

        const { name, value } = body;

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        if(!value) {
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

        const size = await prismadb.size.create({
            data: {
                name, 
                value, 
                siteId: params.siteId
            }
        })

        return NextResponse.json(size);

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

        const sizes = await prismadb.size.findMany({
            where: {
                siteId: params.siteId
            }
        })

        return NextResponse.json(sizes);

    } catch (error) {
        console.log('[SIZES_GET]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}