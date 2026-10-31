import type { CvExperience } from "../data/cv";

export const ExperienceTimeline = ({
  experiences,
}: {
  experiences: readonly CvExperience[];
}) => (
  <ul
    aria-label="Work experience"
    className="timeline timeline-vertical timeline-snap-icon timeline-compact w-full"
  >
    {experiences.map((experience, index) => (
      <li key={experience.id} className="min-w-0 [--timeline-col-start:0]">
        {index > 0 && <hr />}
        <div className="timeline-middle" aria-hidden="true">
          <span className="bg-base-content block size-2.5 rounded-full" />
        </div>
        <article className="timeline-end m-0 mb-10 min-w-0 w-full pl-5 sm:pl-7">
          <p className="text-base-content/60 mb-2 font-mono text-xs">
            <time dateTime={experience.startDate}>
              {experience.displayDates.split(" - ")[0]}
            </time>
            {" — "}
            <time dateTime={experience.endDate}>
              {experience.displayDates.split(" - ")[1]}
            </time>
          </p>
          <h3 className="text-xl font-semibold tracking-tight">
            {experience.role}
          </h3>
          <p className="mt-1 font-medium">{experience.company}</p>
          <p className="text-base-content/55 mt-1 text-xs">
            {experience.context}
          </p>
          <p className="text-base-content/75 mt-4 text-sm leading-relaxed">
            {experience.summary}
          </p>
          <ul className="text-base-content/75 mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed marker:text-base-content/30">
            {experience.primaryWork.map((work) => (
              <li key={work}>{work}</li>
            ))}
          </ul>
        </article>
        {index < experiences.length - 1 && <hr />}
      </li>
    ))}
  </ul>
);
