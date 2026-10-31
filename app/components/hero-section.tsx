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
            Full-stack engineer.
          </p>
          <p className="text-base-content/75 mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
            I build web applications with React and TypeScript, specializing in
            FHIR interoperability. Based in Edmonton, Canada, with 8+ years of
            experience.
          </p>
          <p className="text-base-content/60 mt-3 text-sm leading-relaxed sm:text-base">
            Available for long-term full-time opportunities.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn" href="mailto:frederickhong.5@gmail.com">
              Let's connect <span aria-hidden="true">↗</span>
            </a>
            <a className="btn btn-outline" href={url("/projects")}>
              View my work <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
