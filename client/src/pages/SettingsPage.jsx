function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-slate-400 mt-2">Control app preferences and personal settings.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="text-xl font-semibold">Theme</h2>
          <p className="text-slate-400 mt-3">Dark mode is enabled by default across the dashboard.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="text-slate-400 mt-3">In production, enable toast messaging for realtime task updates.</p>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
