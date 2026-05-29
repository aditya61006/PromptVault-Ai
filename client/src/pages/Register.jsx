import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import { setCredentials } from '../redux/store.js';
import { authService } from '../services/api.js';

export default function Register() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: { role: 'user' } });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await authService.register(data);
      dispatch(setCredentials(response));
      toast.success('Account created and stored in MongoDB');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <section className="grid min-h-[75vh] place-items-center px-4 py-16">
      <form onSubmit={handleSubmit(onSubmit)} className="gradient-border glass w-full max-w-lg rounded-3xl p-8">
        <h1 className="text-3xl font-black">Create your vault</h1>
        <div className="mt-8 grid gap-3">
          <input {...register('name', { required: true })} placeholder="Full name" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
          <input {...register('email', { required: true })} type="email" placeholder="Email" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
          <input {...register('password', { required: true })} type="password" placeholder="Password" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
        </div>
        <Button className="mt-5 w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Register'}</Button>
      </form>
    </section>
  );
}
