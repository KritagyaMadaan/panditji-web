import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Clock, 
  Bell, 
  Timer,
  Calendar,
  Check,
  Star,
  DollarSign,
  TrendingUp,
  Zap,
  Navigation,
  LogOut,
  User as UserIcon,
  PlayCircle,
  ShieldCheck
} from "lucide-react";
import { cn } from "../lib/utils.ts";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase.ts";
import { doc, updateDoc } from "firebase/firestore";
import { X, Save, Edit2, CheckCircle2 } from "lucide-react";

const EXPERTISE_OPTIONS = [
  "Griha Pravesh", "Vivah Sanskar", "Satyanarayan Puja", 
  "Mundan", "Rudrabhishek", "Antyesti Kriya", 
  "Vastu Shanti", "Navgrah Shanti", "Havan"
];

const LANGUAGE_OPTIONS = ["Sanskrit", "Hindi", "English", "Marathi", "Bengali", "Tamil", "Punjabi"];

interface Request {
  id: string;
  service: string;
  customer: string;
  time: string;
  expiresIn: number; // seconds
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  price: number;
}

const initialRequests: Request[] = [];

const initialSchedule: any[] = [];

type BookingStatus = 'assigned' | 'en_route' | 'arrived' | 'started' | 'completed';

export default function PanditDashboard({ user }: { user: any }) {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [activeBookingStatus, setActiveBookingStatus] = useState<BookingStatus>('en_route');
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    city: "",
    experience: 5,
    expertise: [] as string[],
    languages: [] as string[],
    bio: "",
    basePrice: 2100,
    travelRadius: 25,
    outstationTravel: false,
    aadhaarNumber: ""
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        city: user.city || "",
        experience: user.experience || 5,
        expertise: user.expertise || [],
        languages: user.languages || [],
        bio: user.bio || "",
        basePrice: user.basePrice || 2100,
        travelRadius: user.travelRadius || 25,
        outstationTravel: !!user.outstationTravel,
        aadhaarNumber: user.aadhaarNumber || ""
      });
    }
  }, [user, isProfileOpen]);
  
  // Countdown Timer for Requests
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests(prev => prev.map(req => {
        if (req.status === 'pending' && req.expiresIn > 0) {
          return { ...req, expiresIn: req.expiresIn - 1 };
        }
        if (req.status === 'pending' && req.expiresIn <= 0) {
          return { ...req, status: 'expired' };
        }
        return req;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequest = (id: string, action: 'accepted' | 'declined') => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-8 h-16 max-w-[1440px] mx-auto bg-white sacred-shadow border-b border-outline-variant/30">
        <div className="font-decorative text-xl font-bold text-primary flex items-center gap-2">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">ॐ</div>
           <span className="hidden sm:inline">BookPanditJi</span>
        </div>
        <div className="hidden md:flex flex-1 justify-center px-8">
           <h1 className="font-decorative text-xl text-on-surface font-bold tracking-tight">Namaste, Pandit Ji 🙏</h1>
        </div>
        <div className="flex items-center gap-4">
           <button className="p-2 rounded-full hover:bg-surface-container transition-colors relative text-on-surface-variant">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
           </button>
           <div 
              onClick={() => setIsProfileOpen(true)}
              className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold border-2 border-outline-variant cursor-pointer group hover:border-primary transition-all"
            >
               <UserIcon size={20} className="group-hover:scale-110 transition-transform" />
            </div>
        </div>
      </nav>

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col fixed top-16 left-0 bottom-0 py-8 border-r border-outline-variant/30 w-64 space-y-2 bg-surface-container-low overflow-y-auto z-30">
           <div className="px-6 mb-8">
              <div 
                 onClick={() => setIsProfileOpen(true)}
                 className="flex items-center gap-4 mb-6 cursor-pointer group hover:opacity-85 transition-all"
               >
                 <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold border-2 border-white shadow-md group-hover:scale-105 transition-all">
                    Pt
                 </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                       <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{user?.name || "Pandit Ji"}</span>
                       <ShieldCheck size={14} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-1 text-secondary">
                       <Star size={12} fill="currentColor" />
                       <span className="text-[10px] font-black tracking-widest opacity-80">4.9 (124)</span>
                    </div>
                  </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-outline-variant/30 shadow-sm">
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Duty Status</span>
                 <button 
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={cn(
                       "w-10 h-6 rounded-full relative transition-all duration-300",
                       isAvailable ? "bg-primary-container" : "bg-outline-variant/40"
                    )}
                 >
                    <div className={cn(
                       "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                       isAvailable ? "left-5" : "left-1"
                    )} />
                 </button>
              </div>
           </div>

           <nav className="flex-1 space-y-1 px-4">
              <button className="w-full flex items-center gap-4 py-3 px-6 bg-secondary-container text-on-secondary-container rounded-full font-bold shadow-md transition-transform active:scale-95">
                 <Calendar size={18} />
                 <span className="text-xs font-black uppercase tracking-widest">Today's Path</span>
              </button>
              <button className="w-full flex items-center gap-4 py-3 px-6 text-on-surface-variant hover:bg-surface-container-highest/20 rounded-full transition-all">
                 <Clock size={18} />
                 <span className="text-xs font-black uppercase tracking-widest">All Bookings</span>
              </button>
              <button className="w-full flex items-center gap-4 py-3 px-6 text-on-surface-variant hover:bg-surface-container-highest/20 rounded-full transition-all">
                 <DollarSign size={18} />
                 <span className="text-xs font-black uppercase tracking-widest">Earnings</span>
              </button>
              <button 
                 onClick={() => setIsProfileOpen(true)}
                 className="w-full flex items-center gap-4 py-3 px-6 text-on-surface-variant hover:bg-surface-container-highest/20 rounded-full transition-all text-left"
               >
                 <UserIcon size={18} />
                 <span className="text-xs font-black uppercase tracking-widest">Profile</span>
              </button>
           </nav>

           <div className="p-4 border-t border-outline-variant/30">
              <button 
                 onClick={async () => {
                    await signOut(auth);
                    navigate("/");
                 }}
                 className="flex items-center gap-4 py-3 px-6 text-red-500 hover:bg-red-50 rounded-full w-full transition-colors group"
              >
                 <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                 <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
              </button>
           </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-6 md:p-10 mandala-pattern overflow-y-auto">
           <div className="max-w-6xl mx-auto space-y-10">
              
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                 {[
                    { label: "Today's Rituals", val: "04", color: "border-primary" },
                    { label: "Monthly Karma", val: "₹42.5k", color: "border-secondary" },
                    { label: "Soul Rating", val: "4.9", color: "border-tertiary" },
                    { label: "Punctuality", val: "98%", color: "border-green-600" }
                 ].map((stat, idx) => (
                    <motion.div 
                       key={idx}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.1 }}
                       className={cn("bg-white sacred-shadow p-6 rounded-3xl border-t-4", stat.color)}
                    >
                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/80 mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-black text-on-surface tracking-tight italic">{stat.val}</h3>
                    </motion.div>
                 ))}
              </div>

              {/* Booking Requests */}
              <section className="space-y-6">
                 <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black text-on-surface tracking-tight">New Invitations</h2>
                    <span className="px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-red-200">
                       {requests.filter(r => r.status === 'pending').length} Awaiting
                    </span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                       {requests.length === 0 ? (
                           <div className="col-span-2 text-center py-10 bg-white rounded-[2.5rem] sacred-shadow border border-outline-variant/20 p-8">
                              <p className="text-sm font-semibold text-on-surface-variant/50">No active invitations at the moment.</p>
                           </div>
                        ) : (
                           requests.map((req) => (
                          <motion.div 
                             key={req.id}
                             layout
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.95 }}
                             className={cn(
                                "bg-white p-8 rounded-[2.5rem] sacred-shadow border-l-[6px] relative overflow-hidden group",
                                req.status === 'pending' ? "border-red-500" : "border-outline-variant/30 grayscale opacity-60"
                             )}
                          >
                             <div className="flex justify-between items-start mb-8">
                                 <div>
                                    <h4 className="text-xl font-black text-on-surface tracking-tight">{req.customer}</h4>
                                    <p className="text-xs font-bold text-primary/70 mt-1 uppercase tracking-widest italic">{req.service}</p>
                                 </div>
                                <div className="text-right">
                                   <p className="text-2xl font-black text-primary italic tracking-tighter">₹{req.price}</p>
                                   <div className={cn(
                                      "flex items-center gap-1.5 justify-end mt-2 text-[10px] font-black uppercase tracking-widest",
                                      req.status === 'pending' ? "text-red-500" : "text-on-surface-variant/30"
                                   )}>
                                      <Timer size={14} className={req.status === 'pending' ? "animate-spin-slow" : ""} />
                                      {req.status === 'pending' ? formatTime(req.expiresIn) : req.status}
                                   </div>
                                </div>
                             </div>

                             {req.status === 'pending' && (
                                <div className="grid grid-cols-2 gap-4">
                                   <button 
                                      onClick={() => handleRequest(req.id, 'declined')}
                                      className="py-4 rounded-2xl border border-outline-variant/30 text-on-surface-variant font-black text-[10px] uppercase tracking-widest hover:bg-surface-container-low transition-all"
                                   >
                                      Decline
                                   </button>
                                   <button 
                                      onClick={() => handleRequest(req.id, 'accepted')}
                                      className="py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-95 transition-all"
                                   >
                                      Accept Path
                                   </button>
                                </div>
                             )}
                          </motion.div>
                       ))
                    )}
                    </AnimatePresence>
                 </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 {/* Today's Timeline */}
                 <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-black text-on-surface tracking-tight px-2">Divine Timeline</h2>
                    <div className="bg-white rounded-[3rem] sacred-shadow p-10 relative overflow-hidden">
                       {initialSchedule.length > 0 && (
                          <div className="absolute left-[54px] top-10 bottom-10 w-px bg-outline-variant/30 dashed-border"></div>
                       )}
                       <div className="space-y-12 relative z-10">
                          {initialSchedule.length === 0 ? (
                              <div className="text-center py-10">
                                 <p className="text-sm font-semibold text-on-surface-variant/50">No scheduled rituals for today.</p>
                              </div>
                           ) : (
                             initialSchedule.map((item, idx) => (
                             <div key={item.id} className="flex gap-10 group">
                                <div className="flex flex-col items-center">
                                   <div className={cn(
                                      "w-10 h-10 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white transition-all",
                                      item.status === 'active' ? "bg-primary-container text-white scale-110" : "bg-surface-container-highest text-on-surface-variant"
                                   )}>
                                      {item.status === 'active' ? <PlayCircle size={20} /> : <Clock size={20} />}
                                   </div>
                                   <p className={cn(
                                      "text-[10px] font-black uppercase tracking-widest mt-4 whitespace-nowrap",
                                      item.status === 'active' ? "text-primary" : "text-on-surface-variant/40"
                                   )}>{item.time}</p>
                                </div>
                                <div className={cn(
                                   "flex-1 p-8 rounded-4xl border transition-all cursor-pointer",
                                   item.status === 'active' ? "bg-primary/5 border-primary/20" : "bg-surface-container-low/30 border-outline-variant/20 hover:border-outline-variant/50"
                                )}>
                                   <div className="flex justify-between items-start mb-4">
                                       <div>
                                          <h4 className="text-xl font-black text-on-surface">{item.service}</h4>
                                          <p className="text-xs font-bold text-on-surface-variant/80 mt-1">{item.customer} • {item.address}</p>
                                       </div>
                                      {item.status === 'active' && (
                                         <span className="bg-primary-container text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">In Focus</span>
                                      )}
                                   </div>
                                   {item.status === 'active' && (
                                      <div className="flex flex-wrap gap-3 mt-8">
                                         <button className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                                            <Navigation size={14} /> Begin Journey
                                         </button>
                                         <button className="px-6 py-3 border border-outline-variant/30 text-on-surface-variant/60 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                                            Notify Arrival
                                         </button>
                                      </div>
                                   )}
                                </div>
                             </div>
                          ))
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Earnings Quick View */}
                 <div className="space-y-6">
                    <h2 className="text-2xl font-black text-on-surface tracking-tight">Earnings Pulse</h2>
                    <div className="bg-white rounded-4xl sacred-shadow p-8 border border-outline-variant/10">
                       <div className="text-center">
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/80 mb-4">Balance in Portal</p>
                           <h2 className="text-4xl font-black text-on-surface italic tracking-tighter">₹12,480</h2>
                          <div className="flex items-center justify-center gap-2 text-green-600 font-bold mt-4">
                             <TrendingUp size={16} />
                             <span className="text-xs">+12% this cycle</span>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30">Weekly Karma Graph</p>
                          <div className="flex items-end justify-between h-32 gap-3 pt-6">
                             {[40, 65, 90, 55, 10, 10, 10].map((h, i) => (
                                <div 
                                   key={i} 
                                   className={cn(
                                      "flex-1 rounded-t-lg transition-all relative group",
                                      i === 3 ? "bg-primary-container shadow-[0_0_15px_rgba(255,107,0,0.3)]" : "bg-outline-variant/20 hover:bg-primary-container/40"
                                   )}
                                   style={{ height: `${h}%` }}
                                >
                                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                      {['M','T','W','T','F','S','S'][i]}
                                   </span>
                                </div>
                             ))}
                          </div>
                       </div>

                       <button className="w-full py-5 bg-secondary-container text-on-secondary-container rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-secondary-container/20 hover:scale-[1.02] active:scale-95 transition-all">
                          Transfer to Sanathan Bank
                       </button>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="h-24 lg:hidden" /> {/* Spacer for mobile nav */}
        </main>
      </div>

      {/* Mobile Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-6 py-4 md:hidden bg-white/90 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-[2.5rem] border-t border-outline-variant/20">
         {[
            { icon: <PlayCircle size={24} />, label: "Home", active: true },
            { icon: <Calendar size={24} />, label: "Rituals" },
            { icon: <TrendingUp size={24} />, label: "Punya" },
            { icon: <UserIcon size={24} />, label: "Sanctuary" }
         ].map((nav, i) => (
            <button 
               key={i} 
               onClick={nav.label === "Sanctuary" ? () => setIsProfileOpen(true) : undefined}
               className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  nav.active ? "text-primary scale-110" : "text-on-surface-variant/30"
               )}
            >
               {nav.icon}
               <span className="text-[8px] font-black uppercase tracking-widest">{nav.label}</span>
            </button>
         ))}
      </nav>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-text-dark/40 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-4xl overflow-hidden shadow-2xl border border-outline-variant/20 my-8 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 md:p-8 bg-linear-to-br from-primary to-primary-container text-white flex justify-between items-center relative shrink-0">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black font-decorative tracking-tight flex items-center gap-2">
                    <UserIcon size={28} />
                    Sacred Profile Details
                  </h3>
                  <p className="text-xs opacity-90 mt-1 uppercase tracking-widest font-black">Verify and update your spiritual credentials</p>
                </div>
                <button 
                  onClick={() => setIsProfileOpen(false)} 
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center cursor-pointer hover:rotate-90"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm text-on-surface">
                {/* Personal Information */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3 pb-1 border-b border-outline-variant/30">1. Personal Identity</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={profileForm.name} 
                        onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 font-bold text-on-surface focus:outline-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Email (Read Only)</label>
                      <input 
                        type="text" 
                        value={user?.email || ""} 
                        disabled
                        className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl py-3 px-4 font-bold text-on-surface/50 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={profileForm.phone} 
                        onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 font-bold text-on-surface focus:outline-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">City</label>
                      <input 
                        type="text" 
                        value={profileForm.city} 
                        onChange={(e) => setProfileForm(p => ({ ...p, city: e.target.value }))}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 font-bold text-on-surface focus:outline-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3 pb-1 border-b border-outline-variant/30">2. Ritual Heritage & Experience</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Experience (Years)</label>
                        <input 
                          type="number" 
                          value={profileForm.experience} 
                          onChange={(e) => setProfileForm(p => ({ ...p, experience: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 font-bold text-on-surface focus:outline-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Aadhaar Number (KYC)</label>
                        <input 
                          type="text" 
                          value={profileForm.aadhaarNumber} 
                          onChange={(e) => setProfileForm(p => ({ ...p, aadhaarNumber: e.target.value }))}
                          placeholder="Enter 12-digit Aadhaar"
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 font-bold text-on-surface focus:outline-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Bio Description</label>
                      <textarea 
                        rows={3}
                        value={profileForm.bio} 
                        onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                        placeholder="Write a brief bio about your ancestral lineage and puja style..."
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 font-semibold text-on-surface focus:outline-primary resize-none"
                      />
                    </div>

                    {/* Expertise Selection */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Expertise / Specializations</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {EXPERTISE_OPTIONS.map((opt) => {
                          const isSelected = profileForm.expertise.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setProfileForm(prev => {
                                  const list = prev.expertise.includes(opt)
                                    ? prev.expertise.filter(e => e !== opt)
                                    : [...prev.expertise, opt];
                                  return { ...prev, expertise: list };
                                });
                              }}
                              className={cn(
                                "py-2 px-3 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer",
                                isSelected 
                                  ? "bg-primary/10 border-primary text-primary" 
                                  : "border-outline-variant/30 text-on-surface-variant/70 hover:bg-surface-container-low"
                              )}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Languages Selection */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Languages</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {LANGUAGE_OPTIONS.map((opt) => {
                          const isSelected = profileForm.languages.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setProfileForm(prev => {
                                  const list = prev.languages.includes(opt)
                                    ? prev.languages.filter(l => l !== opt)
                                    : [...prev.languages, opt];
                                  return { ...prev, languages: list };
                                });
                              }}
                              className={cn(
                                "py-2 px-3 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer",
                                isSelected 
                                  ? "bg-secondary-container/30 border-secondary text-secondary" 
                                  : "border-outline-variant/30 text-on-surface-variant/70 hover:bg-surface-container-low"
                              )}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business details */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3 pb-1 border-b border-outline-variant/30">3. Dakshina & Travel</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Base Price (₹)</label>
                      <input 
                        type="number" 
                        value={profileForm.basePrice} 
                        onChange={(e) => setProfileForm(p => ({ ...p, basePrice: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 font-bold text-on-surface focus:outline-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Travel Radius (km)</label>
                      <input 
                        type="number" 
                        value={profileForm.travelRadius} 
                        onChange={(e) => setProfileForm(p => ({ ...p, travelRadius: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 font-bold text-on-surface focus:outline-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Outstation Travel</label>
                      <button
                        type="button"
                        onClick={() => setProfileForm(p => ({ ...p, outstationTravel: !p.outstationTravel }))}
                        className={cn(
                          "w-full py-3 px-4 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer",
                          profileForm.outstationTravel 
                            ? "bg-green-500/10 border-green-500 text-green-700" 
                            : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low"
                        )}
                      >
                        {profileForm.outstationTravel ? "Available" : "Not Available"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-surface-container-low border-t border-outline-variant/30 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="px-6 py-3 border border-outline-variant/50 hover:bg-surface-container-highest/20 rounded-xl font-black text-xs uppercase tracking-widest text-on-surface-variant transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingProfile}
                  onClick={async () => {
                    const uid = auth.currentUser?.uid || user?.uid || user?.id;
                    if (!uid) {
                      alert("User ID not found. Please log in again.");
                      return;
                    }
                    setIsSavingProfile(true);
                    try {
                      const userRef = doc(db, "users", uid);
                      await updateDoc(userRef, {
                        name: profileForm.name,
                        phone: profileForm.phone,
                        city: profileForm.city,
                        experience: profileForm.experience,
                        bio: profileForm.bio,
                        expertise: profileForm.expertise,
                        languages: profileForm.languages,
                        basePrice: profileForm.basePrice,
                        travelRadius: profileForm.travelRadius,
                        outstationTravel: profileForm.outstationTravel,
                        aadhaarNumber: profileForm.aadhaarNumber,
                        updatedAt: new Date()
                      });

                      // Sync profile details to postgres database via backend
                      const token = await auth.currentUser?.getIdToken();
                      if (token) {
                        await fetch("/api/v1/auth/sync", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            name: profileForm.name,
                            phone: profileForm.phone,
                            role: "pandit",
                            city: profileForm.city,
                            experience: profileForm.experience,
                            bio: profileForm.bio,
                            expertise: profileForm.expertise,
                            languages: profileForm.languages,
                            aadhaarNumber: profileForm.aadhaarNumber
                          })
                        });
                      }

                      setIsProfileOpen(false);
                      window.location.reload(); // Refresh screen to sync stats/details
                    } catch (err) {
                      console.error("Failed to update profile", err);
                      alert("Error updating profile. Please try again.");
                    } finally {
                      setIsSavingProfile(false);
                    }
                  }}
                  className="px-6 py-3 bg-primary text-white hover:shadow-lg hover:shadow-primary/30 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? "Saving..." : "Save Details"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



