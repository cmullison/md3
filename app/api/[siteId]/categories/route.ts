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

        const { name, heroId } = body;

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        if(!heroId) {
            return new NextResponse("Hero id is required", {status: 400})
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

        const category = await prismadb.category.create({
            data: {
                name, 
                heroId, 
                siteId: params.siteId
            }
        })

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORIES_POST]', error)
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

        const categories = await prismadb.category.findMany({
            where: {
                siteId: params.siteId
            }
        })

        return NextResponse.json(categories);

    } catch (error) {
        console.log('[CATEGORIES_GET]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}