import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-mesh-dark dark:text-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
