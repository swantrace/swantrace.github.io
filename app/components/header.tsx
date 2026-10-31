import { url } from "../utils/url";
import { NavLink } from "./nav-link";
import { SocialIcons } from "./social-icons";

export const Header = ({ path }: { path: string }) => (
  <header className="site-header">
    <a href={url("/")} className="profile-link" aria-label="Fred Hong — Home">
      <div className="avatar shrink-0">
        <div className="size-10 rounded-full lg:size-36">
          <img
            src={url("/images/avatar.webp")}
            alt="Fred Hong"
            width={512}
            height={512}
            decoding="async"
          />
        </div>
      </div>
      <span>
        <span className="block text-lg font-bold tracking-tight">
          Fred Hong
        </span>
        <span className="text-base-content/60 hidden text-sm lg:block">
          Senior full-stack engineer
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
        <NavLink href="/cv" path={path}>
          CV
        </NavLink>
      </ul>
    </nav>
    <div className="mt-auto hidden lg:flex lg:justify-center">
      <SocialIcons />
    </div>
  </header>
);
