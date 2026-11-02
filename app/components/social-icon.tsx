export const SocialIcon = ({
  href,
  label,
  d,
  viewBox = "0 0 512 512",
}: {
  href: string;
  label: string;
  d: string;
  viewBox?: string;
}) => {
  const isEmail = href.startsWith("mailto:");

  return (
    <a
      className="btn btn-ghost btn-circle"
      href={href}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noreferrer"}
      aria-label={label}
      data-contact-trigger={isEmail ? "" : undefined}
      aria-haspopup={isEmail ? "dialog" : undefined}
      aria-controls={isEmail ? "contact-dialog" : undefined}
    >
      <span className="sr-only">{label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        className="h-5 w-5 fill-current"
        aria-hidden="true"
      >
        <path d={d} />
      </svg>
    </a>
  );
};
