import { component, html, useEffect, useState } from "haunted";
import { url } from "../utils/url";

interface PostMeta {
  slug: string;
  title: string;
  date: string | null;
  tags: string[];
  topic: [string, number] | null;
  draft: boolean;
  excerpt: string;
}

// Enhanced div that can be progressively enhanced
class BlogListDiv extends HTMLDivElement {
  connectedCallback() {
    // Only enhance if we have posts-data attribute
    if (this.getAttribute("posts-data")) {
      this.enhanceWithBlogList();
    }
    // Otherwise, keep static content as-is for progressive enhancement
  }

  enhanceWithBlogList() {
    // Store the posts data
    const postsData = this.getAttribute("posts-data");

    // Clear existing content and create blog-list element
    this.innerHTML = "";
    const blogList = document.createElement("blog-list");
    blogList.setAttribute("posts-data", postsData!);
    blogList.className = this.className; // Copy classes

    // Replace this div with the blog-list component
    this.parentNode?.replaceChild(blogList, this);
  }

  static get observedAttributes() {
    return ["posts-data"];
  }
}

function BlogList(element: HTMLElement) {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostMeta[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Get posts data from attribute
  useEffect(() => {
    const postsData = element.getAttribute("posts-data");
    if (postsData) {
      try {
        const parsedPosts = JSON.parse(postsData);
        setPosts(parsedPosts);
        setFilteredPosts(parsedPosts);
      } catch (e) {
        console.error("Failed to parse posts data:", e);
      }
    }
  }, [element.getAttribute("posts-data")]);

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tags = params.getAll("tag");
    const topic = params.get("topic");
    const page = parseInt(params.get("current_page") || "1", 10);
    const size = parseInt(params.get("per_page") || "10", 10);

    setSelectedTags(tags);
    setSelectedTopic(topic);
    setCurrentPage(Math.max(1, page));
    setPerPage(Math.max(1, Math.min(50, size)));
  }, []);

  // Filter posts
  useEffect(() => {
    let filtered = [...posts];

    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.every((tag) =>
          post.tags.some((postTag) =>
            postTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    if (selectedTopic) {
      filtered = filtered.filter((post) =>
        post.topic?.[0]?.toLowerCase().includes(selectedTopic.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [selectedTags, selectedTopic, posts]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    selectedTags.forEach((tag) => {
      params.append("tag", tag);
    });
    if (selectedTopic) params.set("topic", selectedTopic);
    if (currentPage > 1) params.set("current_page", currentPage.toString());
    if (perPage !== 10) params.set("per_page", perPage.toString());

    const newUrl = params.toString()
      ? `${location.pathname}?${params.toString()}`
      : location.pathname;

    history.replaceState(null, "", newUrl);
  }, [selectedTags, selectedTopic, currentPage, perPage]);

  // Helper functions
  const getAllTags = () => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tags.add(tag);
      });
    });
    return Array.from(tags).sort();
  };

  const getAllTopics = () => {
    const topics = new Set<string>();
    posts.forEach((post) => {
      if (post.topic) topics.add(post.topic[0]);
    });
    return Array.from(topics).sort();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  const getPaginatedPosts = () => {
    const start = (currentPage - 1) * perPage;
    return filteredPosts.slice(start, start + perPage);
  };

  const getTotalPages = () => Math.ceil(filteredPosts.length / perPage);

  // Event handlers
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleTopicChange = (topic: string | null) => {
    setSelectedTopic(topic);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedTopic(null);
    setCurrentPage(1);
  };

  const paginatedPosts = getPaginatedPosts();
  const totalPages = getTotalPages();
  const allTags = getAllTags();
  const allTopics = getAllTopics();

  return html`
    <div class="space-y-6">
      <!-- Filters Section -->
      <div class="blog-filters">
        <div>
          <div class="space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-base-content/70 text-sm font-medium">Filter by tags:</span>
              ${allTags.map(
                (tag) => html`
                  <button
                    class="btn btn-sm ${
                      selectedTags.includes(tag) ? "btn-active" : "btn-ghost"
                    }"
                    type="button"
                    aria-pressed=${selectedTags.includes(tag)}
                    @click=${() => handleTagToggle(tag)}
                  >
                    ${tag}
                  </button>
                `
              )}
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <span class="text-base-content/70 text-sm font-medium">Filter by topic:</span>
              <button
                class="btn btn-sm ${!selectedTopic ? "btn-active" : "btn-ghost"}"
                type="button"
                aria-pressed=${!selectedTopic}
                @click=${() => handleTopicChange(null)}
              >
                All Topics
              </button>
              ${allTopics.map(
                (topic) => html`
                  <button
                    class="btn btn-sm ${
                      selectedTopic === topic ? "btn-active" : "btn-ghost"
                    }"
                    type="button"
                    aria-pressed=${selectedTopic === topic}
                    @click=${() => handleTopicChange(topic)}
                  >
                    ${topic}
                  </button>
                `
              )}
            </div>

            ${
              selectedTags.length > 0 || selectedTopic
                ? html`
                    <button
                      class="btn btn-outline btn-sm"
                      type="button"
                      @click=${clearFilters}
                    >
                      Clear Filters
                    </button>
                  `
                : ""
            }
          </div>
        </div>
      </div>

      <!-- Results Info -->
      <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div aria-live="polite" aria-atomic="true">
          <div class="font-medium">
            ${filteredPosts.length} post${filteredPosts.length !== 1 ? "s" : ""}
          </div>
          <div class="text-base-content/60 text-xs">
            ${
              selectedTags.length > 0 || selectedTopic
                ? html`filtered from ${posts.length} total`
                : "found"
            }
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label for="posts-per-page">Posts per page:</label>
          <select
            id="posts-per-page"
            class="select select-sm w-20"
            .value=${perPage.toString()}
            @change=${(e: Event) =>
              handlePerPageChange(
                parseInt((e.target as HTMLSelectElement).value, 10)
              )}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <!-- Posts List -->
      <div class="space-y-3">
        ${
          paginatedPosts.length === 0
            ? html`
                <div class="bg-base-200/70 text-base-content/70 rounded-xl px-4 py-4 text-sm">
                  <span>No posts found matching your filters.</span>
                </div>
              `
            : paginatedPosts.map(
                (post) => html`
                <article class="card post-card">
                  <div class="card-body gap-3 p-0">
                    <div class="post-meta">
                      ${post.date ? html`<time datetime="${post.date}">${formatDate(post.date)}</time>` : ""}
                      ${post.topic ? html`<span>${post.topic[0]}</span>` : ""}
                    </div>
                    <h2 class="card-title text-xl leading-snug">
                      <a
                        href=${url(`/blog/${post.slug}`)}
                        class="link link-hover"
                      >
                        ${post.title} <span class="text-base-content/40" aria-hidden="true">↗</span>
                      </a>
                    </h2>
                    <p class="text-base-content/70 text-sm leading-relaxed sm:text-base">${post.excerpt}</p>

                    ${
                      post.tags.length > 0
                        ? html`
                            <div class="flex flex-wrap gap-1.5">
                              ${post.tags.map(
                                (tag) => html`
                                  <span class="badge badge-ghost badge-sm">${tag}</span>
                                `
                              )}
                            </div>
                          `
                        : ""
                    }
                  </div>
                </article>
              `
              )
        }
      </div>

      <!-- Pagination -->
      ${
        totalPages > 1
          ? html`
              <nav aria-label="Blog pagination" class="flex flex-wrap items-center justify-center gap-2">
                <button
                  class="btn btn-ghost btn-sm"
                  ?disabled=${currentPage === 1}
                  @click=${() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>

                ${Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    const isCurrentPage = page === currentPage;
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 2;

                    if (!showPage && page !== 2 && page !== totalPages - 1) {
                      return page === 3 || page === totalPages - 2
                        ? html`<span class="px-2">...</span>`
                        : "";
                    }

                    return html`
                      <button
                        class="${
                          isCurrentPage ? "btn-active" : "btn-ghost"
                        } btn btn-sm"
                        aria-label=${`Page ${page}`}
                        aria-current=${isCurrentPage ? "page" : "false"}
                        @click=${() => handlePageChange(page)}
                      >
                        ${page}
                      </button>
                    `;
                  }
                )}

                <button
                  class="btn btn-ghost btn-sm"
                  ?disabled=${currentPage === totalPages}
                  @click=${() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </nav>
            `
          : ""
      }
    </div>
  `;
}

// Register both the enhanced div and the regular blog-list component
customElements.define("blog-list-div", BlogListDiv, { extends: "div" });

customElements.define(
  "blog-list",
  component(BlogList, {
    observedAttributes: ["posts-data"],
    useShadowDOM: false,
  })
);
