import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  Shield,
  Scan,
  BarChart3,
  Bell,
  Smartphone,
  Lock,
  CheckCircle,
  Users,
  TrendingUp,
  Clock,
  Loader2,
  Building2,
  Store,
  Truck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "features" | "b2b" | "demo" | "contact">("home");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFD700]">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#A7F3D0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-[#8B5CF6] border-b-4 border-black sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
              <Shield className="w-10 h-10 text-white" />
              <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                TRUEMEDIX
              </span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {["home", "features", "b2b", "demo", "contact"].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`${
                    activeTab === tab
                      ? "bg-white text-black"
                      : "bg-[#10B981] text-white"
                  } border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] font-black uppercase`}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* HOME TAB */}
      {activeTab === "home" && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#8B5CF6] border-4 border-black shadow-[12px_12px_0px_#000000] p-8 md:p-12 mb-12 text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              FIGHT FAKE<br />MEDICINES
            </h1>
            <p className="text-xl md:text-2xl font-bold text-white mb-8">
              Blockchain-powered verification platform protecting patients worldwide
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => navigate("/scanner")}
                className="bg-[#10B981] text-white border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] font-black text-xl px-8 py-8"
              >
                <Scan className="w-6 h-6 mr-2" />
                START SCANNING
              </Button>
              {!isAuthenticated && (
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-white text-black border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] font-black text-xl px-8 py-8"
                >
                  GET STARTED
                </Button>
              )}
            </div>
          </motion.div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Shield, title: "PATIENT SAFETY", desc: "Verify authenticity instantly", color: "bg-[#8B5CF6]" },
              { icon: Lock, title: "BLOCKCHAIN SECURE", desc: "Tamper-proof records", color: "bg-[#10B981]" },
              { icon: TrendingUp, title: "SUPPLY CHAIN", desc: "End-to-end visibility", color: "bg-[#F59E0B]" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`${item.color} border-4 border-black shadow-[8px_8px_0px_#000000] p-6 text-center`}>
                  <item.icon className="w-16 h-16 mx-auto mb-4 text-white" />
                  <h3 className="text-2xl font-black text-white mb-2">{item.title}</h3>
                  <p className="font-bold text-white">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { num: "500+", label: "ORGANIZATIONS" },
                { num: "10M+", label: "VERIFICATIONS" },
                { num: "99.9%", label: "ACCURACY" },
                { num: "24/7", label: "SUPPORT" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-4xl md:text-5xl font-black text-[#8B5CF6]">{stat.num}</p>
                  <p className="font-black text-sm mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* FEATURES TAB */}
      {activeTab === "features" && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.h2
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-black mb-8 text-center"
          >
            POWERFUL FEATURES
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Scan,
                title: "QR & BARCODE SCANNING",
                features: ["Multi-format support", "Offline capability", "Real-time results"],
                color: "bg-[#8B5CF6]",
              },
              {
                icon: Lock,
                title: "BLOCKCHAIN DATABASE",
                features: ["Tamper-proof records", "Complete traceability", "Audit trail"],
                color: "bg-[#10B981]",
              },
              {
                icon: Bell,
                title: "REAL-TIME ALERTS",
                features: ["Push notifications", "Email alerts", "SMS updates"],
                color: "bg-[#F59E0B]",
              },
              {
                icon: BarChart3,
                title: "ANALYTICS DASHBOARD",
                features: ["Visual reports", "Predictive analytics", "Export capabilities"],
                color: "bg-[#EC4899]",
              },
              {
                icon: Smartphone,
                title: "MOBILE APPS",
                features: ["iOS & Android", "User-friendly", "Offline mode"],
                color: "bg-[#06B6D4]",
              },
              {
                icon: TrendingUp,
                title: "API INTEGRATION",
                features: ["RESTful API", "Webhooks", "Documentation"],
                color: "bg-[#6366F1]",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`${feature.color} border-4 border-black shadow-[8px_8px_0px_#000000] p-6 h-full`}>
                  <feature.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 font-bold">
                        <CheckCircle className="w-5 h-5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* B2B TAB */}
      {activeTab === "b2b" && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.h2
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-black mb-8 text-center"
          >
            B2B SOLUTIONS
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Building2,
                title: "FOR HOSPITALS",
                features: [
                  "Bulk inventory verification",
                  "Patient safety dashboard",
                  "Automated counterfeit alerts",
                  "Compliance reporting",
                  "HMS integration",
                ],
                color: "bg-[#F59E0B]",
              },
              {
                icon: Store,
                title: "FOR PHARMACIES",
                features: [
                  "Point-of-sale verification",
                  "Stock management",
                  "Expiry tracking",
                  "Customer trust building",
                  "Mobile scanning app",
                ],
                color: "bg-[#6366F1]",
              },
              {
                icon: Truck,
                title: "FOR DISTRIBUTORS",
                features: [
                  "Supply chain tracking",
                  "Batch authentication",
                  "Logistics optimization",
                  "Real-time visibility",
                  "Partner network",
                ],
                color: "bg-[#8B5CF6]",
              },
              {
                icon: Users,
                title: "ENTERPRISE PACKAGE",
                features: [
                  "Product registration portal",
                  "Nationwide monitoring",
                  "Counterfeit pattern detection",
                  "Regulatory compliance",
                  "White-label options",
                  "Dedicated support & SLA",
                ],
                color: "bg-[#EC4899]",
              },
            ].map((solution, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`${solution.color} border-4 border-black shadow-[8px_8px_0px_#000000] p-6 h-full`}>
                  <solution.icon className="w-12 h-12 mb-4 text-white" />
                  <h3 className="text-2xl font-black mb-4 text-white">{solution.title}</h3>
                  <ul className="space-y-2">
                    {solution.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 font-bold text-white">
                        <CheckCircle className="w-5 h-5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* DEMO TAB */}
      {activeTab === "demo" && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#8B5CF6] border-4 border-black shadow-[12px_12px_0px_#000000] p-8 text-center"
          >
            <h2 className="text-5xl font-black text-white mb-6">LIVE DEMO</h2>
            <p className="text-xl font-bold text-white mb-8">
              Try our scanner with sample medicine codes
            </p>
            <Button
              onClick={() => navigate("/scanner")}
              className="bg-[#10B981] text-white border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] font-black text-2xl px-12 py-8"
            >
              <Scan className="w-8 h-8 mr-3" />
              LAUNCH SCANNER
            </Button>
            
            <div className="mt-8 bg-white border-4 border-black p-6 text-left">
              <p className="font-black mb-4">TRY THESE CODES:</p>
              <div className="space-y-2">
                <p className="font-bold">✅ MED001234 - Legal medicine</p>
                <p className="font-bold">⏰ MED005678 - Expired medicine</p>
                <p className="font-bold">❌ MED009999 - Counterfeit detected</p>
                <p className="font-bold">⚠️ MED002468 - Recalled product</p>
                <p className="font-bold">✅ MED003579 - Legal medicine</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* CONTACT TAB */}
      {activeTab === "contact" && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.h2
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-black mb-8 text-center"
          >
            GET IN TOUCH
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Mail, label: "EMAIL", value: "nirmitjee@gmail.com", color: "bg-[#8B5CF6]" },
              { icon: Phone, label: "PHONE", value: "9891168827", color: "bg-[#10B981]" },
              { icon: MapPin, label: "LOCATION", value: "Vibe clash", color: "bg-[#F59E0B]" },
            ].map((contact, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`${contact.color} border-4 border-black shadow-[8px_8px_0px_#000000] p-6 text-center`}>
                  <contact.icon className="w-12 h-12 mx-auto mb-4 text-white" />
                  <p className="font-black text-white mb-2">{contact.label}</p>
                  <p className="font-bold text-white text-lg">{contact.value}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black border-t-4 border-black mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-white font-black text-lg">
            © {new Date().getFullYear()} TRUEMEDIX - Team Yashkriti @ Vibe clash
          </p>
          <p className="text-white/80 font-bold mt-2">
            Team: Nirmit Aggarwal, Anushka, Pragya Malasi, Pawan Singh
          </p>
        </div>
      </footer>
    </div>
  );
}