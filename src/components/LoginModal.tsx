import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Phone, CheckCircle, MapPin, Award, User } from "lucide-react";
import { cn } from "../lib/utils.ts";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

const cities = ["Delhi", "Noida", "Ghaziabad", "Meerut", "Mumbai", "Bangalore", "Jaipur", "Hyderabad"];
const services = ["Griha Pravesh", "Satyanarayan", "Rudrabhishek", "Navgraha Puja", "Lakshmi Puja", "Mundan", "Naamkaran", "Shradh", "Havan", "Marriage Puja"];

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"customer" | "pandit">("customer");
  const [step, setStep] = useState<"phone" | "otp" | "onboarding">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [panditData, setPanditData] = useState({ name: "", city: "", spec: "" });
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep("phone");
      setPhone("");
      setOtp(["", "", "", "", "", ""]);
      setPanditData({ name: "", city: "", spec: "" });
    }
  }, [isOpen]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setStep("otp");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next field
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      if (activeTab === "pandit") {
        setStep("onboarding");
      } else {
        // Mock success for customer
        onLoginSuccess({ phone, role: "customer" });
        onClose();
      }
    }
  };

  const handleOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({ phone, ...panditData, role: "pandit" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F0F2D]/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[3rem] shadow-2xl z-[101] overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 w-10 h-10 rounded-full bg-saffron/10 text-saffron flex items-center justify-center hover:bg-saffron hover:text-white transition-all z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12">
              {/* Logo */}
              <div className="flex flex-col items-center mb-10">
                <div className="w-12 h-12 bg-saffron rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4">ॐ</div>
                <h2 className="text-2xl font-black text-text-dark tracking-tight">BookPandit<span className="text-saffron">Ji</span></h2>
              </div>

              {step !== "onboarding" && (
                <div className="flex border-b border-slate-100 mb-10">
                  <button 
                    onClick={() => setActiveTab("customer")}
                    className={cn(
                      "flex-1 pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
                      activeTab === "customer" ? "text-saffron" : "text-text-dark/30 hover:text-text-dark/50"
                    )}
                  >
                    Customer
                    {activeTab === "customer" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-saffron" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab("pandit")}
                    className={cn(
                      "flex-1 pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
                      activeTab === "pandit" ? "text-saffron" : "text-text-dark/30 hover:text-text-dark/50"
                    )}
                  >
                    Pandit Ji
                    {activeTab === "pandit" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-saffron" />}
                  </button>
                </div>
              )}

              {step === "phone" && (
                <motion.form 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleSendOtp}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Enter Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dark/40 font-bold border-r border-slate-200 pr-4">+91</div>
                      <input 
                        type="tel" 
                        maxLength={10}
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="98711XXXXX"
                        className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-20 pr-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 transition-all"
                      />
                    </div>
                  </div>

                  <button className="w-full py-5 bg-saffron text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-saffron/30 hover:bg-text-dark transition-all duration-500">
                    Send OTP
                  </button>

                  <div className="text-center">
                    <p className="text-[10px] font-bold text-text-dark/40 leading-relaxed">
                      {activeTab === "customer" 
                        ? "New to BookPanditJi? Your account is created automatically" 
                        : "Join 5000+ top-rated pandit ji's earning on our platform"}
                    </p>
                  </div>
                </motion.form>
              )}

              {step === "otp" && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-10"
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-text-dark">Verify OTP</h3>
                    <p className="text-xs text-text-dark/40 font-medium tracking-tight">Sent to +91 {phone}</p>
                  </div>

                  <div className="flex justify-between gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={otpRefs[i]}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className="w-full h-14 bg-slate-50 border-2 border-transparent text-center text-xl font-black text-text-dark rounded-xl focus:border-saffron focus:ring-0 transition-all"
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={handleVerify}
                      className="w-full py-5 bg-saffron text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-saffron/30 hover:bg-text-dark transition-all duration-500"
                    >
                      Verify & Continue
                    </button>
                    <button 
                      onClick={() => setStep("phone")}
                      className="w-full text-[10px] font-black uppercase tracking-widest text-text-dark/30 hover:text-saffron transition-colors"
                    >
                      Resend OTP in 30s
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "onboarding" && (
                <motion.form 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleOnboarding}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                     <h3 className="text-xl font-bold text-text-dark mb-1">Pandit Registration</h3>
                     <p className="text-xs text-text-dark/40 font-bold">Complete your profile to start receiving bookings</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 flex items-center gap-2">
                       <User size={12} /> Full Name
                    </label>
                    <input 
                      required
                      value={panditData.name}
                      onChange={e => setPanditData({...panditData, name: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 flex items-center gap-2">
                       <MapPin size={12} /> Work City
                    </label>
                    <select 
                      required
                      value={panditData.city}
                      onChange={e => setPanditData({...panditData, city: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 cursor-pointer"
                    >
                      <option value="">Select City</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 flex items-center gap-2">
                       <Award size={12} /> Primary Specialization
                    </label>
                    <select 
                      required
                      value={panditData.spec}
                      onChange={e => setPanditData({...panditData, spec: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 cursor-pointer"
                    >
                      <option value="">Select Ritual</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <button className="w-full py-5 bg-saffron text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-saffron/30 hover:bg-text-dark transition-all duration-500 mt-4">
                    Start Onboarding
                  </button>
                </motion.form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
