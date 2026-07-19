import { SocialIcons } from "./social-icons";

export const HeroSection = () => {
  return (
    <section className="hero bg-base-100 min-h-[60vh]">
      <div className="hero-content max-w-3xl px-0 text-center lg:text-left">
        <div>
          <p className="text-primary mb-4 font-semibold tracking-wide uppercase">
            Full-stack engineer
          </p>
          <h1 className="text-5xl font-bold">Fred Hong</h1>
          <p className="text-base-content/75 max-w-2xl py-6 text-xl leading-relaxed">
            Full-stack engineer specializing in React, TypeScript, and FHIR
            interoperability.
          </p>
          <p className="text-base-content/65 mb-6">
            Based in Edmonton, Canada, with 8+ years of experience. Available
            for long-term full-time opportunities.
          </p>
          <SocialIcons />
        </div>
      </div>
    </section>
  );
};
