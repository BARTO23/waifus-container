// This app's own real deployed URL — same one the extracted design
// reference already linked to (see TopNav.jsx).
const DEPLOY_URL = 'https://waifus-container.vercel.app/';

/**
 * Closing CTA band (bright accent, not the maroon background used
 * everywhere else on the page) — a big statement heading plus a small
 * credit row.
 */
export const FooterCta = () => (
  <footer className="bg-accent px-6 py-10 sm:py-14 md:py-[72px]">
    <div className="max-w-[1180px] mx-auto">
      <h2 className="font-heading font-black uppercase text-white text-[clamp(28px,5vw,64px)] leading-[.95] max-w-[22ch]">
        Manga, manhwa and manhua — one catalog
      </h2>
      <div className="flex justify-between gap-6 flex-wrap mt-8 sm:mt-12 md:mt-16 pt-4 border-t-2 border-white/60 text-white text-xs uppercase tracking-[.14em]">
        <span>Redhead Waifus</span>
        <a href={DEPLOY_URL} target="_blank" rel="noreferrer" className="underline hover-hover:hover:no-underline">
          waifus-container.vercel.app
        </a>
        <span>SFW · Curated</span>
      </div>
    </div>
  </footer>
);
