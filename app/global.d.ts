import type {} from "hono";

declare module "hono" {
  interface Env {
    Variables: {};
    Bindings: {};
  }
}

declare global {
  interface PostMeta {
    slug: string;
    title: string;
    date: string | null;
    tags: string[];
    topic: [string, number] | null; // tuple: [topicName, order]
    draft: boolean;
    excerpt: string;
  }

  interface ProjectMeta {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    github: string | null;
    demo: string | null;
    image: string | null;
    featured: boolean;
    order: number;
  }
  namespace JSX {
    interface IntrinsicElements {
      "blog-list": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "copy-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { text?: string },
        HTMLElement
      >;
      "theme-switcher": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      // Allow customized built-in divs like: <div is="blog-list-div" posts-data="...">...
      div: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement> & {
          is?: string;
          "posts-data"?: string;
        },
        HTMLDivElement
      >;

      // Allow basic head elements used by Hono for metadata hoisting
      title: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLTitleElement>,
        HTMLTitleElement
      >;
      meta: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLMetaElement> & {
          name?: string;
          content?: string;
          property?: string;
          charSet?: string;
        },
        HTMLMetaElement
      >;
    }
  }
}
