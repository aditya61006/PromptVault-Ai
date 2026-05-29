import Button from '../components/ui/Button.jsx';
import Section from '../components/ui/Section.jsx';

export default function Contact() {
  return (
    <Section eyebrow="Contact" title="Partner with PromptVault AI.">
      <form className="glass grid max-w-2xl gap-3 rounded-3xl p-6">
        <input placeholder="Name" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
        <input placeholder="Email" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
        <textarea rows="5" placeholder="Message" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
        <Button>Send message</Button>
      </form>
    </Section>
  );
}
