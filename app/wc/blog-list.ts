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
      <div class="bg-gray-50 rounded-lg p-4 space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-medium text-gray-700">Filter by tags:</span>
          ${allTags.map(
            (tag) => html`
              <button
                class="px-3 py-1 text-sm rounded-full border transition-colors ${selectedTags.includes(
                  tag
                )
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"}"
                @click=${() => handleTagToggle(tag)}
              >
                ${tag}
              </button>
            `
          )}
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span class="font-medium text-gray-700">Filter by topic:</span>
          <button
            class="px-3 py-1 text-sm rounded-full border transition-colors ${!selectedTopic
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"}"
            @click=${() => handleTopicChange(null)}
          >
            All Topics
          </button>
          ${allTopics.map(
            (topic) => html`
              <button
                class="px-3 py-1 text-sm rounded-full border transition-colors ${selectedTopic ===
                topic
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"}"
                @click=${() => handleTopicChange(topic)}
              >
                ${topic}
              </button>
            `
          )}
        </div>

        ${selectedTags.length > 0 || selectedTopic
          ? html`
              <button
                class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                @click=${clearFilters}
              >
                Clear Filters
              </button>
            `
          : ""}
      </div>

      <!-- Results Info -->
      <div class="flex justify-between items-center">
        <div class="text-gray-600">
          ${filteredPosts.length} post${filteredPosts.length !== 1 ? "s" : ""}
          found
          ${selectedTags.length > 0 || selectedTopic
            ? html`
                <span class="text-sm">
                  (filtered from ${posts.length} total)
                </span>
              `
            : ""}
        </div>

        <div class="flex items-center gap-2">
          <label for="posts-per-page" class="text-sm font-medium"
            >Posts per page:</label
          >
          <select
            id="posts-per-page"
            class="border border-gray-300 rounded px-2 py-1 text-sm"
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
        ${paginatedPosts.length === 0
          ? html`
              <div class="text-center py-8 text-gray-500">
                No posts found matching your filters.
              </div>
            `
          : paginatedPosts.map(
              (post) => html`
                <article
                  class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <header class="space-y-2">
                    <h2 class="text-2xl font-bold">
                      <a
                        href="/blog/${post.slug}"
                        class="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        ${post.title}
                      </a>
                    </h2>

                    <div
                      class="flex flex-wrap items-center gap-4 text-sm text-gray-600"
                    >
                      <time datetime="${post.date}"
                        >${formatDate(post.date)}</time
                      >

                      ${post.topic
                        ? html`
                            <span
                              class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
                            >
                              📚 ${post.topic[0]}
                            </span>
                          `
                        : ""}
                    </div>

                    ${post.tags.length > 0
                      ? html`
                          <div class="flex flex-wrap gap-2">
                            ${post.tags.map(
                              (tag) => html`
                                <span
                                  class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                                >
                                  #${tag}
                                </span>
                              `
                            )}
                          </div>
                        `
                      : ""}
                  </header>

                  <div class="mt-4">
                    <p class="text-gray-700 leading-relaxed">${post.excerpt}</p>
                    <a
                      href="/blog/${post.slug}"
                      class="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Read more →
                    </a>
                  </div>
                </article>
              `
            )}
      </div>

      <!-- Pagination -->
      ${totalPages > 1
        ? html`
            <div class="flex justify-center items-center space-x-2">
              <button
                class="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      class="px-3 py-2 text-sm border rounded transition-colors ${isCurrentPage
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-gray-300 hover:bg-gray-50"}"
                      @click=${() => handlePageChange(page)}
                    >
                      ${page}
                    </button>
                  `;
                }
              )}

              <button
                class="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                ?disabled=${currentPage === totalPages}
                @click=${() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          `
        : ""}
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
