import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { createClient } from '@/utils/supabase/server';

export async function POST(
  req: Request,
  { params }: { params: { siteId: string } }
) {
  try {
        const supabase = createClient();
        
        const {
      
            data: { user },
            
        } = await supabase.auth.getUser();

    const body = await req.json();

    const { name, price, categoryId, sizeId, images, isFeatured, isArchived } = body;

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!params.siteId) {
      return new NextResponse("Site id is required", { status: 400 });
    }

    const siteByUserId = await prismadb.site.findFirst({
      where: {
        id: params.siteId,
        userId: user.id,
      }
    });

    if (!siteByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        siteId: params.siteId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { siteId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.siteId) {
      return new NextResponse("Site id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        siteId: params.siteId,
        categoryId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};