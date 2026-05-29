import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Bot, CheckCircle2, Play, Sparkles, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Section from '../components/ui/Section.jsx';
import PromptCard from '../components/prompts/PromptCard.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { promptService } from '../services/api.js';

const stats = [
  { label: 'Curated prompts', value: '42K+' },
  { label: 'Creator payouts', value: '$1.8M' },
  { label: 'AI platforms', value: '18' },
  { label: 'Avg rating', value: '4.8' }
];

function HeroTiltCard({ children, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [8, -8]);
  const rotateY = useTransform(x, [-80, 80], [-8, 8]);
  const smoothX = useSpring(rotateX, { stiffness: 160, damping: 18 });
  const smoothY = useSpring(rotateY, { stiffness: 160, damping: 18 });

  return (
    <motion.div
      style={{ rotateX: smoothX, rotateY: smoothY }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['home-prompts'],
    queryFn: () => promptService.list({ sort: 'popular', limit: 4 })
  });
  const prompts = data?.items || [];

  return (
    <>
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 noise opacity-30" />
        <motion.div className="absolute left-1/2 top-8 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" animate={{ x: [-120, 120, -80], y: [0, 90, 0] }} transition={{ duration: 12, repeat: Infinity }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_.98fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200">
              <Sparkles size={16} /> Premium prompt marketplace for every AI workflow
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-5xl text-5xl font-black leading-tight tracking-tight text-slate-950 dark:text-white sm:text-7xl">
              Discover, buy, save, and launch prompts that feel like unfair leverage.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              PromptVault AI gives creators a polished storefront and gives users battle-tested prompts for ChatGPT, Claude, Gemini, Midjourney, Stable Diffusion, Sora, Suno, and more.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/explore">Explore prompts <ArrowRight size={18} /></Button>
              <Button as={Link} to="/admin/prompts" variant="ghost"><Play size={18} /> Admin publishing</Button>
            </motion.div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-4">
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <HeroTiltCard className="relative mx-auto w-full max-w-xl">
            <div className="gradient-border glass rounded-[2rem] p-4 shadow-violet">
              <div className="rounded-[1.4rem] bg-slate-950/80 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200"><Bot size={18} /> Live prompt preview</div>
                  <span className="rounded-full bg-mint/20 px-3 py-1 text-xs font-bold text-mint">Optimizing</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
                  Create a cinematic launch story for a wearable AI device. Tone: premium, precise, hopeful. Output: hero copy, product shots, social hooks.
                </div>
                <motion.div className="mt-4 overflow-hidden rounded-2xl" initial={{ opacity: 0.65 }} animate={{ opacity: [0.65, 1, 0.88] }} transition={{ duration: 3, repeat: Infinity }}>
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80" alt="AI generated workspace" className="h-72 w-full object-cover" />
                </motion.div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {['Prompt text', 'Sample output', 'Usage steps'].map((item) => <span key={item} className="rounded-xl bg-white/5 px-3 py-3 text-center text-xs text-slate-300">{item}</span>)}
                </div>
              </div>
            </div>
          </HeroTiltCard>
        </div>
      </section>

      <Section eyebrow="Live AI showcase" title="Before, after, and everything users need to trust a prompt.">
        <div className="grid gap-5 lg:grid-cols-3">
          {['Prompt enhancer', 'Image generation', 'Video storyboard'].map((title, index) => (
            <motion.div key={title} whileHover={{ y: -6 }} className="glass rounded-3xl p-6">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300 text-ink"><Wand2 /></div>
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Interactive cards show prompt input, generated output, compatibility, and creator guidance with smooth Framer Motion transitions.</p>
              <motion.div className="mt-6 h-2 rounded-full bg-cyan-300" initial={{ width: '20%' }} whileInView={{ width: `${55 + index * 18}%` }} viewport={{ once: true }} />
            </motion.div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Trending now" title="Curated prompts with premium marketplace signals.">
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-96" />)}
          </div>
        )}
        {isError && <div className="glass rounded-3xl p-6 text-slate-300">Trending prompts could not be loaded from the API.</div>}
        {!isLoading && !isError && prompts.length === 0 && <div className="glass rounded-3xl p-6 text-slate-300">No approved prompts are live yet. Seed or approve prompts to show them here.</div>}
        {!isLoading && !isError && prompts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {prompts.map((prompt) => <PromptCard key={prompt._id} prompt={prompt} />)}
          </div>
        )}
      </Section>

      <Section eyebrow="Built for trust" title="Creators sell. Users unlock. Admins keep quality high.">
        <div className="grid gap-4 md:grid-cols-3">
          {['Secure Razorpay unlocks', 'Creator analytics and payouts', 'Admin moderation and reports'].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 p-5">
              <CheckCircle2 className="mt-1 text-mint" size={20} />
              <p className="font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
