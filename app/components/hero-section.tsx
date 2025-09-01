import { SocialIcons } from "./social-icons";

export const HeroSection = () => {
  return (
    <section className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 md:items-center md:text-left">
      <div>
        <h3 className="m-0 text-base uppercase tracking-[0.25em] text-windsurfing dark:text-blue-dark">
          Frontend Developer
        </h3>
        <h2 className="m-0 text-[calc(var(--base-font-size)*2.9)] md:ml-[-3px]">
          Fred Hong
        </h2>
        <p className="leading-[1.5]">
          Briefly describe your role, expertise, and location. Need help writing
          your bio?
          <a
            className="text-windsurfing hover:text-marina"
            href="#"
            target="_blank"
          >
            Check Jen's worksheet
          </a>
          .
        </p>

        <SocialIcons />
      </div>

      <img
        src="https://assets.codepen.io/296057/fem-brissa.jpg"
        alt="Brissa Isidro."
        className="mx-auto h-[175px] w-[300px] overflow-hidden rounded-[24px_0] object-cover object-top md:ml-auto md:h-auto md:w-auto md:object-none"
      />
    </section>
  );
};
