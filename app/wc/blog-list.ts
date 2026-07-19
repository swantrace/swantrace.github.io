import { html, component, useState, useEffect } from "haunted";

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
    selectedTags.forEach((tag) => params.append("tag", tag));
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
    posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
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
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <div class="space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-semibold">Filter by tags:</span>
              ${allTags.map(
                (tag) => html`
                  <button
                    class="btn btn-sm ${selectedTags.includes(tag)
                      ? "btn-primary"
                      : "btn-outline"}"
                    @click=${() => handleTagToggle(tag)}
                  >
                    ${tag}
                  </button>
                `
              )}
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <span class="font-semibold">Filter by topic:</span>
              <button
                class="btn btn-sm ${!selectedTopic ? "btn-primary" : "btn-outline"}"
                @click=${() => handleTopicChange(null)}
              >
                All Topics
              </button>
              ${allTopics.map(
                (topic) => html`
                  <button
                    class="btn btn-sm ${selectedTopic === topic
                      ? "btn-primary"
                      : "btn-outline"}"
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
                      class="btn btn-secondary btn-sm"
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
      <div class="flex items-center justify-between">
        <div class="stat">
          <div class="stat-value text-lg">
            ${filteredPosts.length} post${filteredPosts.length !== 1 ? "s" : ""}
          </div>
          <div class="stat-desc">
            ${
              selectedTags.length > 0 || selectedTopic
                ? html`filtered from ${posts.length} total`
                : "found"
            }
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Posts per page:</span>
          </label>
          <select
            class="select select-bordered select-sm"
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
      <div class="space-y-6">
        ${
          paginatedPosts.length === 0
            ? html`
                <div class="alert alert-info">
                  <span>No posts found matching your filters.</span>
                </div>
              `
            : paginatedPosts.map(
                (post) => html`
                <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                  <div class="card-body">
                    <h2 class="card-title">
                      <a
                        href="/blog/${post.slug}"
                        class="link link-hover"
                      >
                        ${post.title}
                      </a>
                    </h2>

                    <div class="flex flex-wrap items-center gap-2">
                      <div class="text-sm opacity-70">
                        <time datetime="${post.date}">${formatDate(post.date)}</time>
                      </div>

                      ${
                        post.topic
                          ? html`
                              <div class="badge badge-secondary">
                                📚 ${post.topic[0]}
                              </div>
                            `
                          : ""
                      }
                    </div>

                    ${
                      post.tags.length > 0
                        ? html`
                            <div class="flex flex-wrap gap-2">
                              ${post.tags.map(
                                (tag) => html`
                                  <div class="badge badge-outline">#${tag}</div>
                                `
                              )}
                            </div>
                          `
                        : ""
                    }
                    <p class="text-base-content/70">${post.excerpt}</p>
                    <div class="card-actions justify-end">
                      <a
                        href="/blog/${post.slug}"
                        class="btn btn-primary btn-sm"
                      >
                        Read more →
                      </a>
                    </div>
                  </div>
                </div>
              `
              )
        }
      </div>

      <!-- Pagination -->
      ${
        totalPages > 1
          ? html`
              <div class="flex items-center justify-center space-x-2">
                <button
                  class="rounded border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                        class="${isCurrentPage
                          ? "bg-blue-500 text-white border-blue-500"
                          : "border-gray-300 hover:bg-gray-50"} rounded border px-3 py-2 text-sm transition-colors"
                        @click=${() => handlePageChange(page)}
                      >
                        ${page}
                      </button>
                    `;
                  }
                )}

                <button
                  class="rounded border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  ?disabled=${currentPage === totalPages}
                  @click=${() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
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
