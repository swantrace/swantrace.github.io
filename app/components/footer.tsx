import { SectionTitle } from "./section-title";
import { SocialIcons } from "./social-icons";

export const Footer = () => {
  return (
    <footer id="contact" className="text-center md:text-left">
      <SectionTitle>Contact</SectionTitle>
      <div className="grid grid-cols-1 gap-8">
        <SocialIcons />
      </div>
    </footer>
  );
};
