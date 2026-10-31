import { RecentPostCard } from "./recent-post-card";

export const PostListItem = ({ post }: { post: PostMeta }) => (
  <RecentPostCard {...post} />
);
