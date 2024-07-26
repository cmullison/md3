import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server"



export async function GET (
    req: Request,
    { params }: { params: { sizeId: string } }
) {
    try {

        if(!params.sizeId) {
            return new NextResponse("Size id is required", {status: 400})
        }
        
        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            },
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log('SIZE_GET', error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { siteId: string, sizeId: string } }
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

        if(!params.sizeId) {
            return new NextResponse("Size id is required", {status: 400})
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

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log('SIZE_PATCH', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function DELETE (
    req: Request,
    { params }: { params: { siteId: string, sizeId: string } }
) {
    try {
        const supabase = createClient();
        
        const {
      
            data: { user },
            
        } = await supabase.auth.getUser();

        if(!user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!params.sizeId) {
            return new NextResponse("Size id is required", {status: 400})
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

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            },
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log('SIZE_DELETE', error)
        return new NextResponse("Internal error", {status: 500})
    }
}