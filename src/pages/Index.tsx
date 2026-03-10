import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrendingBuilders } from "@/components/landing/TrendingBuilders";
import { ServicesPreview } from "@/components/landing/ServicesPreview";
import { BlueprintSection } from "@/components/landing/BlueprintSection";
import { StartupPreview } from "@/components/landing/StartupPreview";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrendingBuilders />
      <ServicesPreview />
      <BlueprintSection />
      <StartupPreview />
      <Footer />
    </div>
  );
};

export default Index;
