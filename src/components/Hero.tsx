import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, HeartPulse, ClipboardCheck } from "lucide-react";

const images = [
  "/images/hero-1.jpg",
  "/images/hero-2.png",
  "/images/hero-3.png",
];

export const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50">
      {/* Background Images with Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-2000 ease-in-out ${
              index === currentImageIndex ? "opacity-60 saturate-[0.8]" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        {/* Fallback/Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-background z-[1]" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
          <ShieldCheck size={16} />
          <span>Trusted by thousands of students</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
          Your Health, <span className="text-primary italic">Simplified.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up [animation-delay:200ms]">
          Efficient Student Health Reporting and Information Management. Report illnesses, book appointments, and access your medical history securely from anywhere.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up [animation-delay:400ms]">
          <Button asChild size="lg" className="rounded-full px-8 text-lg h-14 group shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Link to="/register/student" className="flex items-center gap-2">
              Create Student Account <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-lg h-14 bg-background/50 backdrop-blur-sm border-2 transition-all hover:bg-background hover:scale-105 active:scale-95 shadow-sm">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-3xl mx-auto animate-fade-in [animation-delay:600ms]">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-2xl bg-white shadow-soft-xl mb-2">
              <ClipboardCheck className="text-primary" size={24} />
            </div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Easy Reporting</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-2xl bg-white shadow-soft-xl mb-2">
              <HeartPulse className="text-blue-500" size={24} />
            </div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">24/7 Access</span>
          </div>
          <div className="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
            <div className="p-3 rounded-2xl bg-white shadow-soft-xl mb-2">
              <ShieldCheck className="text-emerald-500" size={24} />
            </div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Secure Privacy</span>
          </div>
        </div>
      </div>
    </section>
  );
};
