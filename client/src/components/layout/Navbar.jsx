import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Search, Sun, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, toggleTheme } from '../../redux/store.js';
import Button from '../ui/Button.jsx';
import { cn } from '../../utils/cn.js';
import { authService } from '../../services/api.js';

const links = [
  ['Explore', '/explore'],
  ['Pricing', '/pricing'],
  ['About', '/about']
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const onLogout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(logout());
      setOpen(false);
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-ink/75">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300 font-black text-ink shadow-glow">PV</span>
          <span className="text-lg font-black text-slate-950 dark:text-white">PromptVault AI</span>
        </Link>
        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} className={({ isActive }) => cn('text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white', isActive && 'text-cyan-700 dark:text-cyan-300')}>
              {label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin/prompts"
              className={({ isActive }) =>
                cn(
                  'text-sm font-semibold text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white',
                  isActive && 'text-cyan-700 dark:text-cyan-300'
                )
              }
            >
              Manage Prompts
            </NavLink>
          )}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/explore" className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-cyan-300/40 dark:border-white/10 dark:text-slate-200" aria-label="Search prompts">
            <Search size={18} />
          </Link>
          <button onClick={() => dispatch(toggleTheme())} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-cyan-300/40 dark:border-white/10 dark:text-slate-200" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-sm dark:border-white/10 dark:bg-white/5">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-white/15">{initials}</div>
                )}
                <span className="max-w-[140px] truncate font-semibold text-slate-950 dark:text-white">{user.name || user.email}</span>
              </div>
              <Button as={Link} to={user.role === 'admin' ? '/admin' : '/dashboard'} variant="ghost"><UserRound size={17} /> {user.role === 'admin' ? 'Admin' : 'Dashboard'}</Button>
              <button onClick={onLogout} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-cyan-300/40 dark:border-white/10 dark:text-slate-200" aria-label="Logout">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Button as={Link} to="/login">Sign in</Button>
          )}
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map(([label, to]) => <Link onClick={() => setOpen(false)} key={to} to={to} className="rounded-xl px-3 py-2 text-slate-200 light:text-slate-800">{label}</Link>)}
            {user?.role === 'admin' && (
              <Link onClick={() => setOpen(false)} to="/admin/prompts" className="rounded-xl px-3 py-2 text-slate-200 light:text-slate-800">
                Manage Prompts
              </Link>
            )}
            <Button as={Link} to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'}>{user ? (user.role === 'admin' ? 'Admin' : 'Dashboard') : 'Sign in'}</Button>
            {user && <Button type="button" variant="ghost" onClick={onLogout}>Logout</Button>}
          </div>
        </div>
      )}
    </header>
  );
}
