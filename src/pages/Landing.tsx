import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="bg-primary rounded-[40px] px-8 py-16 text-center text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
               {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Ready to Get Started?</h2>
              <p className="text-primary-foreground/90 text-xl max-w-2xl mx-auto mb-10 relative z-10">
                Join our health network today and take control of your medical information with ease and security.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <Button asChild size="lg" variant="secondary" className="rounded-full px-10 text-lg h-14 bg-white text-primary border-none transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl">
                  <Link to="/register/student" className="flex items-center gap-2">
                    Create Account <ArrowRight size={20} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-10 text-lg h-14 bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white transition-all hover:scale-105 active:scale-95">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-12 border-t bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">Student Health System</span>
          </div>
          
          <div className="text-muted-foreground text-sm">
            © 2026 ONLINE STUDENT HEALTH REPORTING INFORMATION SYSTEM. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
