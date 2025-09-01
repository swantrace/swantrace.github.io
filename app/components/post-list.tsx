import { PostListItem } from "./post-list-item";

interface PostMeta {
  slug: string;
  title: string;
  date: string | null;
  tags: string[];
  topic: [string, number] | null;
  draft: boolean;
  excerpt: string;
}

interface PostListProps {
  posts: PostMeta[];
}

export const PostList = ({ posts }: PostListProps) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostListItem key={post.slug} post={post} />
      ))}
    </div>
  );
};
