import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
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
      await signup(form);
      navigate('/');
    } catch (err) {
      const responseData = err.response?.data;
      const validationMessage = responseData?.errors?.map((item) => item.msg).join(', ');
      setError(validationMessage || responseData?.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md card">
        <h1 className="text-3xl font-semibold mb-2">Sign Up</h1>
        <p className="text-slate-400 mb-6">Create your account and join your team's project workflow.</p>
        
        {error && <div className="mb-4 rounded-2xl bg-rose-500/10 border border-rose-500 text-rose-100 p-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-slate-200">Full name</span>
            <input name="name" value={form.name} onChange={handleChange} className="input-field mt-2" />
          </label>
          <label className="block">
            <span className="text-slate-200">Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field mt-2" />
          </label>
          <label className="block">
            <span className="text-slate-200">Password</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field mt-2" />
          </label>
          <label className="block">
            <span className="text-slate-200">Role</span>
            <select name="role" value={form.role} onChange={handleChange} className="input-field mt-2">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-slate-500 text-xs mt-2">Member accounts can sign up freely. Admin signup requires the configured admin credentials.</p>
          </label>
          <button disabled={loading} type="submit" className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-sky-400 hover:text-sky-300">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
