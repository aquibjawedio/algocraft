import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/shared/HeroSection";
import Navbar from "@/components/shared/Navbar";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
