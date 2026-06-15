import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Mail, Lock, Phone } from "lucide-react";
import { cn } from "../lib/utils.ts";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleAuthProvider, db as firestoreDb } from "../lib/firebase.ts";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

const cities = ["Delhi", "Noida", "Ghaziabad", "Meerut", "Mumbai", "Bangalore", "Jaipur", "Hyderabad"];
const services = ["Griha Pravesh", "Satyanarayan", "Rudrabhishek", "Navgraha Puja", "Lakshmi Puja", "Mundan", "Naamkaran", "Shradh", "Havan", "Marriage Puja"];

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"customer" | "pandit">("customer");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [panditData, setPanditData] = useState({ city: "", spec: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setError("");
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      const result = await signInWithPopup(auth, googleAuthProvider);
      onLoginSuccess(result.user);
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (authMode === "signup") {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Update Firebase Auth profile
        await updateProfile(result.user, { displayName: name });

        // Write user data directly to Firestore BEFORE onLoginSuccess fires
        // This ensures data is ready when onAuthStateChanged triggers loadUserFromFirestore
        await setDoc(doc(firestoreDb, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email || null,
          name: name,
          phone: phone || null,
          role: activeTab === "pandit" ? "pandit" : "customer",
          city: activeTab === "pandit" ? panditData.city : null,
          specialization: activeTab === "pandit" ? panditData.spec : null,
          photoUrl: null,
          isVerified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Now notify parent — data is already in Firestore
        onLoginSuccess(result.user);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess(result.user);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F0F2D]/80 backdrop-blur-sm z-100"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-4xl shadow-2xl z-101 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 w-10 h-10 rounded-full bg-saffron/10 text-saffron flex items-center justify-center hover:bg-saffron hover:text-white transition-all z-10"
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 pb-12">
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 bg-saffron rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4">ॐ</div>
                <h2 className="text-2xl font-black text-text-dark tracking-tight">BookPandit<span className="text-saffron">Ji</span></h2>
              </div>

              <div className="flex border-b border-slate-100 mb-6">
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

              <div className="space-y-6">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {authMode === "signup" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/30" size={18} />
                          <input 
                            type="text" required value={name} onChange={e => setName(e.target.value)}
                            className="w-full bg-slate-50 rounded-xl py-4 pl-12 pr-4 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 transition-all border-none outline-none"
                            placeholder="Enter your name"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Mobile Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/30" size={18} />
                          <input 
                            type="tel" required 
                            value={phone} 
                            onChange={e => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 10) setPhone(value);
                            }}
                            maxLength={10}
                            className="w-full bg-slate-50 rounded-xl py-4 pl-12 pr-4 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 transition-all border-none outline-none"
                            placeholder="0000000000"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/30" size={18} />
                      <input 
                        type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-50 rounded-xl py-4 pl-12 pr-4 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 transition-all border-none outline-none"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/30" size={18} />
                      <input 
                        type="password" required value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full bg-slate-50 rounded-xl py-4 pl-12 pr-4 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 transition-all border-none outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {authMode === "signup" && activeTab === "pandit" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Work City</label>
                        <select 
                          required value={panditData.city}
                          onChange={e => setPanditData({...panditData, city: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 cursor-pointer outline-none"
                        >
                          <option value="">Select City</option>
                          {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Specialization</label>
                        <select 
                          required value={panditData.spec}
                          onChange={e => setPanditData({...panditData, spec: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 cursor-pointer outline-none"
                        >
                          <option value="">Select Ritual</option>
                          {services.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}

                  <button 
                    disabled={isLoading}
                    className="w-full py-5 bg-saffron text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-saffron/30 hover:bg-text-dark transition-all duration-500 disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : authMode === "login" ? "Login" : "Create Account"}
                  </button>

                  <div className="text-center pt-2">
                    <button 
                      type="button"
                      onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                      className="text-[10px] font-black uppercase tracking-widest text-text-dark/40 hover:text-saffron transition-colors"
                    >
                      {authMode === "login" ? "New here? Create account" : "Already have an account? Login"}
                    </button>
                  </div>
                </form>

                {authMode === "login" && (
                  <>
                    <div className="relative flex items-center py-2">
                      <div className="grow border-t border-slate-100"></div>
                      <span className="shrink mx-4 text-[10px] font-black text-text-dark/20 uppercase tracking-widest">or continue with</span>
                      <div className="grow border-t border-slate-100"></div>
                    </div>

                    <button 
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full py-4 border-2 border-slate-100 text-text-dark font-bold text-xs rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                      <img src="https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" className="w-5 h-5 object-contain" alt="Google" />
                      Google Account
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
