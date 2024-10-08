import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {

        if(!params.categoryId) {
            return new NextResponse("Category id is required", {status: 400})
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
            include: {
                image: true
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('CATEGORY_GET', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function PATCH (
    req: Request,
    { params }: { params: { siteId: string, categoryId: string } }
) {
    try {
        const supabase = createClient();
        
        const {

            data: { user },
            
        } = await supabase.auth.getUser();

        const body = await req.json();

        const { name, imageId } = body;

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        if(!imageId) {
            return new NextResponse("Image id is required", {status: 400})
        }

        if(!params.categoryId) {
            return new NextResponse("Category id is required", {status: 400})
        }

        const storeByUserId = await prismadb.site.findFirst({
            where: {
                id: params.siteId,
                userId: user.id,
            }
        })
        
        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                imageId
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('CATEGORY_PATCH', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function DELETE (
    req: Request,
    { params }: { params: { siteId: string, categoryId: string } }
) {
    try {
        const supabase = createClient();
        
        const {

            data: { user },
            
        } = await supabase.auth.getUser();

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!params.categoryId) {
            return new NextResponse("Category id is required", {status: 400})
        }

        const storeByUserId = await prismadb.site.findFirst({
            where: {
                id: params.siteId,
                userId: user.id,
            }
        })
        
        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            },
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('CATEGORY_DELETE', error)
        return new NextResponse("Internal error", {status: 500})
    }
}