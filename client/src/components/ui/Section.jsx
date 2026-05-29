import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.js';

export default function Section({ eyebrow, title, children, className }) {
  return (
    <section className={cn('px-4 py-16 sm:px-6 lg:px-8', className)}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-7xl"
      >
        {(eyebrow || title) && (
          <div className="mb-9 max-w-3xl">
            {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>}
            {title && <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">{title}</h2>}
          </div>
        )}
        {children}
      </motion.div>
    </section>
  );
}
