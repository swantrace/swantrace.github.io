export const Footer = () => {
  return (
    <footer
      id="contact"
      className="footer footer-center grid-flow-row border-base-300/60 mt-16 gap-4 border-t px-2 py-10 text-sm"
    >
      <div className="gap-1 text-base-content/65">
        <p>© {new Date().getFullYear()} Fred Hong</p>
      </div>
    </footer>
  );
};
