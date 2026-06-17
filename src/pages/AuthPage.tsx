import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, Phone, User, Info, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils.ts";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, googleAuthProvider, db as firestoreDb } from "../lib/firebase.ts";
import { useNavigate, useLocation, Link } from "react-router-dom";

const cities = [
  "Delhi NCR",
  "Noida",
  "Gurugram",
  "Ghaziabad",
  "Varanasi",
  "Haridwar",
  "Mathura",
  "Mumbai",
  "Bengaluru",
  "Jaipur",
  "Hyderabad",
  "Meerut",
  "Pune",
  "Kolkata",
  "Chennai",
  "Ahmedabad"
];
const specializations = ["Satyanarayan Puja", "Vivah Sanskar", "Griha Pravesh", "Mundan Sanskar", "Rudrabhishek", "Vastu Shanti"];

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeRole, setActiveRole] = useState<"customer" | "pandit">("customer");
  const [authMode, setAuthMode] = useState<"login" | "signup">(
    location.pathname === "/signup" ? "signup" : "login"
  );
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [spec, setSpec] = useState("");
  const [lang, setLang] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    setAuthMode(path.includes("/signup") ? "signup" : "login");
    if (path.includes("/devotee") || path.includes("/customer")) {
      setActiveRole("customer");
    } else if (path.includes("/pandit")) {
      setActiveRole("pandit");
    }
  }, [location.pathname]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      const result = await signInWithPopup(auth, googleAuthProvider);
      
      // Check user role from Firestore
      const userDoc = await getDoc(doc(firestoreDb, "users", result.user.uid));
      if (userDoc.exists() && userDoc.data()?.role === "pandit") {
        navigate("/pandit/dashboard");
      } else {
        navigate("/dashboard");
      }
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
        await updateProfile(result.user, { displayName: name });

        await setDoc(doc(firestoreDb, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email || null,
          name: name,
          phone: phone || null,
          role: activeRole,
          city: city || null,
          specialization: activeRole === "pandit" ? spec : null,
          preferredLanguage: activeRole === "customer" ? lang : null,
          photoUrl: null,
          isVerified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        if (activeRole === "pandit") {
           navigate("/pandit/onboarding");
        } else {
           navigate("/dashboard");
        }
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        
        // Check user role from Firestore
        const userDoc = await getDoc(doc(firestoreDb, "users", result.user.uid));
        if (userDoc.exists() && userDoc.data()?.role === "pandit") {
          navigate("/pandit/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row overflow-hidden">
      {/* Visual Side Strip */}
      <div className="hidden lg:flex w-1/3 bg-primary relative overflow-hidden flex-col justify-between p-12 text-white">
         <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl backdrop-blur-md shadow-xl ring-1 ring-white/30">ॐ</div>
               <span className="text-2xl font-black tracking-tighter">BookPanditJi</span>
            </Link>
         </div>

         <div className="relative z-10 space-y-6">
            <h1 className="text-5xl font-black leading-tight tracking-tighter italic">
               The path to peace <br /> begins with <br /> <span className="text-secondary-container">tradition.</span>
            </h1>
            <p className="text-white/60 font-bold max-w-xs leading-loose">
               Connect with verified scholars for over 100+ different vedic rituals and ceremonies.
            </p>
         </div>

         <div className="relative z-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            <div className="w-8 h-px bg-white"></div>
            <span>Sacred Devotion Since 2026</span>
         </div>

         {/* Mandala Background Accents */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] mandala-pattern opacity-10 animate-spin-slow"></div>
         <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary-container/20 rounded-full blur-[100px]"></div>
         <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-container/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 relative bg-white">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8">
           <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">ॐ</div>
              <span className="font-black text-on-surface">BookPanditJi</span>
           </Link>
        </div>

        <div className="w-full max-w-md space-y-10">
          <div className="space-y-4">
             <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-colors group">
               <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
             </Link>
             <div className="space-y-2">
               <h2 className="text-4xl font-black text-on-surface tracking-tighter">
                  {authMode === "login" ? "Sign In" : "Create Account"}
               </h2>
               <p className="text-sm font-bold text-on-surface-variant/60 leading-relaxed">
                  {authMode === "login" 
                    ? "Welcome back to your spiritual sanctuary." 
                    : "Begin your journey today as a " + (activeRole === "pandit" ? "Ritual Master." : "Devotee.")}
               </p>
             </div>
          </div>

          {/* Role selection is now handled via separate routes, so toggle is removed */}

          {activeRole === "pandit" && authMode === "signup" && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-secondary-container rounded-2xl border border-secondary/20 flex gap-4 items-start shadow-sm"
            >
              <Info className="text-on-secondary-container shrink-0 mt-0.5" size={18} />
              <div className="text-[10px] font-bold text-on-secondary-container leading-loose">
                Ritual Master status requires verification by our council. Your registration will trigger a mandatory Vedic validation sequence.
              </div>
            </motion.div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-6">
            <AnimatePresence mode="wait">
              {authMode === "signup" && (
                <motion.div 
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="text" required value={name} onChange={e => setName(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface focus:outline-none focus:border-primary transition-all"
                        placeholder="e.g. Pandit Rajesh Sharma"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Mobile Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="tel" required value={phone} 
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) setPhone(val);
                        }}
                        maxLength={10}
                        className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface focus:outline-none focus:border-primary transition-all"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface focus:outline-none focus:border-primary transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Password</label>
                {authMode === "login" && (
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface focus:outline-none focus:border-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {authMode === "signup" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">City</label>
                  <select 
                    required value={city} onChange={e => setCity(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl py-4 px-4 font-bold text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {activeRole === "pandit" ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Specialization</label>
                    <select 
                      required value={spec} onChange={e => setSpec(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl py-4 px-4 font-bold text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option value="">Expertise</option>
                      {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Preferred Language</label>
                    <select 
                      required value={lang} onChange={e => setLang(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl py-4 px-4 font-bold text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option value="">Select Language</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                      <option value="Sanskrit">Sanskrit</option>
                      <option value="Marathi">Marathi</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest bg-red-50 py-3 rounded-xl border border-red-100">{error}</p>}

            <button 
              disabled={isLoading}
              className="group w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-full shadow-2xl shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <span>{isLoading ? "Transmitting..." : authMode === "login" ? "Enter Sanctuary" : "Confirm Vows"}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={() => {
                   if (authMode === "login") {
                      setIsRoleModalOpen(true);
                   } else {
                      setAuthMode("login");
                      navigate("/login");
                   }
                }}
                className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors underline decoration-dotted underline-offset-4"
              >
                {authMode === "login" ? "New to the path? Create account" : "Already been here? Sign in"}
              </button>
            </div>
          </form>

          {authMode === "login" && (
            <div className="space-y-8">
              <div className="relative flex items-center">
                <div className="grow border-t border-outline-variant/10"></div>
                <span className="shrink mx-6 text-[10px] font-black text-on-surface-variant/20 uppercase tracking-[0.3em]">Ritual Connect</span>
                <div className="grow border-t border-outline-variant/10"></div>
              </div>

              <button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-5 border-2 border-outline-variant/10 text-on-surface-variant font-black text-[10px] uppercase tracking-widest rounded-full flex items-center justify-center gap-4 hover:bg-surface-container-low transition-all disabled:opacity-50 shadow-sm"
              >
                <img src="https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" className="w-5 h-5 object-contain" alt="Google" />
                Proceed with Google
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Role Selection Modal */}
      <AnimatePresence>
        {isRoleModalOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setIsRoleModalOpen(false)}
               className="fixed inset-0 bg-[#0F0F2D]/60 backdrop-blur-md z-50"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[3rem] shadow-2xl z-50 p-12 text-center"
            >
               <h3 className="text-3xl font-black text-on-surface tracking-tighter mb-4">Choose Your Path</h3>
               <p className="text-sm font-bold text-on-surface-variant/40 mb-10">How would you like to join our sacred community?</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button 
                    onClick={() => {
                       setActiveRole("customer");
                       setAuthMode("signup");
                       navigate("/signup/devotee");
                       setIsRoleModalOpen(false);
                    }}
                    className="group bg-surface-container border border-outline-variant/20 p-8 rounded-[2.5rem] hover:bg-primary transition-all duration-500 hover:scale-[1.03] active:scale-95"
                  >
                     <div className="w-16 h-16 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-sm ring-1 ring-black/5 group-hover:rotate-6 transition-transform">🙏</div>
                     <h4 className="text-lg font-black text-on-surface group-hover:text-white mb-2">Devotee</h4>
                     <p className="text-[10px] font-bold text-on-surface-variant/40 group-hover:text-white/60 leading-relaxed capitalize">book rituals & seek spiritual guidance</p>
                  </button>

                  <button 
                    onClick={() => {
                       setActiveRole("pandit");
                       setAuthMode("signup");
                       navigate("/signup/pandit");
                       setIsRoleModalOpen(false);
                    }}
                    className="group bg-surface-container border border-outline-variant/20 p-8 rounded-[2.5rem] hover:bg-primary transition-all duration-500 hover:scale-[1.03] active:scale-95 text-center"
                  >
                     <div className="w-16 h-16 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-sm ring-1 ring-black/5 group-hover:-rotate-6 transition-transform text-primary">ॐ</div>
                     <h4 className="text-lg font-black text-on-surface group-hover:text-white mb-2">Ritual Master</h4>
                     <p className="text-[10px] font-bold text-on-surface-variant/40 group-hover:text-white/60 leading-relaxed capitalize">share your legacy & perform vedic rituals</p>
                  </button>
               </div>

               <button 
                 onClick={() => setIsRoleModalOpen(false)}
                 className="mt-12 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-colors"
               >
                  Go Back
               </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
