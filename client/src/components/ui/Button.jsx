import { cn } from '../../utils/cn.js';

export default function Button({ as: Component = 'button', variant = 'primary', className, ...props }) {
  const styles = {
    primary: 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-ink dark:hover:bg-cyan-100 dark:shadow-glow',
    ghost: 'glass text-slate-950 hover:border-cyan-300/40 dark:text-white',
    neon: 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-glow',
    subtle: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white/10 dark:text-white dark:hover:bg-white/15'
  };

  return (
    <Component
      className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:opacity-50', styles[variant], className)}
      {...props}
    />
  );
}
