import HeroGlobe from "@/components/home/hero-globe";
import LoginButton from "@/components/home/login-button";

export default function Homepage() {
  return (
    <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-screen p-4  ">
      <LoginButton />
      <HeroGlobe />
    </div>
  );
}
