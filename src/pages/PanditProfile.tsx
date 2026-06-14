import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  MapPin, 
  CheckCircle, 
  Languages, 
  Clock, 
  Calendar as CalendarIcon,
  MessageCircle,
  Users,
  Award,
  Zap,
  ChevronRight,
  Info,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import { cn } from "../lib/utils.ts";

// Mock data generator for the profile
const getPanditData = (id: string) => ({
  id: parseInt(id),
  name: "Pandit Rajesh Shastri",
  photo: "🧘‍♂️",
  city: "Delhi NCR",
  rating: 4.95,
  reviewsCount: 248,
  experience: 18,
  specializations: ["Griha Pravesh", "Havan", "Vastu Shastra", "Marriage Puja", "Rudrabhishek"],
  languages: ["Hindi", "Sanskrit", "English"],
  bio: "Pandit Rajesh Shastri is a gold medalist from Sampurnanand Sanskrit Vishwavidyalaya, Varanasi. With over 18 years of experience, he specializes in authentic Vedic rituals and Vastu Shastra. He has performed over 2,000 ceremonies across India, ensuring every mantra is chanted with precision and devotion.",
  stats: {
    totalBookings: "2,400+",
    avgRating: "4.95",
    expYears: "18+",
    responseTime: "< 30 mins"
  },
  services: [
    { id: 1, name: "Griha Pravesh Puja", duration: "3 hrs", price: 5100 },
    { id: 2, name: "Satyanarayan Katha", duration: "2 hrs", price: 3100 },
    { id: 3, name: "Maha Mrityunjaya Homa", duration: "4 hrs", price: 11000 },
    { id: 4, name: "Marriage Ceremony", duration: "6 hrs", price: 21000 },
    { id: 5, name: "Navgraha Shanti", duration: "3 hrs", price: 4500 },
    { id: 6, name: "Rudrabhishek Puja", duration: "2.5 hrs", price: 3500 }
  ],
  reviews: [
    {
      id: 1,
      author: "Aditya Sharma",
      date: "Oct 12, 2023",
      rating: 5,
      comment: "Very punctual and explained the meaning of every ritual. My parents were very happy with the Griha Pravesh ceremony.",
      reply: "Thank you Aditya. It was a pleasure performing the puja at your beautiful new home."
    },
    {
      id: 2,
      author: "Priya Mehra",
      date: "Sep 28, 2023",
      rating: 5,
      comment: "Knowledgeable and patient. Highly recommended for any Vedic rituals.",
      reply: "Blessings to you and your family, Priya ji."
    }
  ]
});

const timeSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

