import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="bg-card p-10 rounded-3xl shadow-xl flex flex-col items-center text-center max-w-lg mx-auto space-y-6">
        <h1 className="text-8xl font-extrabold text-primary animate-fade-in-up">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-foreground tracking-tight">
          Page Not Found
        </h2>
        <p className="text-md text-muted-foreground leading-normal max-w-xs">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 px-4 border border-primary text-sm font-medium rounded-full text-primary bg-transparent hover:bg-primary hover:text-primary-foreground focus:outline-none transition-colors duration-200"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

// Add a simple keyframe animation for fade-in-up
// This would typically go in your global CSS or a dedicated CSS module
// For demonstration, adding it here. You might want to move it.
// @keyframes fade-in-up {
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// .animate-fade-in-up {
//   animation: fade-in-up 0.8s ease-out forwards;
// }
