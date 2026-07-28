import Hero from "@/components/Hero";
import BrandIntro from "@/components/BrandIntro";
import Constellation from "@/components/Constellation";
import LenormandTeaser from "@/components/LenormandTeaser";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
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
        <About />
        <Gallery />
      </main>
    </>
  );
}
