import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  Users, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  MessageSquare,
  Gift,
  HandHeart,
  Store,
  X,
  CreditCard
} from "lucide-react";
import { cn } from "../lib/utils.ts";
import { useNavigate } from "react-router-dom";

type TabType = "puja" | "sponsor" | "donate" | "astrology";

interface Puja {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Ritual {
  id: string;
  temple: string;
  cause: string;
  description: string;
}

const commonPujas: Puja[] = [
  { id: "p1", name: "Ganesh Puja", price: 2100, description: "Removes obstacles and brings auspicious beginnings." },
  { id: "p2", name: "Saraswati Puja", price: 1500, description: "For wisdom, knowledge and artistic success." },
  { id: "p3", name: "Maha Mrityunjaya", price: 5100, description: "Powerful healing ritual for longevity and health." },
  { id: "p4", name: "Navgrah Shanti", price: 3500, description: "Balances cosmic influences in your horoscope." },
  { id: "p5", name: "Durga Path", price: 2501, description: "Inner strength and protection from negativity." },
  { id: "p6", name: "Laxmi Kuber Puja", price: 4100, description: "Attracts wealth and financial stability." },
];

const sponsorRituals: Ritual[] = [
  { id: "r1", temple: "Somnath Mahadev", cause: "Daily Annadaan", description: "Sponsor meals for 100 devotees daily at the holy shrine." },
  { id: "r2", temple: "Kashi Vishwanath", cause: "Ganga Aarti", description: "Be a patron for the magnificent evening Ganga Aarti." },
  { id: "r3", temple: "Vrindavan Bankey Bihari", cause: "Phool Bangla", description: "Decorate the sanctum with exotic seasonal flowers." },
];

const astrologers = [
  { name: "Acharya Vashishtha", experience: "22", rating: "4.9", price: "499", special: "Vedic & Horary" },
  { name: "Dr. Pallavi Sharma", experience: "15", rating: "4.8", price: "750", special: "KP & Nadi" },
];

const amountChips = [101, 501, 1001];

export default function RemediesMarketplace() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("puja");
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; amount: number; title: string }>({
    isOpen: false,
    amount: 0,
    title: ""
  });
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const openPayment = (amount: number, title: string) => {
    setPaymentModal({ isOpen: true, amount, title });
    setIsSuccess(false);
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setPaymentModal({ ...paymentModal, isOpen: false });
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] pb-32">
      {/* Header */}
      <section className="pt-32 pb-20 px-4 bg-white border-b border-saffron/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
            <Store size={14} /> Divine Marketplace
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-text-dark tracking-tighter mb-8 italic">
            Spiritual <span className="text-saffron">Remedies</span> & Giving
          </h1>
          <p className="text-xl text-text-dark/40 font-medium max-w-2xl mx-auto leading-relaxed">
            Personalized rituals, temple sponsorships, and sacred contributions designed to restore harmony and earn divine merit.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-saffron/5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 overflow-x-auto gap-4 py-4 no-scrollbar">
          {(["puja", "sponsor", "donate", "astrology"] as TabType[]).map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-105" 
                    : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                )}
             >
                {tab === 'puja' && "Book Puja"}
                {tab === 'sponsor' && "Sponsor Ritual"}
                {tab === 'donate' && "Donate"}
                {tab === 'astrology' && "Consult Astrologer"}
             </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {activeTab === "puja" && (
            <motion.div
              key="puja"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {commonPujas.map((p) => (
                <div key={p.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-saffron/5 border border-saffron/5 group hover:border-amber-400 transition-all">
                   <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8 group-hover:scale-110 transition-transform">
                      <Sparkles size={24} />
                   </div>
                   <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                   <p className="text-sm text-text-dark/40 mb-8 leading-relaxed h-12 overflow-hidden">{p.description}</p>
                   <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="text-2xl font-black text-text-dark">₹{p.price}</div>
                      <button 
                        onClick={() => openPayment(p.price, p.name)}
                        className="px-6 py-3 bg-saffron text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-colors"
                      >
                        Book Now
                      </button>
                   </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "sponsor" && (
            <motion.div
              key="sponsor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {sponsorRituals.map((r) => (
                <div key={r.id} className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-saffron/10 border border-amber-100 flex flex-col md:flex-row gap-12 items-center">
                   <div className="w-full md:w-64 h-64 bg-amber-50 rounded-[2.5rem] overflow-hidden flex items-center justify-center text-amber-200">
                      <Store size={80} strokeWidth={1} />
                   </div>
                   <div className="flex-grow">
                      <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">{r.temple}</div>
                      <h3 className="text-3xl font-black italic mb-4">{r.cause}</h3>
                      <p className="text-text-dark/50 font-medium mb-10">{r.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-10">
                         {amountChips.map(amt => (
                           <button 
                             key={amt}
                             onClick={() => openPayment(amt, `Sponsor ${r.cause}`)}
                             className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-xs hover:bg-amber-500 hover:text-white transition-all"
                           >
                             ₹{amt}
                           </button>
                         ))}
                         <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-xl border border-amber-200">
                            <span className="text-[10px] font-black uppercase tracking-widest pl-2">Custom ₹</span>
                            <input 
                              type="number" 
                              placeholder="Amount" 
                              className="bg-transparent border-none outline-none w-20 font-black text-sm"
                              onChange={(e) => setCustomAmount(e.target.value)}
                            />
                            <button 
                              onClick={() => customAmount && openPayment(parseInt(customAmount), `Sponsor ${r.cause}`)}
                              className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center"
                            >
                               <ArrowRight size={14} />
                            </button>
                         </div>
                      </div>

                      <button 
                        onClick={() => openPayment(amountChips[0], `Sponsor ${r.cause}`)}
                        className="px-10 py-5 bg-saffron text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-saffron/20 hover:scale-105 transition-all"
                      >
                         Sponsor Now
                      </button>
                   </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "donate" && (
            <motion.div
              key="donate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl shadow-saffron/10 border border-amber-200 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-5">
                    <HandHeart size={200} />
                 </div>
                 
                 <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                       <Heart size={14} /> Critical Campaign
                    </div>
                    <h3 className="text-4xl font-black italic tracking-tighter mb-6">Kedarnath Temple Restoration</h3>
                    <p className="text-lg text-text-dark/40 font-medium mb-12 max-w-2xl">Restoring the ancient stone carvings and structures damaged during the floods. Every brick counts.</p>
                    
                    <div className="space-y-8 mb-16">
                       <div className="flex items-center justify-between text-sm font-black uppercase tracking-widest text-text-dark/30">
                          <span>Raised: <span className="text-text-dark">₹6,50,000</span></span>
                          <span>Goal: <span className="text-text-dark">₹10,00,000</span></span>
                       </div>
                       <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: "65%" }}
                             transition={{ duration: 2, ease: "easeOut" }}
                             className="h-full bg-gradient-to-r from-amber-400 to-saffron rounded-full"
                          />
                       </div>
                       <div className="flex items-center gap-8">
                          <div className="flex -space-x-4">
                             {[...Array(4)].map((_, i) => (
                               <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                                  <div className="w-full h-full bg-amber-50 flex items-center justify-center text-[10px] font-black text-amber-600">ॐ</div>
                               </div>
                             ))}
                          </div>
                          <div className="text-xs font-bold text-text-dark/40">
                             <span className="text-text-dark block font-black">1,402 Donors</span>
                             Joined this cause
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mb-12">
                       {amountChips.map(amt => (
                         <button 
                           key={amt}
                           onClick={() => openPayment(amt, "Temple Restoration")}
                           className="px-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-lg hover:bg-amber-500 hover:text-white transition-all"
                         >
                           ₹{amt}
                         </button>
                       ))}
                    </div>

                    <button 
                      onClick={() => openPayment(amountChips[2], "Temple Restoration")}
                      className="w-full py-6 bg-saffron text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-saffron/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                       <Gift size={18} /> Donate Monthly or Once
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === "astrology" && (
            <motion.div
              key="astrology"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto"
            >
              {astrologers.map((ast) => (
                <div key={ast.name} className="bg-white p-10 rounded-[3rem] shadow-xl border border-amber-100 text-center relative group">
                  <div className="absolute top-6 right-6 flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full text-amber-600 font-black text-[10px]">
                     <Star size={12} fill="currentColor" /> {ast.rating}
                  </div>
                  <div className="w-24 h-24 bg-amber-50 rounded-full mx-auto mb-8 flex items-center justify-center text-amber-400 border-4 border-amber-100/50">
                    <Users size={40} />
                  </div>
                  <h4 className="text-2xl font-black mb-2">{ast.name}</h4>
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">{ast.special}</p>
                  
                  <div className="flex items-center justify-center gap-8 mb-10 pt-8 border-t border-slate-50">
                    <div className="text-center">
                       <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/20 mb-1">Experience</div>
                       <div className="text-lg font-black">{ast.experience} Yrs</div>
                    </div>
                    <div className="text-center">
                       <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/20 mb-1">Starts From</div>
                       <div className="text-lg font-black text-saffron">₹{ast.price}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate("/astrology")}
                    className="w-full py-4 bg-amber-50 text-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                     <MessageSquare size={16} /> Consult Astrologer
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Razorpay Mock Modal */}
      <AnimatePresence>
         {paymentModal.isOpen && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-text-dark/60 backdrop-blur-md"
           >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative overflow-hidden"
              >
                 <button 
                    onClick={() => setPaymentModal({ ...paymentModal, isOpen: false })}
                    className="absolute top-8 right-8 text-text-dark/20 hover:text-text-dark"
                 >
                    <X size={24} />
                 </button>

                 <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-8">
                       <CreditCard size={32} />
                    </div>
                    <h4 className="text-2xl font-black italic mb-2">Secure Payment</h4>
                    <p className="text-text-dark/40 font-medium mb-12">{paymentModal.title}</p>

                    <div className="bg-slate-50 rounded-[2rem] p-8 mb-12">
                       <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/20 mb-2">Grand Total</div>
                       <div className="text-4xl font-black italic tracking-tighter text-saffron">₹{paymentModal.amount}</div>
                    </div>

                    {!isSuccess ? (
                      <button 
                        onClick={handlePay}
                        disabled={isProcessing}
                        className="w-full py-6 bg-text-dark text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-105 transition-all"
                      >
                         {isProcessing ? (
                           <motion.div 
                             animate={{ rotate: 360 }}
                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                             className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                           />
                         ) : <CheckCircle2 size={18} className="text-amber-500" />}
                         {isProcessing ? "Verifying..." : "Pay Now"}
                      </button>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-6 flex flex-col items-center"
                      >
                         <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={48} />
                         </div>
                         <h5 className="font-black text-xl text-green-600">Payment Success!</h5>
                         <p className="text-xs font-bold text-text-dark/40 mt-2">Dhan'yavāda. Reference: #{Math.floor(Math.random()*1000000)}</p>
                      </motion.div>
                    )}

                    <div className="mt-12 flex items-center justify-center gap-2 opacity-20">
                       <CheckCircle2 size={14} />
                       <span className="text-[8px] font-black uppercase tracking-[0.3em]">Razorpay Secure Partner</span>
                    </div>
                 </div>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
