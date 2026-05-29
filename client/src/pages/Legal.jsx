import Section from '../components/ui/Section.jsx';

export default function Legal({ type }) {
  const isPrivacy = type === 'privacy';
  return (
    <Section eyebrow={isPrivacy ? 'Privacy' : 'Terms'} title={isPrivacy ? 'Privacy policy' : 'Terms of service'}>
      <div className="max-w-3xl text-slate-600 dark:text-slate-300">
        <p>PromptVault AI uses secure authentication, payment validation, and encrypted environment configuration. Replace this starter legal copy with jurisdiction-specific terms before production launch.</p>
        <p>Users are responsible for content they upload. Premium purchases unlock licensed access to prompt content according to marketplace rules.</p>
      </div>
    </Section>
  );
}
