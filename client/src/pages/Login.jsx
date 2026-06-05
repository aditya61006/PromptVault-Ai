import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import { setCredentials } from '../redux/store.js';
import { API_BASE_URL, authService } from '../services/api.js';

export default function Login() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data) => {
    try {
      const response = await authService.login(data);
      dispatch(setCredentials(response));
      toast.success('Signed in successfully');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check your email and password.');
    }
  };

  return (
    <section className="grid min-h-[75vh] place-items-center px-4 py-16">
      <form onSubmit={handleSubmit(onSubmit)} className="gradient-border glass w-full max-w-md rounded-3xl p-8">
        <h1 className="text-3xl font-black">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in with the account stored in your MongoDB database.</p>
        <input {...register('email', { required: true })} type="email" placeholder="Email" className="mt-8 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
        <input {...register('password', { required: true })} type="password" placeholder="Password" className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
        <Button className="mt-5 w-full" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Login'}</Button>
        <Button as="a" href={`${API_BASE_URL}/auth/google`} type="button" variant="ghost" className="mt-3 w-full">Continue with Google</Button>
        <p className="mt-5 text-center text-sm text-slate-400">New here? <Link className="text-cyan-300" to="/register">Create account</Link></p>
      </form>
    </section>
  );
}
