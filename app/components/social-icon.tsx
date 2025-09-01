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
      className="text-windsurfing hover:text-marina dark:text-blue-dark transition-colors"
      href={href}
      target="_blank"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      <span className="h-9 w-9 inline-flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={viewBox}
          className="w-full h-full"
          role="img"
          aria-hidden={label ? "false" : "true"}
        >
          <path d={d} className="social fill-windsurfing hover:fill-marina" />
        </svg>
      </span>
    </a>
  );
};
