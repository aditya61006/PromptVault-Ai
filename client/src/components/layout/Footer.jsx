import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 px-4 py-10 text-sm text-slate-600 dark:border-white/10 dark:text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="mb-3 text-lg font-black text-slate-950 dark:text-white">PromptVault AI</p>
          <p className="max-w-md">A scalable MERN marketplace for prompt creators, teams, and AI-native builders.</p>
        </div>
        <div className="grid gap-2">
          <Link to="/explore">Explore</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/creator">Creator panel</Link>
        </div>
        <div className="grid gap-2">
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
