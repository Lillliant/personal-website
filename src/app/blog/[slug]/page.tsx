import { notFound } from "next/navigation";
import { posts } from "#site/content";
import { MDXContent } from "@/components/mdxContent";
import { formatShortDate } from "@/utils/formatDate";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        <time dateTime={post.date}>{formatShortDate(post.date)}</time>
        <span aria-hidden="true"> · </span>
        <span>{post.readingTime} min read</span>
      </p>
      <hr className="my-6" />
      <MDXContent code={post.body} />
    </article>
  );
}
