import React, { useState, useEffect, useRef } from "react";
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
  ShieldCheck,
  BookOpen,
  IndianRupee,
  RefreshCw,
  Camera,
  Loader2,
  UploadCloud,
  Trash2
} from "lucide-react";
import { cn } from "../lib/utils.ts";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase.ts";
import { doc, updateDoc, setDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { X, Save, Edit2, CheckCircle2 } from "lucide-react";
import { uploadAndUpdateProfile, validateImageFile, deleteImageFromStorage } from "../lib/imageUpload.ts";

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

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  pending:     { label: "Pending",     cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  confirmed:   { label: "Confirmed",   cls: "bg-blue-100 text-blue-700 border-blue-200" },
  in_progress: { label: "In Progress", cls: "bg-purple-100 text-purple-700 border-purple-200" },
  completed:   { label: "Completed",   cls: "bg-green-100 text-green-700 border-green-200" },
  cancelled:   { label: "Cancelled",   cls: "bg-red-100 text-red-600 border-red-200" },
};

export default function PanditDashboard({ user }: { user: any }) {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [activeBookingStatus, setActiveBookingStatus] = useState<BookingStatus>('en_route');
  
  // --- Invitations & Calendar states ---
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  
  const getTodayStr = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  const [selectedDateStr, setSelectedDateStr] = useState<string>(getTodayStr());

  const fetchInvitations = async () => {
    const uid = auth.currentUser?.uid || user?.uid || user?.id;
    if (!uid) return;
    setInvitationsLoading(true);
    try {
      const q = query(
        collection(db, "bookings"),
        where("panditId", "==", uid),
        where("status", "==", "pending")
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRequests(docs);
    } catch (err) {
      console.error("Error fetching invitations:", err);
    } finally {
      setInvitationsLoading(false);
    }
  };

  // --- All Bookings Modal state ---
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const fetchAllBookings = async () => {
    const uid = auth.currentUser?.uid || user?.uid || user?.id;
    if (!uid) return;
    setBookingsLoading(true);
    try {
      const q = query(
        collection(db, "bookings"),
        where("panditId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllBookings(docs);
    } catch (err) {
      // Fallback: try without orderBy (index might not exist)
      try {
        const q2 = query(
          collection(db, "bookings"),
          where("panditId", "==", uid)
        );
        const snap2 = await getDocs(q2);
        const docs2 = snap2.docs.map(d => ({ id: d.id, ...d.data() }));
        setAllBookings(docs2);
      } catch { setAllBookings([]); }
    } finally {
      setBookingsLoading(false);
    }
  };

  const openBookingsModal = () => {
    setIsBookingsOpen(true);
    fetchAllBookings();
  };

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

  // --- Image Upload State ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);

  // Sync photo URL from user prop
  useEffect(() => {
    if (user?.photoUrl) {
      setCurrentPhotoUrl(user.photoUrl);
    }
  }, [user]);

  const handleImageSelect = async (file: File) => {
    setUploadError("");
    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    const uid = auth.currentUser?.uid || user?.uid || user?.id;
    if (!uid) {
      setUploadError("Not authenticated. Please log in again.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const downloadUrl = await uploadAndUpdateProfile(
        file,
        uid,
        currentPhotoUrl || undefined,
        (percent) => setUploadProgress(percent)
      );
      setCurrentPhotoUrl(downloadUrl);
      setPhotoPreview(null); // Clear preview, use actual URL
      setUploadProgress(100);
    } catch (err: any) {
      console.error("Upload error details:", err);
      setUploadError(err.message || "Upload failed");
      setPhotoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    const uid = auth.currentUser?.uid || user?.uid || user?.id;
    if (!uid || !currentPhotoUrl) return;
    setIsUploading(true);
    try {
      await deleteImageFromStorage(currentPhotoUrl);
      await updateDoc(doc(db, "users", uid), { photoUrl: null });
      try {
        await updateDoc(doc(db, "pandits", uid), { photoUrl: null });
      } catch {}
      setCurrentPhotoUrl(null);
      setPhotoPreview(null);
    } catch (err: any) {
      console.error("Delete photo error details:", err);
      setUploadError(err.message || "Failed to delete photo");
    } finally {
      setIsUploading(false);
    }
  };

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
              className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold border-2 border-outline-variant cursor-pointer group hover:border-primary transition-all overflow-hidden"
            >
               {currentPhotoUrl ? (
                 <img src={currentPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <UserIcon size={20} className="group-hover:scale-110 transition-transform" />
               )}
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
                 <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold border-2 border-white shadow-md group-hover:scale-105 transition-all overflow-hidden">
                    {currentPhotoUrl ? (
                      <img src={currentPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : "Pt"}
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
               <button
                  onClick={openBookingsModal}
                  className="w-full flex items-center gap-4 py-3 px-6 text-on-surface-variant hover:bg-surface-container-highest/20 rounded-full transition-all text-left"
               >
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
                {/* Profile Photo Upload */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3 pb-1 border-b border-outline-variant/30">Profile Photo</h4>
                  <div className="flex items-center gap-6">
                    {/* Photo preview */}
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-full bg-surface-container-low border-2 border-outline-variant/30 overflow-hidden flex items-center justify-center text-4xl shadow-lg">
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center w-full h-full bg-primary/5">
                            <Loader2 size={28} className="text-primary animate-spin" />
                            <span className="text-[9px] font-black text-primary mt-1">{uploadProgress}%</span>
                          </div>
                        ) : photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : currentPhotoUrl ? (
                          <img src={currentPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span>🧘</span>
                        )}
                      </div>
                      {/* Camera overlay */}
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-3 border-white hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Camera size={16} />
                        </button>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageSelect(file);
                          e.target.value = ""; // Reset so same file can be re-selected
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <UploadCloud size={16} />
                        {currentPhotoUrl ? "Change Photo" : "Upload Photo"}
                      </button>

                      {currentPhotoUrl && !isUploading && (
                        <button
                          type="button"
                          onClick={handleDeletePhoto}
                          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          <Trash2 size={14} />
                          Remove Photo
                        </button>
                      )}

                      {/* Progress bar */}
                      {isUploading && (
                        <div className="w-full">
                          <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              className="h-full bg-primary rounded-full"
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p className="text-[10px] font-bold text-primary mt-1">Uploading... {uploadProgress}%</p>
                        </div>
                      )}

                      {uploadError && (
                        <p className="text-xs font-bold text-red-500">{uploadError}</p>
                      )}

                      <p className="text-[10px] text-on-surface-variant/40 font-medium">JPG, PNG or WEBP • Max 800KB</p>
                    </div>
                  </div>
                </div>

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

                      const panditRef = doc(db, "pandits", uid);
                      await setDoc(panditRef, {
                        uid,
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
                        role: "pandit",
                        onboardingCompleted: true,
                        updatedAt: new Date()
                      }, { merge: true });



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

      {/* ===== All Bookings Modal ===== */}
      <AnimatePresence>
        {isBookingsOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-3xl rounded-4xl overflow-hidden shadow-2xl border border-outline-variant/20 my-8 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 md:p-8 bg-gradient-to-br from-primary to-primary-container text-white flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black font-decorative tracking-tight flex items-center gap-3">
                    <BookOpen size={26} />
                    All Bookings
                  </h3>
                  <p className="text-xs opacity-80 mt-1 uppercase tracking-widest font-bold">Your complete booking history</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchAllBookings}
                    disabled={bookingsLoading}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                    title="Refresh"
                  >
                    <RefreshCw size={18} className={bookingsLoading ? "animate-spin" : ""} />
                  </button>
                  <button
                    onClick={() => setIsBookingsOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center hover:rotate-90"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1">
                {bookingsLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-on-surface-variant/50 uppercase tracking-widest">Loading Bookings...</p>
                  </div>
                ) : allBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="text-5xl">📋</div>
                    <h4 className="text-xl font-black text-on-surface">No Bookings Yet</h4>
                    <p className="text-sm text-on-surface-variant/50 font-medium">Your accepted bookings will appear here once customers book you.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allBookings.map((booking, idx) => {
                      const statusInfo = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
                      
                      const bookedDate = booking.scheduledDate
                        ? new Date(booking.scheduledDate + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : booking.scheduledAt?.toDate
                          ? booking.scheduledAt.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : booking.scheduledAt
                            ? new Date(booking.scheduledAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                            : "—";

                      const bookedTime = booking.scheduledTime || (booking.scheduledAt 
                        ? new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "");

                      const createdDate = booking.createdAt?.toDate
                        ? booking.createdAt.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : "—";

                      const displayAddress = typeof booking.address === "object" && booking.address
                        ? `${booking.address.houseNo || ""}, ${booking.address.fullAddress || ""}, ${booking.address.city || ""} - ${booking.address.pincode || ""}`
                        : booking.address || "";

                      const displayAmount = booking.totalAmount !== undefined
                        ? Number(booking.totalAmount).toLocaleString("en-IN")
                        : null;

                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/20 hover:border-primary/20 transition-all group text-left"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-black text-on-surface text-sm">
                                  {booking.serviceName || booking.service || "Puja Service"}
                                </h4>
                                <span className={cn(
                                  "px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                  statusInfo.cls
                                )}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-on-surface-variant/60 font-semibold">
                                {booking.customerName && (
                                  <span className="flex items-center gap-1">
                                    <UserIcon size={11} /> {booking.customerName}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar size={11} /> Ceremony: {bookedDate} {bookedTime ? `at ${bookedTime}` : ""}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={11} /> Booked on: {createdDate}
                                </span>
                                {displayAddress && (
                                  <span className="flex items-center gap-1">
                                    <MapPin size={11} /> {displayAddress}
                                  </span>
                                )}
                              </div>
                            </div>
                            {displayAmount && (
                              <div className="flex items-center gap-1 text-primary font-black text-lg shrink-0">
                                <IndianRupee size={16} />
                                {displayAmount}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 bg-surface-container-low border-t border-outline-variant/20 flex justify-between items-center shrink-0">
                <p className="text-[11px] text-on-surface-variant/40 font-bold uppercase tracking-widest">
                  {allBookings.length} booking{allBookings.length !== 1 ? "s" : ""} total
                </p>
                <button
                  onClick={() => setIsBookingsOpen(false)}
                  className="px-6 py-2.5 border border-outline-variant/40 rounded-xl font-black text-xs uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-highest/20 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



