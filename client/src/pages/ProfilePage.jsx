import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="card max-w-2xl">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="text-slate-400 mt-2">View your account details and role information.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800">
          <p className="text-slate-500 uppercase text-xs tracking-[0.2em] mb-3">Name</p>
          <p className="text-lg">{user?.name}</p>
        </div>
        <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800">
          <p className="text-slate-500 uppercase text-xs tracking-[0.2em] mb-3">Email</p>
          <p className="text-lg">{user?.email}</p>
        </div>
        <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 col-span-full">
          <p className="text-slate-500 uppercase text-xs tracking-[0.2em] mb-3">Role</p>
          <p className="text-lg capitalize">{user?.role}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
