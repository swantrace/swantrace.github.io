import { SectionTitle } from "./section-title";
import { SocialIcons } from "./social-icons";

export const Footer = () => {
  return (
    <footer
      id="contact"
      className="footer footer-center bg-base-200 text-base-content rounded p-10"
    >
      <nav>
        <SectionTitle>Contact</SectionTitle>
        <SocialIcons />
      </nav>
    </footer>
  );
};
