import { createRoute } from "honox/factory";
import { ExperienceTimeline } from "../components/experience-timeline";
import { SectionTitle } from "../components/section-title";
import { SocialIcons } from "../components/social-icons";
import { cv } from "../data/cv";
import { url } from "../utils/url";

export default createRoute((c) =>
  c.render(
    <main className="cv-page py-8">
      <title>CV — Fred Hong</title>
      <meta
        name="description"
        content="Fred Hong’s resume: full-stack engineering, frontend development, healthcare interoperability, professional experience, technical skills, and research contributions."
      />
      <header className="border-base-300/60 border-b pb-10">
        <p className="text-base-content/55 mb-4 font-mono text-xs tracking-widest uppercase">
          Curriculum vitae
        </p>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {cv.name}
            </h1>
            <p className="mt-3 text-xl font-medium sm:text-2xl">
              {cv.headline}
            </p>
          </div>
          <div className="cv-actions">
            <cv-print>
              <button type="button" className="btn btn-outline btn-sm" disabled>
                Print / save PDF
              </button>
            </cv-print>
            <noscript>
              <p className="text-base-content/60 mt-2 text-xs">
                Use your browser’s Print option to save a PDF.
              </p>
            </noscript>
          </div>
        </div>
        <p className="text-base-content/75 mt-7 max-w-2xl leading-relaxed">
          {cv.summary}
        </p>
        <div className="cv-contact mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <a
            className="link link-hover"
            href="mailto:frederickhong.5@gmail.com"
          >
            frederickhong.5@gmail.com
          </a>
          <SocialIcons />
        </div>
      </header>

      <nav
        aria-label="Resume sections"
        className="cv-section-nav border-base-300/60 flex flex-wrap gap-x-6 gap-y-3 border-b py-5 text-sm"
      >
        <a className="link link-hover" href="#experience">
          Experience{" "}
          <span className="text-base-content/45 ml-1">
            {String(cv.experiences.length).padStart(2, "0")}
          </span>
        </a>
        <a className="link link-hover" href="#skills">
          Skills
        </a>
        <a className="link link-hover" href="#research">
          Research
        </a>
        <a
          className="link link-hover text-base-content/60 sm:ml-auto"
          href={url("/projects")}
        >
          Project case studies ↗
        </a>
      </nav>

      <section
        id="experience"
        aria-labelledby="experience-title"
        className="cv-section mt-10"
      >
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2
            id="experience-title"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Work experience
          </h2>
          <span className="text-base-content/50 font-mono text-xs">
            2017 — 2025
          </span>
        </div>
        <ExperienceTimeline experiences={cv.experiences} />
      </section>

      <section
        id="skills"
        aria-label="Technical skills"
        className="cv-section border-base-300/60 border-t pt-10"
      >
        <SectionTitle>Technical skills</SectionTitle>
        <div className="mt-7 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
          {cv.skillCategories.map((category) => (
            <div key={category.id} className="cv-skill-group min-w-0">
              <h3 className="mb-3 text-sm font-semibold">{category.label}</h3>
              <ul className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li key={skill}>
                    <span className="badge badge-ghost badge-sm h-auto min-h-6 py-1 whitespace-normal">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="research"
        aria-label="Publications and research"
        className="cv-section border-base-300/60 mt-12 border-t pt-10"
      >
        <SectionTitle>Publications &amp; research</SectionTitle>
        <div className="mt-7 space-y-8">
          {cv.publications.map((publication) => (
            <article key={publication.id} className="cv-publication">
              <p className="text-base-content/55 mb-2 font-mono text-xs">
                {publication.year} <span aria-hidden="true">/</span>{" "}
                {publication.kind}
              </p>
              <h3 className="text-lg font-semibold leading-snug">
                <a
                  className="link link-hover"
                  href={publication.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {publication.title} <span aria-hidden="true">↗</span>
                </a>
              </h3>
              <p className="text-base-content/65 mt-2 text-sm leading-relaxed">
                {publication.authors.map((author, index) => (
                  <span key={author.name}>
                    {index > 0 ? "; " : ""}
                    {author.isCandidate ? (
                      <strong className="text-base-content font-medium">
                        {author.name}
                      </strong>
                    ) : (
                      author.name
                    )}
                  </span>
                ))}
                {publication.authorListIsTruncated && "; et al."}
              </p>
              {publication.venue && (
                <p className="text-base-content/60 mt-1 text-sm italic">
                  {publication.venue}
                </p>
              )}
              <p className="text-base-content/75 mt-3 text-sm leading-relaxed">
                <span className="font-medium">Contributions:</span>{" "}
                {publication.contributions.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
);
