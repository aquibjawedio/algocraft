import { Link } from "react-router-dom";
import { BookOpen, Trophy, LineChart, Users } from "lucide-react";

const features = [
  {
    title: "Curated DSA Sheets",
    description:
      "Access Love Babbar, Striver, Fraz, Kunal and more — all structured in one place.",
    icon: BookOpen,
  },
  {
    title: "LeetCode-Style Contests",
    description:
      "Compete with others in timed challenges and sharpen your problem-solving skills.",
    icon: Trophy,
  },
  {
    title: "Track Your Progress",
    description:
      "Visualize your journey with detailed stats and progress tracking.",
    icon: LineChart,
  },
  {
    title: "Community & Blogs",
    description:
      "Learn from others, share your thoughts, and stay connected with the community.",
    icon: Users,
  },
];

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-snug mb-4 md:mb-6">
        One Platform to <span className="text-primary">Master DSA</span>
      </h1>

      <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl md:max-w-2xl mb-8 md:mb-10 leading-relaxed">
        Curated coding sheets. LeetCode-style contests. Track your progress
        across Love Babbar, Striver, Fraz, Kunal and more — all in one place.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
        <Link
          to="/auth/login"
          className="px-6 py-2 text-sm md:text-base font-medium text-background bg-primary rounded-full hover:brightness-110 transition text-center"
        >
          Open Dashboard
        </Link>
        <Link
          to="/auth/register"
          className="px-6 py-2 text-sm md:text-base font-medium border border-primary text-primary rounded-full hover:bg-primary/10 transition text-center"
        >
          Discover More
        </Link>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl px-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card/40 hover:bg-card/60 transition shadow-sm"
          >
            <feature.icon className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
