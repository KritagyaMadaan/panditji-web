import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Check, 
  X, 
  Zap, 
  ShieldCheck, 
  Star, 
  TrendingUp, 
  ArrowRight,
  Headphones,
  Award,
  Crown
} from "lucide-react";
import { cn } from "../lib/utils.ts";

const plans = [
  {
    name: "Free",
    price: "0",
    desc: "For part-time acharyas getting started.",
    features: ["3 bookings/month", "Basic listing", "Standard support"],
    isCurrent: true,
    color: "bg-slate-100",
    textColor: "text-text-dark/40"
  },
  {
    name: "Pro",
    price: "999",
    desc: "Most chosen by full-time verified pandits.",
    features: ["Unlimited bookings", "Verified Badge", "Priority Listing", "WhatsApp Support"],
    popular: true,
    color: "bg-emerald-600",
    textColor: "text-white"
  },
  {
    name: "Premium",
    price: "2,999",
    desc: "Scale your spiritual influence nationally.",
    features: ["Featured on Homepage", "Dedicated Manager", "Everything in Pro", "Social Media Spotlight"],
    color: "bg-emerald-950",
    textColor: "text-white"
  }
];

const comparisonData = [
  { feature: "Verified Badge", free: false, pro: true, premium: true },
  { feature: "Priority Listing", free: false, pro: true, premium: true },
  { feature: "Featured on Homepage", free: false, pro: false, premium: true },
  { feature: "Dedicated Support", free: false, pro: "WhatsApp", premium: "Priority Call" },
  { feature: "Booking Limit", free: "3 / Month", pro: "Unlimited", premium: "Unlimited" },
  { feature: "Service Fee", free: "20%", pro: "12%", premium: "8%" },
];

