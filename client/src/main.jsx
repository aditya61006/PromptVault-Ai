import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './redux/store.js';
import AppLayout from './layouts/AppLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import './styles/index.css';

const Home = lazy(() => import('./pages/Home.jsx'));
const Explore = lazy(() => import('./pages/Explore.jsx'));
const PromptDetails = lazy(() => import('./pages/PromptDetails.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const AdminPrompts = lazy(() => import('./pages/AdminPrompts.jsx'));
const AdminPanel = lazy(() => import('./pages/AdminPanel.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Legal = lazy(() => import('./pages/Legal.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false
    }
  }
});

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/explore', element: <Explore /> },
      { path: '/prompts/:id', element: <PromptDetails /> },
      { path: '/pricing', element: <Pricing /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/privacy', element: <Legal type="privacy" /> },
      { path: '/terms', element: <Legal type="terms" /> },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/prompts',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminPrompts />
          </ProtectedRoute>
        )
      },
      { path: '*', element: <NotFound /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Suspense fallback={<div className="grid min-h-screen place-items-center bg-ink text-white">Loading PromptVault...</div>}>
            <RouterProvider router={router} />
          </Suspense>
        </ErrorBoundary>
        <Toaster position="top-right" toastOptions={{ className: 'toast' }} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
