import { url } from "../utils/url";
import { SocialIcons } from "./social-icons";

export const Footer = () => {
  return (
    <footer
      id="contact"
      className="footer footer-center grid-flow-row border-base-300/60 mt-16 gap-4 border-t px-2 py-10 text-sm"
    >
      <nav aria-label="Contact links">
        <SocialIcons />
      </nav>
      <div className="gap-1 text-base-content/65">
        <p>© {new Date().getFullYear()} Fred Hong</p>
        <p>Full-stack engineer · Edmonton, Canada</p>
      </div>
      <nav
        aria-label="Footer navigation"
        className="flex flex-wrap justify-center gap-x-5 gap-y-2"
      >
        <a className="link link-hover" href={url("/projects")}>
          Projects
        </a>
        <a className="link link-hover" href={url("/blog")}>
          Blog
        </a>
        <a className="link link-hover" href="mailto:frederickhong.5@gmail.com">
          Get in touch ↗
        </a>
      </nav>
    </footer>
  );
};
