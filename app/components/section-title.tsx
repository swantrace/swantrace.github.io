import type { Child } from "hono/jsx";

export const SectionTitle = ({ children }: { children: Child }) => (
  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{children}</h2>
);

export default SectionTitle;
