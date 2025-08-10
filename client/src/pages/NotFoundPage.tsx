const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/10 blur-3xl opacity-50 pointer-events-none" />

      <h1 className="text-6xl font-extrabold text-foreground text-center z-10">
        404
      </h1>
      <p className="text-xl text-muted-foreground text-center mt-4 z-10">
        Page Not Found
      </p>
      <p className="text-md text-muted-foreground text-center mt-2 z-10 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="mt-8 z-10">
        <a
          href="/"
          className="inline-block px-6 py-2 rounded-full border border-muted-foreground text-foreground hover:bg-muted/20 transition-all duration-200"
        >
          Go back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
