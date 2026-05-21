import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4">
      <div className="card text-center max-w-xl">
        <h1 className="text-4xl font-semibold mb-4">404</h1>
        <p className="text-slate-400 mb-6">Page not found. Return to the dashboard or check the URL.</p>
        <Link to="/" className="btn-primary inline-flex items-center justify-center px-6 py-3">
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
