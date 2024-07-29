import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params }: { params: { siteId: string, pageId: string } }
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

        const { title, label, imageUrl } = body;

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

        if(!params.pageId) {
            return new NextResponse("Page id is required", {status: 400})
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

        const page = await prismadb.page.updateMany({
            where: {
                id: params.pageId,
            },
            data: {
                label,
                title,
                imageUrl
            }
        })

        return NextResponse.json(page)

    } catch (error) {
        console.log('PAGE_PATCH', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function DELETE (
    req: Request,
    { params }: { params: { siteId: string, pageId: string } }
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

        if(!params.pageId) {
            return new NextResponse("Page id is required", {status: 400})
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

        const page = await prismadb.page.deleteMany({
            where: {
                id: params.pageId,
            },
        })

        return NextResponse.json(page)

    } catch (error) {
        console.log('PAGE_DELETE', error)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function GET (
    req: Request,
    { params }: { params: { pageId: string } }
) {
    try {

        if(!params.pageId) {
            return new NextResponse("Page id is required", {status: 400})
        }

        const page = await prismadb.page.findUnique({
            where: {
                id: params.pageId,
            },
        })

        return NextResponse.json(page)

    } catch (error) {
        console.log('PAGE_GET', error)
        return new NextResponse("Internal error", {status: 500})
    }
}