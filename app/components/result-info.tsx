interface PostMeta {
  slug: string;
  title: string;
  date: string | null;
  tags: string[];
  topic: [string, number] | null;
  draft: boolean;
  excerpt: string;
}

interface ResultInfoProps {
  posts: PostMeta[];
}

export const ResultInfo = ({ posts }: ResultInfoProps) => {
  const postsCount = posts.length;

  return (
    <div className="flex justify-between items-center">
      <div className="text-gray-600">
        {postsCount} post{postsCount !== 1 ? "s" : ""} found
      </div>

      <div className="flex items-center gap-2">
        <label for="posts-per-page" className="text-sm font-medium">
          Posts per page:
        </label>
        <select
          id="posts-per-page"
          className="border border-gray-300 rounded px-2 py-1 text-sm cursor-not-allowed opacity-75"
          disabled
        >
          <option value="10">10</option>
        </select>
      </div>
    </div>
  );
};
