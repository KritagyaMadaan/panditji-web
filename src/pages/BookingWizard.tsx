import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  CreditCard, 
  Smartphone, 
  Globe, 
  Wallet,
  Lock,
  Star,
  Search,
  Info
} from "lucide-react";
import { cn } from "../lib/utils.ts";

const services = [
  { id: "1", name: "Griha Pravesh Puja", price: 5100 },
  { id: "2", name: "Satyanarayan Katha", price: 3100 },
  { id: "3", name: "Maha Mrityunjaya Homa", price: 11000 },
  { id: "4", name: "Marriage Ceremony", price: 21000 },
  { id: "5", name: "Navgraha Shanti", price: 4500 },
  { id: "6", name: "Rudrabhishek Puja", price: 3500 }
];

const timeSlots = {
  morning: ["09:00 AM", "11:00 AM"],
  afternoon: ["02:00 PM", "04:00 PM"],
  evening: ["06:00 PM"]
};

export default function BookingWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(services[0].id);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [address, setAddress] = useState({
    fullAddress: "",
    landmark: "",
    city: "Delhi",
    pincode: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Mock pandit data
  const pandit = {
    name: "Pandit Rajesh Shastri",
    photo: "🧘‍♂️",
    rating: 4.95,
    reviews: 248
  };

  const currentService = services.find(s => s.id === selectedService) || services[0];
  const serviceFee = currentService.price;
  const platformFee = Math.round(serviceFee * 0.18);
  const gst = Math.round(serviceFee * 0.05);
  const total = serviceFee + platformFee + gst;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handlePay();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const handlePay = () => {
    // Mock payment processing and pass state
    navigate("/booking-confirmed", { 
      state: { 
        service: currentService.name,
        date: selectedDate,
        time: selectedTime 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {["Service & Time", "Location", "Review & Pay"].map((s, i) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all mb-2",
                  step > i + 1 ? "bg-green-500 text-white" :
                  step === i + 1 ? "bg-saffron text-white shadow-lg shadow-saffron/30 scale-110" :
                  "bg-white text-text-dark/20 border border-slate-100"
                )}>
                  {step > i + 1 ? <CheckCircle size={20} /> : i + 1}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  step === i + 1 ? "text-saffron" : "text-text-dark/40"
                )}>{s}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="h-full bg-saffron"
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[2.5rem] shadow-xl shadow-saffron/5 border border-saffron/5 p-8 md:p-12"
          >
            {step === 1 && (
              <div className="space-y-10">
                {/* Pandit Mini Card */}
                <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border border-saffron/10">
                    {pandit.photo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-dark mb-1">{pandit.name}</h3>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-1 text-gold text-sm font-black">
                         <Star size={14} fill="currentColor" /> {pandit.rating}
                       </div>
                       <div className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase tracking-wider bg-white px-2 py-0.5 rounded-full shadow-sm">
                         <CheckCircle size={12} fill="currentColor" className="text-green-500" /> Verified
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Select Ceremony</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedService(s.id)}
                          className={cn(
                            "p-4 rounded-2xl border text-left transition-all",
                            selectedService === s.id ? "bg-saffron/5 border-saffron shadow-sm" : "bg-white border-slate-100 hover:border-saffron/20"
                          )}
                        >
                          <div className={cn("text-sm font-bold mb-1", selectedService === s.id ? "text-saffron" : "text-text-dark")}>{s.name}</div>
                          <div className="text-xs font-black text-text-dark/40">₹{s.price.toLocaleString()}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Preferred Date</label>
                      <div className="relative">
                        <CalendarIcon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-saffron" />
                        <input 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                          value={selectedDate}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20"
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Morning Slots</label>
                      <div className="flex gap-3">
                         {timeSlots.morning.map(t => (
                           <button 
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={cn(
                              "flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                              selectedTime === t ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/20" : "bg-slate-50 text-text-dark/40 border-transparent hover:border-saffron/20"
                            )}
                           >
                             {t}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Afternoon Slots</label>
                      <div className="flex gap-3">
                         {timeSlots.afternoon.map(t => (
                           <button 
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={cn(
                              "flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                              selectedTime === t ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/20" : "bg-slate-50 text-text-dark/40 border-transparent hover:border-saffron/20"
                            )}
                           >
                             {t}
                           </button>
                         ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Evening Slots</label>
                      <div className="flex gap-3">
                         {timeSlots.evening.map(t => (
                           <button 
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={cn(
                              "flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                              selectedTime === t ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/20" : "bg-slate-50 text-text-dark/40 border-transparent hover:border-saffron/20"
                            )}
                           >
                             {t}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Ceremony Address</label>
                   <div className="relative">
                      <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-saffron" />
                      <input 
                        type="text" 
                        placeholder="Search for address or locality..."
                        className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20"
                      />
                   </div>
                </div>

                {/* Map Placeholder */}
                <div className="h-64 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                    <MapPin size={48} strokeWidth={1} className="mb-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Map preview will appear here</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">House No / Flat / Detail</label>
                      <input 
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20"
                        value={address.fullAddress}
                        onChange={e => setAddress({...address, fullAddress: e.target.value})}
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Landmark (Optional)</label>
                      <input 
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20"
                        value={address.landmark}
                        onChange={e => setAddress({...address, landmark: e.target.value})}
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">City</label>
                      <input 
                        disabled
                        className="w-full bg-slate-100 border-none rounded-2xl py-4 px-6 font-bold text-text-dark/40 cursor-not-allowed"
                        value={address.city}
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Pincode</label>
                      <input 
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20"
                        value={address.pincode}
                        onChange={e => setAddress({...address, pincode: e.target.value})}
                      />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Special Instructions for Pandit</label>
                   <textarea className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 min-h-[100px] resize-none" placeholder="E.g. Traditional family requirements, specific rituals..." />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10">
                {/* Summary Card */}
                <div className="bg-slate-50/50 rounded-[2.5rem] p-8 md:p-10 border border-slate-100">
                   <div className="flex items-center gap-6 mb-8 pb-8 border-b border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">
                        {pandit.photo}
                      </div>
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 mb-1">Your Verified Pandit</div>
                         <h4 className="text-xl font-bold text-text-dark">{pandit.name}</h4>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-saffron" />
                            <span className="text-sm font-bold text-text-dark">{currentService.name}</span>
                         </div>
                         <div className="text-sm font-black text-text-dark">₹{serviceFee.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <CalendarIcon size={20} className="text-saffron" />
                            <span className="text-sm font-bold text-text-dark">{selectedDate || "Oct 24, 2023"}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <Clock size={20} className="text-saffron" />
                            <span className="text-sm font-bold text-text-dark">{selectedTime || "11:00 AM"}</span>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <MapPin size={20} className="text-saffron shrink-0" />
                         <span className="text-sm font-bold text-text-dark/60 leading-relaxed">
                           {address.fullAddress || "H-24, Green Park Extension"}, {address.city} - {address.pincode || "110016"}
                         </span>
                      </div>
                   </div>

                   <div className="mt-10 pt-8 border-t border-dashed border-slate-200 space-y-4">
                      <div className="flex justify-between text-xs font-bold text-text-dark/40">
                         <span>Service Fee</span>
                         <span>₹{serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-text-dark/40">
                         <span>Platform Fee (18%)</span>
                         <span>₹{platformFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-text-dark/40">
                         <span>GST (5%)</span>
                         <span>₹{gst.toLocaleString()}</span>
                      </div>
                      <div className="pt-4 flex justify-between items-center">
                         <span className="text-xl font-black text-text-dark tracking-tighter">Total Payable</span>
                         <span className="text-3xl font-black text-saffron tracking-tight">₹{total.toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-6">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Select Payment Method</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { id: "upi", name: "UPI", icon: <Smartphone /> },
                        { id: "card", name: "Card", icon: <CreditCard /> },
                        { id: "net", name: "Net Banking", icon: <Globe /> },
                        { id: "wallet", name: "Wallet", icon: <Wallet /> },
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={cn(
                            "flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all",
                            paymentMethod === m.id ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/20" : "bg-slate-50 text-text-dark/40 border-transparent hover:border-saffron/20"
                          )}
                        >
                          <div className={cn("p-2 rounded-xl", paymentMethod === m.id ? "bg-white/20" : "bg-white shadow-sm")}>
                            {m.icon}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">{m.name}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                   <button 
                    onClick={handlePay}
                    className="w-full py-6 bg-saffron text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-saffron/40 hover:bg-text-dark transition-all duration-500"
                   >
                     Pay ₹{total.toLocaleString()} Securely
                   </button>
                   <div className="flex flex-col items-center gap-4">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Razorpay_logo.svg" alt="Razorpay" className="h-4 opacity-30" />
                      <div className="flex items-center gap-2 text-text-dark/30 text-[10px] font-black uppercase tracking-widest">
                         <Lock size={12} className="text-green-500" />
                         100% Secure SSL encrypted payment
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="mt-12 flex items-center justify-between pt-10 border-t border-slate-50">
               <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-dark/40 hover:text-saffron transition-colors"
               >
                 <ChevronLeft size={16} />
                 {step === 1 ? "Cancel Booking" : "Previous Step"}
               </button>
               {step < 3 && (
                 <button 
                  onClick={handleNext}
                  className="flex items-center gap-4 bg-text-dark text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-saffron transition-all shadow-xl shadow-text-dark/10"
                 >
                   Continue 
                   <ChevronRight size={16} />
                 </button>
               )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Support Section */}
        <div className="mt-12 flex items-start gap-4 p-8 bg-gold/5 rounded-3xl border border-gold/10">
           <Info size={24} className="text-gold shrink-0" />
           <div>
              <h4 className="text-sm font-bold text-text-dark mb-1">Need help with booking?</h4>
              <p className="text-xs text-text-dark/50 font-medium leading-relaxed">Our support team is available 24/7 to assist you. Call us at +91-98711XXXXX if you face any issues.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