export default function PanditProfile() {
  const { id } = useParams<{ id: string }>();
  const [pandit, setPandit] = useState(getPanditData(id || "1"));
  const [selectedDate, setSelectedDate] = useState<number | null>(14); // Mock date
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const ratingDist = [
    { stars: 5, percent: 60 },
    { stars: 4, percent: 25 },
    { stars: 3, percent: 10 },
    { stars: 2, percent: 3 },
    { stars: 1, percent: 2 },
  ];

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      {/* Profile Header Canvas */}
      <section className="relative">
        <div className="h-64 md:h-80 w-full bg-gradient-to-br from-saffron to-gold relative overflow-hidden">
          {/* Mandala Pattern SVG Background */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
             <svg viewBox="0 0 200 200" className="w-[800px] h-[800px] text-white fill-current animate-spin-slow">
                <path d="M100 0 A100 100 0 0 1 100 200 A100 100 0 0 1 100 0 M100 20 L120 80 L180 100 L120 120 L100 180 L80 120 L20 100 L80 80 Z" />
                <circle cx="100" cy="100" r="10" />
             </svg>
          </div>
          <Link to="/find-pandit" className="absolute top-8 left-8 md:left-12 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-2xl text-white transition-all flex items-center gap-2 font-bold text-sm">
            <ChevronLeft size={20} />
            Back to Search
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-12 relative -mt-20 z-10">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-saffron/5 border border-saffron/5 p-8 md:p-12 mb-12">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-2 shadow-2xl border-4 border-white mb-2 overflow-hidden flex items-center justify-center text-6xl shadow-saffron/10">
                   <div className="w-full h-full bg-saffron/10 rounded-full flex items-center justify-center">
                     {pandit.photo}
                   </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white">
                  <ShieldCheck size={20} />
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <h1 className="text-4xl md:text-5xl font-black text-text-dark tracking-tighter">{pandit.name}</h1>
                    <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                      <CheckCircle size={14} fill="currentColor" className="text-white" />
                      KYC & Aadhaar Verified
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-text-dark/40 font-bold">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-saffron" />
                      {pandit.city}
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron/30"></div>
                    <div className="flex items-center gap-1.5 text-gold">
                      <Star size={18} fill="currentColor" />
                      <span className="text-lg font-black">{pandit.rating}</span>
                      <span className="text-sm font-medium opacity-60">({pandit.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center bg-orange-50 text-saffron px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border border-saffron/10 shadow-sm">
                    <Award size={14} className="mr-2" />
                    {pandit.experience}+ Years of Sadhana
                  </div>
                  {pandit.specializations.map(spec => (
                    <span key={spec} className="px-4 py-2 bg-slate-50 text-text-dark/60 text-[11px] font-black uppercase tracking-widest rounded-full border border-slate-100">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-12 text-sm">
                   <div className="flex items-center gap-3">
                      <Languages size={18} className="text-saffron" />
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-black uppercase text-text-dark/30 tracking-widest">Languages</div>
                        <div className="font-bold text-text-dark">{pandit.languages.join(", ")}</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Zap size={18} className="text-saffron" />
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-black uppercase text-text-dark/30 tracking-widest">Response</div>
                        <div className="font-bold text-text-dark">{pandit.stats.responseTime}</div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex md:flex-col gap-4 sticky bottom-4 md:static z-20">
                <button className="flex-1 md:w-64 py-5 rounded-[1.5rem] border-2 border-saffron/20 text-saffron font-black text-xs uppercase tracking-[0.2em] hover:bg-saffron/5 transition-all bg-white/95 backdrop-blur shadow-xl shadow-saffron/5">
                   <div className="flex items-center justify-center gap-2">
                     <MessageCircle size={18} />
                     Chat Now
                   </div>
                </button>
                <Link to="/book" className="flex-[1.5] md:w-64 py-5 rounded-[1.5rem] bg-saffron text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-text-dark transition-all shadow-2xl shadow-saffron/30 flex items-center justify-center">
                   Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-16">
          {/* About Section */}
          <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-sm border border-saffron/5">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron">
                 <Info size={24} />
               </div>
               <h2 className="text-3xl font-black text-text-dark">About Pandit Ji</h2>
             </div>
             
             <div className="prose prose-slate max-w-none text-text-dark/60 text-lg leading-relaxed mb-12">
               <p>{pandit.bio}</p>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Total Bookings", val: pandit.stats.totalBookings, icon: <Users size={20} /> },
                  { label: "Avg Rating", val: pandit.stats.avgRating, icon: <Star size={20} /> },
                  { label: "Experience", val: pandit.stats.expYears, icon: <Award size={20} /> },
                  { label: "Response", val: pandit.stats.responseTime, icon: <Zap size={20} /> },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                    <div className="text-saffron mb-3">{s.icon}</div>
                    <div className="text-xl font-black text-text-dark mb-1">{s.val}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">{s.label}</div>
                  </div>
                ))}
             </div>
          </section>

          {/* Services Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-text-dark">Services Offered</h2>
              <span className="text-sm font-bold text-saffron bg-saffron/5 px-4 py-1 rounded-full">{pandit.services.length} Rituals</span>
            </div>
            <div className="space-y-4">
               {pandit.services.map((service) => (
                 <div key={service.id} className="group bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-saffron/5 hover:border-saffron/20 transition-all flex flex-wrap items-center justify-between gap-6">
                    <div className="flex-1 min-w-[200px]">
                      <h4 className="text-xl font-bold text-text-dark mb-2 group-hover:text-saffron transition-colors">{service.name}</h4>
                      <div className="flex items-center gap-4 text-xs font-bold text-text-dark/40">
                         <div className="flex items-center gap-1.5"><Clock size={14} className="text-saffron/60" /> {service.duration}</div>
                         <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                         <div className="text-green-600">Material Included</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div className="text-2xl font-black text-text-dark">₹{service.price.toLocaleString()}</div>
                       <Link to="/book" className="bg-text-dark text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-saffron transition-all shadow-xl shadow-text-dark/10">
                         Book
                       </Link>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* Availability Calendar */}
          <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-sm border border-saffron/5">
             <div className="flex items-center justify-between mb-10">
               <h2 className="text-3xl font-black text-text-dark">Availability</h2>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-dark/40">
                    <div className="w-3 h-3 rounded bg-green-500"></div> Available
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-dark/40">
                    <div className="w-3 h-3 rounded bg-slate-100"></div> Booked
                  </div>
               </div>
             </div>

             <div className="grid grid-cols-7 gap-3 mb-10">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                  <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-text-dark/30 mb-2">{d}</div>
                ))}
                {days.map(day => {
                  const isAvailable = day % 3 !== 0;
                  const isSelected = selectedDate === day;
                  return (
                    <button
                      key={day}
                      disabled={!isAvailable}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "h-14 rounded-2xl font-bold transition-all flex flex-col items-center justify-center border",
                        !isAvailable ? "bg-slate-50 text-text-dark/20 cursor-not-allowed border-transparent" :
                        isSelected ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/20" :
                        "bg-green-50 text-green-700 hover:border-green-300 border-green-100"
                      )}
                    >
                      <span className="text-lg">{day}</span>
                    </button>
                  );
                })}
             </div>

             <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-text-dark/40 italic">Available Time Slots for Oct {selectedDate}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {timeSlots.map(slot => (
                     <button
                       key={slot}
                       onClick={() => setSelectedTime(slot)}
                       className={cn(
                         "py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border",
                         selectedTime === slot ? "bg-text-dark text-white border-text-dark shadow-xl" : "bg-slate-50 text-text-dark/60 border-slate-100 hover:border-saffron/20"
                       )}
                     >
                       {slot}
                     </button>
                   ))}
                </div>
             </div>
          </section>

          {/* Reviews Section */}
          <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-sm border border-saffron/5">
             <h2 className="text-3xl font-black text-text-dark mb-10">Guest Reviews</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-center">
                <div className="md:col-span-4 text-center space-y-2">
                   <div className="text-7xl font-black text-text-dark">4.95</div>
                   <div className="flex justify-center text-gold gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
                   </div>
                   <div className="text-xs font-black uppercase tracking-widest text-text-dark/30">Based on 248 reviews</div>
                </div>
                <div className="md:col-span-8 space-y-3">
                   {ratingDist.map(r => (
                     <div key={r.stars} className="flex items-center gap-4">
                        <div className="text-[10px] font-black w-4">{r.stars}★</div>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: `${r.percent}%` }}
                             className="h-full bg-saffron"
                           />
                        </div>
                        <div className="text-[10px] font-bold text-text-dark/40 w-10 text-right">{r.percent}%</div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="space-y-10">
                {pandit.reviews.map(review => (
                  <div key={review.id} className="space-y-6">
                    <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-lg font-black text-text-dark">{review.author}</div>
                          <div className="text-xs font-bold text-text-dark/30">{review.date}</div>
                        </div>
                        <div className="flex text-gold">
                           {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-text-dark/60 leading-relaxed font-medium">{review.comment}</p>
                    </div>
                    <div className="ml-12 border-l-4 border-saffron/20 pl-8 space-y-3">
                       <div className="text-[10px] font-black uppercase tracking-widest text-saffron">Pandit Ji's Reply</div>
                       <p className="text-text-dark/70 text-sm font-medium italic">"{review.reply}"</p>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Sticky Booking Sidebar */}
        <aside className="lg:col-span-4 sticky top-24 space-y-8 hidden lg:block">
           <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-saffron/10 border border-saffron/5 p-10">
              <h3 className="text-2xl font-black text-text-dark mb-8">Secure Booking</h3>
              
              <div className="space-y-6 mb-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Choose Service</label>
                    <select 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 cursor-pointer"
                    >
                      <option value="">Select a ceremony</option>
                      {pandit.services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Ritual Date</label>
                    <div className="relative">
                       <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-saffron" size={20} />
                       <input type="text" readOnly value={selectedDate ? `Oct ${selectedDate}, 2023` : "Pick from calendar"} className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 font-bold text-text-dark focus:ring-0 cursor-default" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Preferred Time</label>
                    <div className="grid grid-cols-2 gap-3">
                       {timeSlots.slice(0, 2).map(slot => (
                         <button 
                           key={slot}
                           onClick={() => setSelectedTime(slot)} 
                           className={cn("py-3 rounded-xl font-bold text-xs border transition-all", selectedTime === slot ? "bg-saffron text-white border-saffron" : "bg-white text-text-dark/60 border-slate-100 hover:border-saffron/20")}
                         >
                           {slot.split(" ")[0]}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">Puja Location (Address)</label>
                    <div className="relative">
                       <MapPin className="absolute left-6 top-12 -translate-y-1/2 text-saffron" size={20} />
                       <textarea placeholder="Enter full venue address..." className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 min-h-[100px] resize-none" />
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-dashed border-saffron/20 space-y-4 mb-10">
                 <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-text-dark/40">Dakshina</span>
                    <span className="text-text-dark">₹{selectedService ? (pandit.services.find(s => s.id === parseInt(selectedService))?.price.toLocaleString()) : "0"}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-text-dark/40">Materials & Samagri</span>
                    <span className="text-green-600">Included</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-text-dark/40">Convenience Fee</span>
                    <span className="text-text-dark">₹99</span>
                 </div>
                 <div className="h-px bg-slate-50 my-4"></div>
                 <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-text-dark tracking-tight">Total Amount</span>
                    <span className="text-2xl font-black text-saffron">₹{selectedService ? (pandit.services.find(s => s.id === parseInt(selectedService))?.price || 0) + 99 : 99}</span>
                 </div>
              </div>

              <Link to="/book" className="w-full py-5 bg-saffron text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-saffron/40 hover:bg-text-dark transition-all duration-500 flex items-center justify-center">
                Confirm Booking
              </Link>
              
              <div className="mt-8 flex items-center justify-center gap-2 text-text-dark/30 text-[10px] font-black uppercase tracking-widest">
                 <ShieldCheck size={14} className="text-green-500" />
                 Secure Payments by Razorpay
              </div>
           </div>

           <div className="bg-text-dark text-white p-8 rounded-[2rem] shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 bg-saffron/20 rounded-full flex items-center justify-center text-saffron">
                    <ShieldCheck size={20} />
                 </div>
                 <h4 className="text-lg font-bold">Booking Guarantee</h4>
              </div>
              <ul className="space-y-4 text-xs font-bold text-white/50">
                 <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron mt-1 shadow-glow shadow-saffron"></div>
                    Full refund for cancellations up to 24 hrs before.
                 </li>
                 <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron mt-1 shadow-glow shadow-saffron"></div>
                    Verified pandit or 100% money back.
                 </li>
              </ul>
           </div>
        </aside>
      </main>
    </div>
  );
}

// Add CSS animation to index.css if not there for spin-slow
