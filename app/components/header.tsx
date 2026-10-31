import { url } from "../utils/url";
import { NavLink } from "./nav-link";
import { SocialIcons } from "./social-icons";

export const Header = ({ path }: { path: string }) => (
  <header className="site-header">
    <a href={url("/")} className="profile-link" aria-label="Fred Hong — Home">
      <span className="profile-initials" aria-hidden="true">
        FH<span>.</span>
      </span>
      <span>
        <span className="block text-lg font-bold tracking-tight">
          Fred Hong
        </span>
        <span className="text-base-content/60 hidden text-sm lg:block">
          Full-stack engineer
        </span>
      </span>
    </a>
    <theme-switcher class="site-theme"></theme-switcher>
    <nav aria-label="Main navigation" className="site-nav">
      <ul className="menu menu-horizontal w-full gap-1 p-0 lg:menu-vertical">
        <NavLink href="/" path={path}>
          Home
        </NavLink>
        <NavLink href="/projects" path={path}>
          Projects
        </NavLink>
        <NavLink href="/blog" path={path}>
          Blog
        </NavLink>
        <NavLink href="/#contact" path={path}>
          Contact
        </NavLink>
      </ul>
    </nav>
    <div className="mt-auto hidden lg:block">
      <p className="text-base-content/60 mb-3 text-sm">Edmonton, Canada</p>
      <SocialIcons />
    </div>
  </header>
);
