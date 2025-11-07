import HeroSection from "@/app/components/home/HeroSection";
import StartForm from "@/app/components/home/StartForm";
import ScoreBoard from "@/app/components/home/ScoreBoard";
import RulesSection from "@/app/components/home/RulesSection";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full  text-gray-800">
      <HeroSection />
      <StartForm />
      <ScoreBoard />
      <RulesSection />
    </div>
  );
}
