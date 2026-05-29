import { Check } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Section from '../components/ui/Section.jsx';

export default function Pricing() {
  return (
    <Section eyebrow="Pricing" title="Free discovery, premium unlocks, and subscriptions for power users.">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ['Explorer', '$0', ['Free prompts', 'Bookmarks', 'Community reviews']],
          ['Pro Vault', '$19/mo', ['Premium discounts', 'AI prompt enhancer', 'Personalized feed']],
          ['Creator Studio', '10% fee', ['Storefront', 'Analytics', 'Withdrawals']]
        ].map(([name, price, items]) => (
          <div key={name} className="gradient-border glass rounded-3xl p-6">
            <h2 className="text-2xl font-black">{name}</h2>
            <p className="mt-4 text-4xl font-black text-cyan-200">{price}</p>
            <div className="mt-6 grid gap-3">
              {items.map((item) => <p key={item} className="flex items-center gap-3 text-sm text-slate-300"><Check size={17} className="text-mint" /> {item}</p>)}
            </div>
            <Button className="mt-8 w-full">Choose plan</Button>
          </div>
        ))}
      </div>
    </Section>
  );
}
