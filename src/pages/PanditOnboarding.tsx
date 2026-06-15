import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  MapPin, 
  Award, 
  Languages, 
  Image as ImageIcon, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  FileText, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileUp,
  CreditCard,
  Building2,
  Trash2,
  Zap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils.ts";

const pujaTypes = [
  "Griha Pravesh",
  "Satyanarayan Katha",
  "Rudrabhishek",
  "Navgraha Puja",
  "Lakshmi Puja",
  "Mundan",
  "Naamkaran",
  "Shradh",
  "Marriage Pandit",
  "Vastu Shanti",
  "Maha Mrityunjaya",
  "Durga Puja"
];

const steps = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Specializations" },
  { id: 3, label: "Services & Pricing" },
  { id: 4, label: "Documents" },
  { id: 5, label: "Review & Submit" }
];

export default function PanditOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    city: "",
    experience: "",
    languages: [] as string[],
    profilePhoto: null as File | null,
    specializations: [] as string[],
    pricing: {} as Record<string, string>,
    aadhaarFront: null as File | null,
    aadhaarBack: null as File | null,
    certificate: null as File | null
  });

  // Derived Values
  const avgPrice = useMemo(() => {
    const prices = Object.values(formData.pricing).map(p => parseInt(p as string) || 0).filter(p => p > 0);
    return prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  }, [formData.pricing]);

  const potentialEarnings = avgPrice * 15;

  // Handlers
  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang) 
        ? prev.languages.filter(l => l !== lang) 
        : [...prev.languages, lang]
    }));
  };

  const toggleSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const handlePriceChange = (spec: string, price: string) => {
    setFormData(prev => ({
      ...prev,
      pricing: { ...prev.pricing, [spec]: price }
    }));
  };

  const handleFileUpload = (field: keyof typeof formData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-emerald-50/30 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-emerald-900/5 border border-emerald-100 text-center max-w-2xl w-full"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-10 shadow-lg border-4 border-white">
            <Clock size={48} className="animate-pulse" />
          </div>
          <h2 className="text-4xl font-black text-text-dark tracking-tighter mb-6">Pending Verification</h2>
          <p className="text-lg text-text-dark/40 font-medium leading-relaxed mb-12">
            Your profile is under review by our spiritual quality council. We'll notify you via email within <span className="text-emerald-600 font-bold">24-48 hours</span> once your account is ready to accept bookings.
          </p>
          <button 
            onClick={() => navigate("/")}
            className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-text-dark font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">ॐ</div>
          <span className="font-black tracking-tighter text-xl">BookPandit<span className="text-emerald-600">Ji</span> <span className="text-text-dark/20 text-xs uppercase tracking-widest ml-2">Partner</span></span>
        </Link>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-dark/40">
           Step {currentStep} of 5
        </div>
      </header>

      <main className="pt-32 pb-40 px-4 max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-20 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-emerald-100 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 rounded-full transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          ></div>
          
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
               <div className={cn(
                 "w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 border-4 border-white shadow-md",
                 currentStep >= step.id ? "bg-emerald-600 text-white" : "bg-emerald-100 text-text-dark/20"
               )}>
                 {currentStep > step.id ? <Check size={16} /> : step.id}
               </div>
               <span className={cn(
                 "absolute -bottom-8 whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all",
                 currentStep >= step.id ? "text-emerald-600" : "text-text-dark/20"
               )}>
                 {step.label}
               </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-emerald-900/5 border border-emerald-100">
                <h2 className="text-3xl font-black tracking-tight mb-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <User size={24} />
                  </div>
                  Personal Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Full Legal Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Acharya Rajesh Kumar"
                      className="w-full bg-slate-50/50 border-emerald-50 rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="name@puja.com"
                      className="w-full bg-slate-50/50 border-emerald-50 rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">City / Operating Area</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Gurugram, Sector 45"
                      className="w-full bg-slate-50/50 border-emerald-50 rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Years of Experience</label>
                    <select 
                      className="w-full bg-slate-50/50 border-emerald-50 rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-emerald-200 transition-all outline-none cursor-pointer appearance-none"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    >
                      <option value="">Select Experience</option>
                      <option value="1-5">1-5 Years</option>
                      <option value="6-10">6-10 Years</option>
                      <option value="11-20">11-20 Years</option>
                      <option value="20+">20+ Years</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Profile Photo</label>
                    <div className="relative group">
                       <input 
                         type="file" 
                         className="absolute inset-0 opacity-0 cursor-pointer z-10"
                         onChange={(e) => handleFileUpload("profilePhoto", e.target.files ? e.target.files[0] : null)}
                       />
                       <div className="bg-slate-50/50 border-2 border-dashed border-emerald-100 rounded-2xl py-4 px-6 font-bold flex items-center justify-center gap-4 text-text-dark/40 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all">
                          {formData.profilePhoto ? <CheckCircle2 size={24} className="text-emerald-500" /> : <ImageIcon size={24} />}
                          <span className="text-xs truncate">{formData.profilePhoto ? formData.profilePhoto.name : "Upload Photo"}</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Languages Known</label>
                  <div className="flex flex-wrap gap-3">
                    {["Hindi", "English", "Sanskrit", "Marathi", "Bengali", "Tamil", "Telegu", "Kannada"].map(lang => (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={cn(
                          "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          formData.languages.includes(lang) 
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20" 
                            : "bg-white text-text-dark/40 border-emerald-50 hover:border-emerald-300"
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Specializations */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-emerald-900/5 border border-emerald-100">
                <h2 className="text-3xl font-black tracking-tight mb-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Award size={24} />
                  </div>
                  Specializations
                </h2>
                <p className="text-md text-text-dark/40 font-medium mb-12">Select the puja rituals and services you are qualified to perform. You can add more later.</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {pujaTypes.map((puja) => (
                    <button
                      key={puja}
                      onClick={() => toggleSpecialization(puja)}
                      className={cn(
                        "p-6 rounded-4xl border-2 transition-all flex flex-col items-center text-center gap-4",
                        formData.specializations.includes(puja)
                          ? "bg-emerald-50 border-emerald-600 shadow-xl shadow-emerald-600/5 scale-[1.02]"
                          : "bg-white border-emerald-50 hover:border-emerald-200"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                        formData.specializations.includes(puja) ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-600"
                      )}>
                        <div className="font-black text-xs">{puja[0]}</div>
                      </div>
                      <span className="text-sm font-black tracking-tight">{puja}</span>
                      {formData.specializations.includes(puja) && (
                        <div className="bg-emerald-600 text-white p-1 rounded-full absolute -top-2 -right-2 border-4 border-white shadow-md">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Services & Pricing */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-emerald-900/5 border border-emerald-100">
                <h2 className="text-3xl font-black tracking-tight mb-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <DollarSign size={24} />
                  </div>
                  Services & Pricing
                </h2>
                
                {formData.specializations.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center gap-6">
                    <AlertCircle size={48} className="text-amber-500" />
                    <p className="text-lg font-bold text-text-dark/40">Please select at least one specialization in previous step.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formData.specializations.map((spec) => (
                      <div key={spec} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 bg-slate-50/50 rounded-3xl border border-emerald-50 group hover:bg-emerald-50/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg font-black">{spec[0]}</div>
                          <span className="font-black text-lg">{spec}</span>
                        </div>
                        <div className="relative">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dark/30 font-black">₹</div>
                          <input 
                            type="number" 
                            placeholder="Set Price"
                            className="bg-white border-none rounded-2xl py-4 pl-12 pr-6 font-black w-full sm:w-48 shadow-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                            value={formData.pricing[spec] || ""}
                            onChange={(e) => handlePriceChange(spec, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Earnings Potential Calculator */}
              <motion.div 
                layout
                className="bg-emerald-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-emerald-600/30"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-bl-full pointer-events-none -mr-20 -mt-20 backdrop-blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                   <div className="text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md">
                        <Zap size={14} className="animate-pulse" /> Live Estimate
                      </div>
                      <h3 className="text-3xl font-black mb-4">Earnings Potential</h3>
                      <p className="text-white/60 text-sm font-medium leading-relaxed italic">Calculated based on 15 monthly bookings at your average set price.</p>
                   </div>
                   <div className="flex flex-col items-center md:items-end">
                      <div className="text-sm font-black uppercase tracking-widest text-white/40 mb-2">Monthly Potential</div>
                      <div className="text-5xl lg:text-7xl font-black italic tracking-tighter">
                         ₹{potentialEarnings.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mt-4">At ₹{avgPrice || 0} Average Price</div>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-emerald-900/5 border border-emerald-100">
                <h2 className="text-3xl font-black tracking-tight mb-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <FileText size={24} />
                  </div>
                  KYC Verification
                </h2>
                <p className="text-md text-text-dark/40 font-medium mb-12">Upload clear photos of your identification documents for mandatory background check.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Aadhaar Front */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/40 block">Aadhaar Card (Front) *</label>
                    <div className="relative aspect-video rounded-3xl border-2 border-dashed border-emerald-100 bg-slate-50 flex flex-col items-center justify-center gap-4 group overflow-hidden">
                       {formData.aadhaarFront ? (
                         <div className="w-full h-full relative">
                            <img src={URL.createObjectURL(formData.aadhaarFront)} className="w-full h-full object-cover" />
                            <button 
                              onClick={() => handleFileUpload("aadhaarFront", null)}
                              className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 shadow-xl"
                            >
                               <Trash2 size={18} />
                            </button>
                         </div>
                       ) : (
                         <>
                           <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                              <CreditCard size={32} />
                           </div>
                           <div className="text-center">
                              <div className="text-sm font-black mb-1">Click to Upload</div>
                              <div className="text-[10px] font-bold text-text-dark/20 uppercase tracking-widest">PNG, JPG up to 5MB</div>
                           </div>
                           <input 
                              type="file" 
                              required 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              onChange={(e) => handleFileUpload("aadhaarFront", e.target.files ? e.target.files[0] : null)}
                           />
                         </>
                       )}
                    </div>
                  </div>

                  {/* Aadhaar Back */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/40 block">Aadhaar Card (Back) *</label>
                    <div className="relative aspect-video rounded-3xl border-2 border-dashed border-emerald-100 bg-slate-50 flex flex-col items-center justify-center gap-4 group overflow-hidden">
                       {formData.aadhaarBack ? (
                         <div className="w-full h-full relative">
                            <img src={URL.createObjectURL(formData.aadhaarBack)} className="w-full h-full object-cover" />
                            <button 
                              onClick={() => handleFileUpload("aadhaarBack", null)}
                              className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 shadow-xl"
                            >
                               <Trash2 size={18} />
                            </button>
                         </div>
                       ) : (
                         <>
                           <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                              <CreditCard size={32} />
                           </div>
                           <div className="text-center">
                              <div className="text-sm font-black mb-1">Click to Upload</div>
                              <div className="text-[10px] font-bold text-text-dark/20 uppercase tracking-widest">PNG, JPG up to 5MB</div>
                           </div>
                           <input 
                              type="file" 
                              required 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              onChange={(e) => handleFileUpload("aadhaarBack", e.target.files ? e.target.files[0] : null)}
                           />
                         </>
                       )}
                    </div>
                  </div>

                  {/* Degree/Certificate */}
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/40 block">Certificate / Degree (Optional)</label>
                    <div className="relative py-12 rounded-3xl border-2 border-dashed border-emerald-100 bg-slate-50 flex flex-col items-center justify-center gap-4 group">
                       <input 
                         type="file" 
                         className="absolute inset-0 opacity-0 cursor-pointer" 
                         onChange={(e) => handleFileUpload("certificate", e.target.files ? e.target.files[0] : null)}
                       />
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl text-emerald-600">
                             <FileUp size={32} />
                          </div>
                          <div>
                             <div className="text-lg font-black">{formData.certificate ? formData.certificate.name : "Select Document"}</div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/20">University Degree or Vedic Certification</div>
                          </div>
                          {formData.certificate && <CheckCircle2 className="text-emerald-500" size={24} />}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-emerald-900/5 border border-emerald-100">
                <h2 className="text-3xl font-black tracking-tight mb-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <ShieldCheck size={24} />
                  </div>
                  Review Application
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/20 mb-4">Identity</div>
                         <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-4xl">
                            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-4xl text-white shadow-xl">
                               {formData.profilePhoto ? <img src={URL.createObjectURL(formData.profilePhoto)} className="w-full h-full object-cover rounded-full" /> : "🧘‍♂️"}
                            </div>
                            <div>
                               <div className="text-xl font-black">{formData.fullName || "N/A"}</div>
                               <div className="text-sm font-bold text-text-dark/40">{formData.experience} Experience • {formData.city}</div>
                            </div>
                         </div>
                      </div>
                      
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/20 mb-4">Languages</div>
                         <div className="flex flex-wrap gap-2">
                            {formData.languages.map(l => (
                              <span key={l} className="px-5 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">{l}</span>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/20 mb-4">Specializations & Pricing</div>
                         <div className="space-y-3">
                            {formData.specializations.slice(0, 4).map(s => (
                              <div key={s} className="flex items-center justify-between p-4 bg-emerald-50/30 rounded-2xl border border-emerald-50 text-sm font-black">
                                 <span className="opacity-60">{s}</span>
                                 <span className="text-emerald-700">₹{formData.pricing[s] || "0"}</span>
                              </div>
                            ))}
                            {formData.specializations.length > 4 && (
                               <div className="text-center text-[10px] font-black text-text-dark/30 pt-2">+{formData.specializations.length - 4} More</div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-16 p-8 rounded-3xl bg-amber-50 border border-amber-100 flex items-start gap-6">
                   <AlertCircle className="text-amber-600 shrink-0 mt-1" size={24} />
                   <p className="text-xs font-bold text-amber-800 leading-relaxed">
                      By submitting this, you certify that all information provided is accurate and rituals will be performed as per Vedic guidelines. False information can lead to permanent blacklisting. 
                   </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-emerald-100 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
            <button 
              onClick={prevStep}
              className={cn(
                "px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3",
                currentStep === 1 ? "opacity-0 pointer-events-none" : "bg-white text-text-dark/40 border border-emerald-100 hover:bg-emerald-50"
              )}
            >
              <ChevronLeft size={18} /> Back
            </button>
            
            {currentStep === 5 ? (
              <button 
                onClick={handleSubmit}
                className="grow max-w-[400px] px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-4"
              >
                Submit for Verification
              </button>
            ) : (
              <button 
                onClick={nextStep}
                className="grow max-w-[400px] px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-4"
              >
                Continue <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
