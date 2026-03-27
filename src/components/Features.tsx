import { Shield, Zap, FileText, Calendar, Bell, Users } from "lucide-react";

const features = [
  {
    title: "Instant Reporting",
    description: "Quickly report symptoms and health concerns to school medical staff.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Secure Medical Records",
    description: "Your health history is stored securely and only accessible to authorized staff.",
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Easy Appointments",
    description: "Book and manage appointments with the school clinic effortlessly.",
    icon: Calendar,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Digital Lab Results",
    description: "Receive and view your laboratory test results directly on your dashboard.",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Real-time Notifications",
    description: "Get immediate alerts for appointment confirmations and health updates.",
    icon: Bell,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Admin Management",
    description: "Comprehensive tools for staff to manage patient records and reports.",
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything You Need for <span className="text-primary">Better Health.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our system is designed to provide students and staff with a seamless, secure, and efficient way to manage school health services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={feature.color} size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
