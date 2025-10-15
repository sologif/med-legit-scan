import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { internal } from "@/convex/_generated/api";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Clock,
  Loader2,
  Scan,
  XCircle,
  BarChart3,
  History,
  X,
  Hash,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";
import type { Doc } from "@/convex/_generated/dataModel";
import CryptoJS from "crypto-js";
import { MedicineStats } from "@/components/MedicineStats";

export default function Scanner() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hashedCode, setHashedCode] = useState<string>("");
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  const createScan = useMutation(api.scans.create);
  const seedDatabase = useMutation(api.seedData.seed);
  const stats = useQuery(api.medicines.getStats);
  const recentScans = useQuery(api.scans.recent, { limit: 10 });

  const getMedicine = useQuery(
    api.medicines.getByCode,
    code.length >= 6 ? { code } : "skip"
  );

  // Generate SHA-256 hash whenever code changes
  useEffect(() => {
    if (code.trim()) {
      const hash = CryptoJS.SHA256(code).toString(CryptoJS.enc.Hex);
      setHashedCode(hash);
    } else {
      setHashedCode("");
    }
  }, [code]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please sign in to use the scanner");
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleSeedDatabase = async () => {
    try {
      const result = await seedDatabase({});
      toast.success(result.message || "Database seeded successfully!");
    } catch (error) {
      toast.error("Failed to seed database: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setShowCamera(true);
      
      // Wait for the DOM element to be available
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!scannerRef.current) {
        throw new Error("Scanner element not found");
      }

      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Successfully scanned
          setCode(decodedText.toUpperCase());
          stopCamera();
          toast.success("QR Code scanned successfully!");
          // Auto-verify after scanning
          setTimeout(() => handleScan(decodedText.toUpperCase()), 500);
        },
        () => {
          // Scan error (ignore, happens frequently)
        }
      );
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Unable to access camera. Please check permissions.");
      setShowCamera(false);
      toast.error("Camera access denied or unavailable");
    }
  };

  const stopCamera = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      }
    } catch (err) {
      console.error("Error stopping camera:", err);
    }
    setShowCamera(false);
  };

  const handleScan = async (codeToScan?: string) => {
    const scanCode = codeToScan || code;
    
    if (!scanCode.trim()) {
      toast.error("Please enter a medicine code");
      return;
    }

    setScanning(true);
    
    // Simulate scanning delay
    setTimeout(async () => {
      const medicine = getMedicine;
      
      if (medicine) {
        setResult(medicine);
        await createScan({
          medicineCode: scanCode,
          status: medicine.status,
          medicineName: medicine.name,
        });
        
        if (medicine.status === "legal") {
          toast.success("Medicine verified as LEGAL");
        } else if (medicine.status === "expired") {
          toast.error("Medicine is EXPIRED");
        } else if (medicine.status === "counterfeit") {
          toast.error("COUNTERFEIT DETECTED!");
        } else if (medicine.status === "recalled") {
          toast.error("Medicine has been RECALLED");
        }
      } else {
        setResult({ notFound: true });
        await createScan({
          medicineCode: scanCode,
          status: "not_found",
        });
        toast.error("Medicine not found in database");
      }
      
      setScanning(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "legal":
        return "bg-[#00FF80] text-black";
      case "expired":
        return "bg-[#FFD700] text-black";
      case "counterfeit":
        return "bg-[#FF0080] text-white";
      case "recalled":
        return "bg-[#FF6B00] text-white";
      default:
        return "bg-gray-400 text-black";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "legal":
        return <CheckCircle className="w-12 h-12" />;
      case "expired":
        return <Clock className="w-12 h-12" />;
      case "counterfeit":
        return <XCircle className="w-12 h-12" />;
      case "recalled":
        return <AlertTriangle className="w-12 h-12" />;
      default:
        return <XCircle className="w-12 h-12" />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFD700]">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  // Don't render scanner if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#00FFD1] p-4 md:p-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="bg-[#6B4EFF] border-4 border-black p-6 shadow-[8px_8px_0px_#000000]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Scan className="w-12 h-12 text-white" />
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">
                  MEDICINE SCANNER
                </h1>
                <p className="text-white/90 font-bold">Verify authenticity instantly</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/")}
              className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] font-black text-lg px-6 py-6"
            >
              ← BACK
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Empty DB notice for deployed environments */}
      {stats && stats.totalMedicines === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mb-6"
        >
          <div className="bg-[#FFE500] border-4 border-black p-4 shadow-[8px_8px_0px_#000000] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <p className="font-black">No sample data found for this environment.</p>
            </div>
            <Button
              onClick={handleSeedDatabase}
              variant="outline"
              className="border-4 border-black shadow-[4px_4px_0px_#000000] font-black bg-white"
            >
              Initialize Sample Data
            </Button>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Scanner */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="bg-[#FF3366] border-4 border-black shadow-[8px_8px_0px_#000000] p-6">
            <div className="space-y-6">
              {/* Scanner Input */}
              <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_#000000]">
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  SCAN MEDICINE
                </h2>
                
                <div className="space-y-4">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter medicine code (e.g., MED001234)"
                    className="border-4 border-black text-xl font-bold p-6 shadow-[4px_4px_0px_#000000]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !scanning) {
                        handleScan();
                      }
                    }}
                  />

                  {/* SHA-256 Hash Display */}
                  {hashedCode && (
                    <div className="bg-[#FFE500] border-4 border-black p-4 shadow-[4px_4px_0px_#000000]">
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-5 h-5" />
                        <p className="font-black text-sm">SHA-256 HASH:</p>
                      </div>
                      <p className="font-mono text-xs break-all bg-white border-2 border-black p-2">
                        {hashedCode}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3 flex-wrap">
                    <Button
                      onClick={() => handleScan()}
                      disabled={scanning || !code.trim()}
                      className="bg-[#FFE500] text-black border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] font-black text-lg px-8 py-6 flex-1"
                    >
                      {scanning ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          SCANNING...
                        </>
                      ) : (
                        <>
                          <Scan className="w-5 h-5 mr-2" />
                          VERIFY NOW
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={showCamera ? stopCamera : startCamera}
                      className="bg-[#6B4EFF] text-white border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] font-black text-lg px-8 py-6"
                    >
                      {showCamera ? (
                        <>
                          <X className="w-5 h-5 mr-2" />
                          CLOSE CAMERA
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5 mr-2" />
                          SCAN QR
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Camera Scanner */}
                  {showCamera && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-black border-4 border-black p-4 shadow-[4px_4px_0px_#000000]"
                    >
                      <div ref={scannerRef} id="qr-reader" className="w-full"></div>
                      <p className="text-white font-bold text-center mt-4">
                        Position QR code within the frame
                      </p>
                    </motion.div>
                  )}

                  {cameraError && (
                    <div className="bg-red-100 border-4 border-black p-4">
                      <p className="font-bold text-red-800">{cameraError}</p>
                    </div>
                  )}

                  {/* Quick Test Codes */}
                  <div className="pt-4 border-t-4 border-black">
                    <p className="font-black mb-2">QUICK TEST:</p>
                    <div className="flex gap-2 flex-wrap">
                      {["MED001234", "MED005678", "MED009999"].map((testCode) => (
                        <Button
                          key={testCode}
                          onClick={() => setCode(testCode)}
                          variant="outline"
                          className="border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] font-bold"
                        >
                          {testCode}
                        </Button>
                      ))}
                    </div>
                    
                    {/* Seed Database Button */}
                    <div className="mt-4 pt-4 border-t-4 border-black">
                      <p className="font-black mb-2 text-sm">FIRST TIME SETUP:</p>
                      <Button
                        onClick={handleSeedDatabase}
                        variant="outline"
                        className="w-full border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] font-bold bg-[#FFE500]"
                      >
                        Initialize Sample Data
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Display */}
              {result && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`${result.notFound ? "bg-gray-400" : getStatusColor(result.status)} border-4 border-black p-6 shadow-[8px_8px_0px_#000000]`}
                >
                  {result.notFound ? (
                    <div className="text-center">
                      <XCircle className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-3xl font-black mb-2">NOT FOUND</h3>
                      <p className="font-bold">Medicine code not in database</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        {getStatusIcon(result.status)}
                        <div>
                          <h3 className="text-3xl font-black uppercase">{result.status}</h3>
                          <p className="font-bold text-lg">{result.name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/20 border-4 border-black p-4">
                        <div>
                          <p className="font-black text-sm">MANUFACTURER:</p>
                          <p className="font-bold">{result.manufacturer}</p>
                        </div>
                        <div>
                          <p className="font-black text-sm">BATCH NO:</p>
                          <p className="font-bold">{result.batchNo}</p>
                        </div>
                        <div>
                          <p className="font-black text-sm">MFG DATE:</p>
                          <p className="font-bold">{result.mfgDate}</p>
                        </div>
                        <div>
                          <p className="font-black text-sm">EXP DATE:</p>
                          <p className="font-bold">{result.expDate}</p>
                        </div>
                        <div>
                          <p className="font-black text-sm">LICENSE:</p>
                          <p className="font-bold">{result.licenseNo}</p>
                        </div>
                        <div>
                          <p className="font-black text-sm">COUNTRY:</p>
                          <p className="font-bold">{result.country}</p>
                        </div>
                      </div>

                      {result.warnings && result.warnings.length > 0 && (
                        <div className="mt-4 bg-black text-white border-4 border-white p-4">
                          <p className="font-black mb-2">⚠️ WARNINGS:</p>
                          {result.warnings.map((warning: string, idx: number) => (
                            <p key={idx} className="font-bold">• {warning}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Stats */}
          <Card className="bg-[#FFE500] border-4 border-black shadow-[8px_8px_0px_#000000] p-6">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              STATS
            </h3>
            <div className="space-y-3">
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000000]">
                <p className="font-black text-sm">TOTAL MEDICINES</p>
                <p className="text-3xl font-black">{stats?.totalMedicines || 0}</p>
              </div>
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000000]">
                <p className="font-black text-sm">TOTAL SCANS</p>
                <p className="text-3xl font-black">{stats?.totalScans || 0}</p>
              </div>
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000000]">
                <p className="font-black text-sm">LEGAL PRODUCTS</p>
                <p className="text-3xl font-black">{stats?.legalProducts || 0}</p>
              </div>
            </div>
          </Card>

          {/* D3.js Statistics Chart */}
          <MedicineStats stats={stats} />

          {/* Recent Scans */}
          <Card className="bg-[#6B4EFF] border-4 border-black shadow-[8px_8px_0px_#000000] p-6">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2 text-white">
              <History className="w-6 h-6" />
              RECENT SCANS
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {recentScans && recentScans.length > 0 ? (
                recentScans.map((scan: Doc<"scans">) => (
                  <div
                    key={scan._id}
                    className="bg-white border-4 border-black p-3 shadow-[4px_4px_0px_#000000]"
                  >
                    <p className="font-black text-sm">{scan.medicineCode}</p>
                    <p className="font-bold text-xs text-gray-600">
                      {scan.medicineName || "Unknown"}
                    </p>
                    <p className="font-bold text-xs uppercase mt-1">{scan.status}</p>
                  </div>
                ))
              ) : (
                <p className="text-white font-bold text-center py-4">No scans yet</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}