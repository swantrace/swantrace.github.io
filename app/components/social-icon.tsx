export const SocialIcon = ({
  href,
  label,
  d,
  viewBox = "0 0 512 512",
}: {
  href: string;
  label?: string;
  d: string;
  viewBox?: string;
}) => {
  return (
    <a
      className="btn btn-ghost btn-circle"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        className="h-5 w-5 fill-current"
        role="img"
        aria-hidden={label ? "false" : "true"}
      >
        <path d={d} />
      </svg>
    </a>
  );
};
