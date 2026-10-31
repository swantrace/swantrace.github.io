import type { Child } from "hono/jsx";
import { url } from "../utils/url";

export const NavLink = ({
  href,
  path,
  children,
}: {
  href: string;
  path: string;
  children: Child;
}) => {
  const target = url(href);
  const active =
    !href.includes("#") &&
    (path === target || (href !== "/" && path.startsWith(`${target}/`)));
  return (
    <li>
      <a
        href={target}
        className={
          active
            ? "menu-active bg-base-300/60 text-base-content shadow-none"
            : ""
        }
        aria-current={active ? "page" : undefined}
      >
        {children}
      </a>
    </li>
  );
};
