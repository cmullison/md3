import prismadb from "@/lib/prismadb";
import { BlogClient } from "./components/client";
import { BlogColumn } from "./components/columns";
import { format } from "date-fns";

const BlogPage = async ({ params }: { params: { siteId: string } }) => {
  const posts = await prismadb.blog.findMany({
    where: {
      siteId: params.siteId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedPosts: BlogColumn[] = posts.map((item) => ({
    id: item.id,
    title: item.title,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BlogClient data={formattedPosts} />
      </div>
    </div>
  );
};

export default BlogPage;
