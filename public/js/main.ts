// Anthropic Clone - Main TypeScript

// Types for post data
interface PostData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  published?: boolean;
}

interface ApiResponse {
  success: boolean;
  id?: number;
  error?: string;
}

document.addEventListener("DOMContentLoaded", function () {
  // Header scroll effect
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector(".nav-list");

  if (menuToggle && navList) {
    menuToggle.addEventListener("click", function () {
      navList.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });
  }

  // Word reveal animation for hero
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const text = heroTitle.textContent?.trim() ?? "";
    const words = text.split(" ");
    heroTitle.innerHTML = words
      .map((word) => `<span class="word">${word}</span>`)
      .join(" ");
  }

  // Scroll reveal animations
  const revealElements = document.querySelectorAll(".reveal");

  function checkReveal(): void {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add("active");
      }
    });
  }

  if (revealElements.length > 0) {
    window.addEventListener("scroll", checkReveal);
    checkReveal(); // Initial check
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (this: HTMLAnchorElement, e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // Card hover effects
  const cards = document.querySelectorAll<HTMLElement>(".card, .value-card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function (this: HTMLElement) {
      this.style.transform = "translateY(-4px)";
    });

    card.addEventListener("mouseleave", function (this: HTMLElement) {
      this.style.transform = "translateY(0)";
    });
  });

  // Dropdown keyboard accessibility
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    const link = item.querySelector(".nav-link");
    const dropdown = item.querySelector<HTMLElement>(".dropdown");

    if (link && dropdown) {
      link.addEventListener("keydown", function (e) {
        if (
          e instanceof KeyboardEvent &&
          (e.key === "Enter" || e.key === " ")
        ) {
          e.preventDefault();
          dropdown.style.opacity = dropdown.style.opacity === "1" ? "0" : "1";
          dropdown.style.visibility =
            dropdown.style.visibility === "visible" ? "hidden" : "visible";
        }
      });
    }
  });
});

// Toast notification utility
function showToast(message: string, type: string = "default"): void {
  // Remove existing toasts
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Slug generator utility
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Format date utility
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// API helper functions
async function apiRequest<T = ApiResponse>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "An error occurred");
    }

    return data as T;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Create post
async function createPost(postData: PostData): Promise<ApiResponse> {
  return apiRequest<ApiResponse>("/api/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
}

// Update post
async function updatePost(
  id: number,
  postData: PostData,
): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/api/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(postData),
  });
}

// Delete post
async function deletePost(id: number): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/api/posts/${id}`, {
    method: "DELETE",
  });
}

// Intersection Observer for lazy loading
function setupLazyLoading(): void {
  const lazyImages =
    document.querySelectorAll<HTMLImageElement>("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      }
    });
  }
}

// Initialize lazy loading
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupLazyLoading);
} else {
  setupLazyLoading();
}

// Debounce utility
function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: unknown, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Export for global access (if needed)
declare global {
  interface Window {
    showToast: typeof showToast;
    generateSlug: typeof generateSlug;
    formatDate: typeof formatDate;
    createPost: typeof createPost;
    updatePost: typeof updatePost;
    deletePost: typeof deletePost;
    debounce: typeof debounce;
    throttle: typeof throttle;
  }
}

// Attach to window for global access from inline scripts
if (typeof window !== "undefined") {
  window.showToast = showToast;
  window.generateSlug = generateSlug;
  window.formatDate = formatDate;
  window.createPost = createPost;
  window.updatePost = updatePost;
  window.deletePost = deletePost;
  window.debounce = debounce;
  window.throttle = throttle;
}
