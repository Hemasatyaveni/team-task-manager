import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md card">
        <h1 className="text-3xl font-semibold mb-2">Login</h1>
        <p className="text-slate-400 mb-6">Sign in to manage your team tasks and projects.</p>
        {error && <div className="mb-4 rounded-2xl bg-rose-500/10 border border-rose-500 text-rose-100 p-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-slate-200">Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field mt-2" />
          </label>
          <label className="block">
            <span className="text-slate-200">Password</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field mt-2" />
          </label>
          <button disabled={loading} type="submit" className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          Don't have an account? <Link to="/signup" className="text-sky-400 hover:text-sky-300">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
