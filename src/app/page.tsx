import Hero from "@/components/Hero";
import BrandIntro from "@/components/BrandIntro";
import Constellation from "@/components/Constellation";
import LenormandTeaser from "@/components/LenormandTeaser";
import GieoQueIntro from "@/components/GieoQueIntro";
import ScrollSnapController from "@/components/ScrollSnapController";

export default function Home() {
  return (
    <>
      <ScrollSnapController />
      <main className="flex-1">
        <Hero />
        <BrandIntro />
        <Constellation />
        <LenormandTeaser />
        <GieoQueIntro />
      </main>
    </>
  );
}
