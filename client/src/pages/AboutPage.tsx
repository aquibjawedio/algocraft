import { Users, Target, Code2, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "Community",
    description: "Learn, share, and grow with peers on the same journey.",
  },
  {
    icon: Target,
    title: "Focused Learning",
    description: "Structured sheets and goals designed to keep you on track.",
  },
  {
    icon: Code2,
    title: "Practice",
    description:
      "Solve coding problems and join contests like real interviews.",
  },
  {
    icon: Award,
    title: "Achievements",
    description: "Track your progress and celebrate milestones along the way.",
  },
];

const AboutPage = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-background text-foreground">
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">About AlgoCraft</h1>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          AlgoCraft is built for aspiring developers and problem solvers to
          master Data Structures and Algorithms through curated sheets,
          contests, progress tracking, and a vibrant community.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl">
        {features.map((feature) => (
          <Card key={feature.title} className="shadow-md bg-muted/20">
            <CardContent className="flex flex-col items-center text-center p-8">
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AboutPage;
