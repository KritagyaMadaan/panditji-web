import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User as UserIcon, 
  Mail,
  Lock,
  Phone,
  MapPin, 
  Award, 
  Languages, 
  IndianRupee, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Briefcase,
  Globe,
  Truck,
  Plus,
  Minus,
  UploadCloud,
  Loader2,
  X,
  Info
} from "lucide-react";
import { cn } from "../lib/utils.ts";
import { 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { auth, db as firestoreDb } from "../lib/firebase.ts";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface OnboardingData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  city: string;
  experience: number;
  expertise: string[];
  languages: string[];
  bio: string;
  basePrice: number;
  travelRadius: number;
  outstationTravel: boolean;
  aadhaarNumber: string;
}

const EXPERTISE_OPTIONS = [
  "Griha Pravesh", "Vivah Sanskar", "Satyanarayan Puja", 
  "Mundan", "Rudrabhishek", "Antyesti Kriya", 
  "Vastu Shanti", "Navgrah Shanti", "Havan"
];

const LANGUAGE_OPTIONS = ["Sanskrit", "Hindi", "English", "Marathi", "Bengali", "Tamil", "Punjabi"];

export default function PanditOnboarding({ user, onComplete }: { user: any, onComplete: () => void }) {
  const [step, setStep] = useState(user ? 2 : 1);
  const totalSteps = 5;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OnboardingData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    city: user?.city || "Varanasi",
    experience: 5,
    expertise: [],
    languages: ["Sanskrit", "Hindi"],
    bio: "",
    basePrice: 2100,
    travelRadius: 25,
    outstationTravel: false,
    aadhaarNumber: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const nextStep = async () => {
    if (step === 1 && !user) {
      // Create Account First
      setIsSubmitting(true);
      setError("");
      try {
        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password!);
        await updateProfile(result.user, { displayName: formData.name });
        
        // Initial user doc
        await setDoc(doc(firestoreDb, "users", result.user.uid), {
          uid: result.user.uid,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          role: "pandit",
          city: formData.city,
          onboardingCompleted: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        setStep(2);
      } catch (err: any) {
        setError(err.message || "Registration failed");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    setStep(s => Math.min(s + 1, totalSteps));
  };
  
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const toggleSelection = (field: 'expertise' | 'languages', value: string) => {
    setFormData(prev => {
      const current = prev[field] as string[];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const targetUid = user?.uid || auth.currentUser?.uid;
      if (targetUid) {
        const { password, ...cleanData } = formData;
        await setDoc(doc(firestoreDb, "users", targetUid), {
          ...cleanData,
          role: "pandit",
          onboardingCompleted: true,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      
      setIsSuccess(true);
      setTimeout(() => {
        onComplete && onComplete();
        navigate("/pandit/dashboard");
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Soul & Identity";
      case 2: return "Ritual Heritage";
      case 3: return "Divine Expertise";
      case 4: return "Service & Radius";
      case 5: return "Final Sanctification";
      default: return "Partner Registration";
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md space-y-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-900/5">
             <CheckCircle className="text-green-600" size={48} />
          </div>
          <div className="space-y-4">
             <h2 className="text-4xl font-black text-on-surface tracking-tight">Application Transmitted</h2>
             <p className="text-sm font-bold text-on-surface-variant/40 leading-loose">
                Dhanyawad Pandit Ji! Our spiritual council will verify your sanctuary details. 
                Your journey officially begins soon.
             </p>
          </div>
          <div className="pt-8">
             <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="bg-primary h-full"
                />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mt-4 animate-pulse">Establishing Connection...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white sacred-shadow h-16 flex items-center px-4 md:px-8 max-w-[1440px] mx-auto border-b border-outline-variant/30">
        <div className="flex items-center gap-2 font-decorative text-xl font-bold text-primary">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">ॐ</div>
          <span>BookPanditJi</span>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-4">
           <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">Pandit Onboarding Portal</p>
        </div>
      </header>

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Ritual Step {step}</p>
              <h1 className="text-3xl font-black text-on-surface tracking-tight">{getStepTitle()}</h1>
            </div>
            <span className="text-xs font-black text-on-surface-variant/20 uppercase tracking-widest">Step {step}/{totalSteps}</span>
          </div>
          <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden border border-outline-variant/20">
             <motion.div 
               animate={{ width: `${(step/totalSteps)*100}%` }}
               className="bg-primary h-full"
             />
          </div>
        </div>

        {/* Wizard Form */}
        <div className="bg-white rounded-[2.5rem] sacred-shadow p-8 md:p-12 relative overflow-hidden border border-outline-variant/10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="p-6 bg-secondary-container rounded-3xl border border-secondary/20 flex gap-4 items-start shadow-sm mb-4">
                  <Info className="text-on-secondary-container shrink-0 mt-0.5" size={20} />
                  <div className="text-[10px] font-bold text-on-secondary-container leading-loose">
                    Creating your account initiates the Vedic validation sequence. Please ensure your details are accurate for our spiritual council.
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Full Divine Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 font-bold focus:border-primary focus:outline-none transition-all"
                        placeholder="e.g. Pandit Somesh Sharma"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 font-bold focus:border-primary focus:outline-none transition-all"
                          placeholder="name@gmail.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Mobile Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                        <input
                          maxLength={10}
                          type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 font-bold focus:border-primary focus:outline-none transition-all"
                          placeholder="10 digit number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Establish Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 font-bold focus:border-primary focus:outline-none transition-all"
                         placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest bg-red-50 py-3 rounded-xl border border-red-100">{error}</p>}

                <div className="text-center pt-2">
                  <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors underline decoration-dotted underline-offset-4">
                    Already been here? Sign in
                  </Link>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Primary Divine City</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                      <select 
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 font-bold focus:border-primary focus:outline-none appearance-none transition-all"
                      >
                        <option>Varanasi</option>
                        <option>Haridwar</option>
                        <option>Delhi NCR</option>
                        <option>Mumbai</option>
                        <option>Mathura</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Years of Practice</label>
                    <div className="flex items-center gap-6 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-2 w-max">
                       <button 
                        onClick={() => setFormData({...formData, experience: Math.max(0, formData.experience - 1)})}
                        className="w-10 h-10 rounded-xl bg-white text-primary sacred-shadow flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                       >
                         <Minus size={18} />
                       </button>
                       <span className="text-xl font-black italic w-8 text-center">{formData.experience}</span>
                       <button 
                        onClick={() => setFormData({...formData, experience: formData.experience + 1})}
                        className="w-10 h-10 rounded-xl bg-white text-primary sacred-shadow flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                       >
                         <Plus size={18} />
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">Select Your Divine Specializations</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {EXPERTISE_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => toggleSelection('expertise', opt)}
                        className={cn(
                          "py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          formData.expertise.includes(opt) 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                            : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant/60 hover:bg-white"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">Scriptural Languages</h3>
                  <div className="flex flex-wrap gap-3">
                    {LANGUAGE_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => toggleSelection('languages', opt)}
                        className={cn(
                          "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                          formData.languages.includes(opt) 
                            ? "bg-secondary-container text-on-secondary-container border-secondary shadow-md"
                            : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant/40"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="bg-surface-container-low p-8 rounded-3xl space-y-6">
                   <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">Radius of Reach</label>
                      <span className="text-xl font-black italic text-primary">{formData.travelRadius} KM</span>
                   </div>
                   <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    value={formData.travelRadius}
                    onChange={e => setFormData({...formData, travelRadius: parseInt(e.target.value)})}
                    className="w-full h-1 bg-outline-variant/30 appearance-none rounded-full accent-primary cursor-pointer"
                   />
                   <div className="flex justify-between text-[8px] font-black text-on-surface-variant/20 uppercase tracking-widest">
                      <span>5 KM</span>
                      <span>100 KM</span>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between p-6 bg-white border border-outline-variant/20 rounded-3xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container">
                           <Truck size={20} />
                        </div>
                        <div>
                           <h4 className="font-black text-sm">Outstation Divine Travels</h4>
                           <p className="text-[10px] font-bold text-on-surface-variant/40">Open to travel between cities?</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setFormData({...formData, outstationTravel: !formData.outstationTravel})}
                        className={cn(
                          "w-12 h-7 rounded-full relative transition-all",
                          formData.outstationTravel ? "bg-primary" : "bg-outline-variant/30"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md",
                          formData.outstationTravel ? "left-6" : "left-1"
                        )} />
                      </button>
                   </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Base Dakshina (₹)</label>
                    <div className="relative group">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="number"
                        value={formData.basePrice}
                        onChange={e => setFormData({...formData, basePrice: parseInt(e.target.value)})}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 font-bold focus:border-primary focus:outline-none transition-all"
                        placeholder="2100"
                      />
                    </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                 <div className="bg-primary/5 border border-primary/10 p-8 rounded-4xl space-y-6">
                    <h3 className="text-xl font-black text-on-surface italic">Sanctification Summary</h3>
                    <div className="grid grid-cols-2 gap-y-4 text-xs">
                       <div className="text-on-surface-variant/50 font-bold uppercase tracking-widest">Ritual Master</div>
                       <div className="text-on-surface font-black pr-2">{formData.name}</div>
                       
                       <div className="text-on-surface-variant/50 font-bold uppercase tracking-widest">Experience</div>
                       <div className="text-on-surface font-black">{formData.experience} Sacred Years</div>
                       
                       <div className="text-on-surface-variant/50 font-bold uppercase tracking-widest">Expertise</div>
                       <div className="text-on-surface font-black">{formData.expertise.join(", ")}</div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Aadhaar Card Number</label>
                       <div className="relative group">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                          <input 
                            type="text"
                            required
                            maxLength={12}
                            value={formData.aadhaarNumber}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, "");
                              if (val.length <= 12) setFormData({...formData, aadhaarNumber: val});
                            }}
                            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 font-bold focus:border-primary focus:outline-none transition-all"
                            placeholder="12-digit number"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">Aadhaar Document Copy</label>
                       <div className="border-2 border-dashed border-outline-variant/30 rounded-3xl p-10 flex flex-col items-center gap-4 hover:bg-surface-container-low cursor-pointer transition-all hover:border-primary/40 group">
                          <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                             <UploadCloud size={24} />
                          </div>
                          <div className="text-center">
                             <p className="text-xs font-black text-on-surface">Upload Front & Back Combined</p>
                             <p className="text-[10px] font-bold text-on-surface-variant/40 mt-1">PDF or Image (Max 5MB)</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between items-center sm:px-2">
            {step === 1 ? (
              <Link 
                to="/" 
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
              </Link>
            ) : (
              <button 
                onClick={prevStep}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-on-surface transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            {step < totalSteps ? (
              <button 
                onClick={nextStep}
                className="bg-primary text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
              >
                Next Ritual <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-secondary-container text-on-secondary-container px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-secondary-container/20 hover:scale-[1.02] active:scale-95 transition-all border-2 border-secondary flex items-center gap-3"
              >
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Transmitting...</> : "Sanctify & Join"}
              </button>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer Visual */}
      <div className="fixed bottom-0 right-0 w-64 h-64 mandala-pattern opacity-5 pointer-events-none -z-10" />
      <div className="fixed top-20 left-0 w-48 h-48 mandala-pattern opacity-5 pointer-events-none -z-10" />
    </div>
  );
}
