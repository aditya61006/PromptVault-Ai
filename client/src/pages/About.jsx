import Section from '../components/ui/Section.jsx';

export default function About() {
  return (
    <Section eyebrow="About" title="PromptVault AI is built for the next wave of AI creators.">
      <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
        The platform combines marketplace trust, creator economics, premium UX, and secure prompt delivery. It is designed as a scalable MERN application with clean REST APIs, role-based access, payment validation, and a modern animated frontend.
      </p>
    </Section>
  );
}