export default function PanditPlans() {
  const [avgBookingValue, setAvgBookingValue] = useState(3000);

  const roiResult = useMemo(() => {
    // Assuming +5 bookings/month for Pro
    return avgBookingValue * 5;
  }, [avgBookingValue]);

  return (
    <div className="min-h-screen bg-[#F8FAF9] pb-32">
      {/* Header */}
      <section className="pt-32 pb-24 px-4 bg-white border-b border-emerald-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
            <TrendingUp size={14} /> Partnership Growth
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-text-dark tracking-tighter mb-8 italic">Choose Your <span className="text-emerald-600">Plan</span></h1>
          <p className="text-xl text-text-dark/40 font-medium max-w-xl mx-auto leading-relaxed">
            Select a plan that matches your spiritual journey and unlock thousands of daily devotees.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 lg:px-12 -mt-16 relative z-10">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 items-stretch">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -10 }}
              className={cn(
                "rounded-[3.5rem] p-12 relative flex flex-col transition-all duration-500 overflow-hidden",
                plan.popular 
                  ? "bg-white border-4 border-saffron shadow-[0_50px_100px_-20px_rgba(255,119,0,0.15)] scale-105 z-20" 
                  : cn(plan.color, "shadow-2xl shadow-emerald-900/5")
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-saffron text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                  Most Popular
                </div>
              )}
              
              <div className="mb-12">
                <div className={cn("text-[10px] font-black uppercase tracking-[0.3em] mb-4", plan.popular ? "text-saffron" : plan.textColor)}>
                  {plan.name} Membership
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-6xl font-black italic tracking-tighter", plan.popular ? "text-text-dark" : plan.textColor)}>₹{plan.price}</span>
                  <span className={cn("text-xs font-bold", plan.popular ? "text-text-dark/30" : "opacity-40")}>/month</span>
                </div>
                <p className={cn("text-sm font-medium mt-6 leading-relaxed", plan.popular ? "text-text-dark/40" : "opacity-60")}>
                  {plan.desc}
                </p>
              </div>

              <div className="space-y-6 mb-12 flex-grow">
                {plan.features.map(f => (
                  <div key={f} className={cn("flex items-center gap-4 text-sm font-bold", plan.popular ? "text-text-dark/60" : "opacity-80")}>
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 border", plan.popular ? "bg-emerald-100 border-emerald-200 text-emerald-600" : "bg-white/10 border-white/10")}>
                      <Check size={14} />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <button 
                disabled={plan.isCurrent}
                className={cn(
                  "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all",
                  plan.isCurrent 
                    ? "bg-slate-200 text-text-dark/30 cursor-not-allowed" 
                    : plan.popular
                      ? "bg-saffron text-white shadow-xl shadow-saffron/20 hover:bg-text-dark"
                      : "bg-white text-emerald-900 shadow-xl hover:bg-emerald-50"
                )}
              >
                {plan.isCurrent ? "Current Plan" : `Choose ${plan.name}`}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-4 flex items-center justify-center gap-4">
               <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <Award size={20} />
               </div>
               Plan Comparison
            </h2>
            <p className="text-text-dark/40 font-medium">Detailed breakdown of partner benefits.</p>
          </div>

          <div className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl shadow-emerald-900/5 border border-emerald-100">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="p-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-dark/30 border-r border-emerald-50">Features</th>
                     <th className="p-10 text-[10px] font-black uppercase tracking-[0.3em] text-text-dark/30 text-center border-r border-emerald-50">Free</th>
                     <th className="p-10 text-[10px] font-black uppercase tracking-[0.3em] text-saffron text-center border-r border-emerald-50">Pro</th>
                     <th className="p-10 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950 text-center">Premium</th>
                  </tr>
               </thead>
               <tbody className="text-sm font-bold">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="border-t border-emerald-50">
                       <td className="p-10 text-text-dark border-r border-emerald-50">{row.feature}</td>
                       <td className="p-10 text-center border-r border-emerald-50 text-text-dark/40">
                          {typeof row.free === 'boolean' ? (row.free ? <Check className="mx-auto text-emerald-600" /> : <X className="mx-auto opacity-20" />) : row.free}
                       </td>
                       <td className="p-10 text-center border-r border-emerald-50 bg-saffron/[0.02]">
                          {typeof row.pro === 'boolean' ? (row.pro ? <Check className="mx-auto text-saffron" /> : <X className="mx-auto opacity-20" />) : row.pro}
                       </td>
                       <td className="p-10 text-center text-emerald-900">
                          {typeof row.premium === 'boolean' ? (row.premium ? <Check className="mx-auto text-emerald-900" /> : <X className="mx-auto opacity-20" />) : row.premium}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="bg-emerald-600 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-bl-full pointer-events-none -mr-32 -mt-32 backdrop-blur-3xl"></div>
           
           <div className="relative z-10">
              <div className="max-w-3xl mx-auto text-center mb-16">
                 <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                    <Zap size={14} className="text-saffron animate-pulse" /> Business Growth Calculator
                 </div>
                 <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter mb-8 leading-tight">
                    See How Much More <br /> You Could <span className="text-emerald-950">Earn</span>
                 </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-5xl mx-auto">
                 <div className="lg:col-span-5 space-y-8">
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-6 px-2 text-center">Average Booking Value (₹)</label>
                       <div className="relative">
                          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white/30 font-black text-2xl group-focus-within:text-saffron transition-colors">₹</div>
                          <input 
                            type="number" 
                            className="w-full bg-white/10 border-2 border-white/10 rounded-3xl py-6 pl-16 pr-8 font-black text-3xl focus:border-saffron focus:bg-white/20 transition-all outline-none text-center"
                            value={avgBookingValue}
                            onChange={(e) => setAvgBookingValue(parseInt(e.target.value) || 0)}
                          />
                       </div>
                    </div>
                    <p className="text-white/40 text-[10px] font-bold text-center italic">Calculated assuming conservative +5 bookings/month increase with Priority Listing.</p>
                 </div>

                 <div className="lg:col-span-2 flex justify-center">
                    <ArrowRight size={48} className="text-white/20 rotate-90 lg:rotate-0" />
                 </div>

                 <div className="lg:col-span-5">
                    <div className="bg-white rounded-[3.5rem] p-12 text-emerald-900 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                       <div className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dark/30 mb-4">Estimated Monthly Gain</div>
                       <div className="text-5xl lg:text-7xl font-black italic tracking-tighter text-saffron mb-6">
                          ₹{roiResult.toLocaleString()}
                       </div>
                       <div className="pt-8 border-t border-emerald-50 w-full">
                          <p className="text-sm font-bold text-text-dark/40 mb-8 max-w-[200px] mx-auto">Increase your monthly income by investing in Pro today.</p>
                          <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all">
                             Upgrade to Pro Now
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Support CTA */}
        <section className="mt-32 text-center py-20 bg-slate-50 rounded-[3.5rem] border border-dashed border-emerald-100">
           <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-8 shadow-xl border border-emerald-50">
              <Headphones size={32} />
           </div>
           <h3 className="text-2xl font-black mb-4">Need help choosing?</h3>
           <p className="text-text-dark/40 font-medium mb-10">Our partner success team is available 24/7 for you.</p>
           <button className="px-10 py-4 bg-white text-emerald-600 border border-emerald-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
              Talk to Success Manager
           </button>
        </section>
      </main>
    </div>
  );
}
