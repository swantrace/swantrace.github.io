import { url } from "../utils/url";

export const HeroSection = () => {
  return (
    <section className="hero justify-start py-10 sm:py-14 lg:pt-8 lg:pb-16">
      <div className="hero-content max-w-3xl p-0 text-left">
        <div>
          <p className="mb-3 text-xl">
            Hey there <span aria-hidden="true">👋</span>
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            I'm Fred Hong
          </h1>
          <p className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Senior full-stack engineer.
          </p>
          <p className="text-base-content/75 mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
            I design and deliver complex web applications with React,
            TypeScript, and Node.js. My 8+ years of experience span frontend
            engineering, healthcare interoperability, security, and AI
            applications.
          </p>
          <p className="text-base-content/60 mt-3 text-sm leading-relaxed sm:text-base">
            Available for long-term full-time opportunities.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <contact-form
              service-id={import.meta.env.VITE_EMAILJS_SERVICE_ID || ""}
              template-id={import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ""}
              public-key={import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ""}
            >
              <a
                className="btn"
                href="mailto:frederickhong.5@gmail.com"
                aria-label="Let's connect by email"
              >
                Let's connect <span aria-hidden="true">↗</span>
              </a>
            </contact-form>
            <a className="btn btn-outline" href={url("/projects")}>
              View my work <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
