import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <p className="text-7xl font-black text-cyan-200">404</p>
        <h1 className="mt-4 text-3xl font-black">Prompt not found</h1>
        <Button as={Link} to="/explore" className="mt-6">Back to Explore</Button>
      </div>
    </section>
  );
}
