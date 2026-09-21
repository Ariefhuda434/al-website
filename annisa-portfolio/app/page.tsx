import About from "@/components/About";
import Contact from "@/components/Contact";
import Download from "@/components/Download";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Portfolio from "@/components/Portfolio";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Portfolio />
        <Projects />
        <Testimonials />
        <Contact />
        <Download />
      </main>
      <Footer />
    </>
  );
}
