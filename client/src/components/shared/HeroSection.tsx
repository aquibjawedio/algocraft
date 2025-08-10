import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <header className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-32">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
        One Platform to <span className="text-primary">Master DSA</span>
      </h1>
      <p className="text-md md:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
        Curated coding sheets. LeetCode-style contests. Track your progress
        across Love Babbar, Striver, Fraz, Kunal and more — all in one place.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link to="/auth/login">
          <div className="px-6 py-2 text-sm font-medium text-background bg-primary rounded-full hover:brightness-110 transition">
            Open App
          </div>
        </Link>
        <Link to="/auth/register">
          <div className="px-6 py-2 text-sm font-medium border border-primary text-primary rounded-full hover:bg-primary/10 transition">
            Discover More
          </div>
        </Link>
      </div>
    </header>
  );
};

export default HeroSection;
