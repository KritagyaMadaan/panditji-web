import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Award,
  CheckCircle,
  Settings,
  X,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Save,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils.ts";
import { User, Booking } from "../types.ts";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db as firestoreDb } from "../lib/firebase.ts";
import { auth } from "../lib/firebase.ts";
import { updateProfile } from "firebase/auth";

interface DashboardProps {
  user: User | null;
  bookings: Booking[];
  onUserUpdate?: (updated: Partial<User>) => void;
}

export default function Dashboard({ user, bookings, onUserUpdate }: DashboardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Local editable state
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const userName = user?.name || "Devotee";
  const userPhone = (user as any)?.phone || "Not provided";
  const userEmail = (user as any)?.email || "";
  const userRole = (user as any)?.role || "customer";
  const userCity = (user as any)?.city || "";

  const upcomingBookings = bookings.filter(b => 
    ["pending", "confirmed", "in_progress"].includes(b.status)
  );
  
  const pastBookings = bookings.filter(b => 
    ["completed", "cancelled"].includes(b.status)
  );

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-500/10 text-blue-600";
      case "in_progress": return "bg-saffron/10 text-saffron";
      case "completed": return "bg-green-500/10 text-green-600";
      case "cancelled": return "bg-red-500/10 text-red-600";
      default: return "bg-slate-500/10 text-slate-600";
    }
  };

  const openEdit = () => {
    setEditName(user?.name || "");
    setEditPhone((user as any)?.phone || "");
    setSaveSuccess(false);
    setSaveError("");
    setIsEditOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    setSaveError("");
    try {
      const uid = auth.currentUser.uid;

      // Update Firestore
      await updateDoc(doc(firestoreDb, "users", uid), {
        name: editName.trim(),
        phone: editPhone.trim() || null,
        updatedAt: serverTimestamp(),
      });

      // Update Firebase Auth display name
      await updateProfile(auth.currentUser, { displayName: editName.trim() });

      // Notify parent to refresh user state
      if (onUserUpdate) {
        onUserUpdate({ name: editName.trim(), phone: editPhone.trim() || null } as any);
      }

      setSaveSuccess(true);
      setTimeout(() => setIsEditOpen(false), 1200);
    } catch (err: any) {
      setSaveError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <header className="border-b border-saffron/10 pt-12 pb-8 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 lg:px-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-text-dark tracking-tight">Namaste, {userName}</h1>
            <p className="text-sm font-bold text-text-dark/40 mt-1">May your day be filled with spiritual peace.</p>
          </div>
          <div className="relative">
            <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-text-dark/30 hover:bg-saffron/10 hover:text-saffron transition-all border border-slate-100">
              <Bell size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-12 py-10 space-y-12">
        {/* Profile Summary Card */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-saffron/5 border border-saffron/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-saffron/5 rounded-full flex items-center justify-center text-4xl border-2 border-saffron/10 overflow-hidden shadow-inner font-bold text-saffron">
                 {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-black text-text-dark">{userName}</h2>
                <div className="flex items-center gap-2 text-text-dark/40 font-bold text-sm mt-1">
                   <CheckCircle size={14} className="text-green-500" /> {userPhone}
                </div>
                {userEmail && (
                  <div className="text-xs text-text-dark/30 font-bold mt-0.5">{userEmail}</div>
                )}
                {userCity && (
                  <div className="flex items-center gap-1 text-xs text-text-dark/30 font-bold mt-0.5">
                    <MapPin size={10} /> {userCity}
                  </div>
                )}
              </div>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={openEdit}
                className="px-6 py-3 rounded-xl bg-slate-50 text-text-dark/60 font-black text-[10px] uppercase tracking-widest hover:bg-saffron/10 hover:text-saffron transition-all border border-slate-100 flex items-center gap-2"
              >
                 <Settings size={14} /> Edit Profile
              </button>
              <button className="px-6 py-3 rounded-xl bg-saffron text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-saffron/20 hover:bg-text-dark transition-all flex items-center gap-2">
                 <Award size={14} /> {userRole === "pandit" ? "Pandit Ji" : "VIP Devotee"}
              </button>
           </div>
        </section>

        {/* Upcoming Bookings */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-text-dark">Upcoming Bookings</h3>
            <Link to="/find-pandit" className="text-xs font-black text-saffron uppercase tracking-widest hover:gap-2 transition-all flex items-center gap-1">
               Book New Ritual <ChevronRight size={14} />
            </Link>
          </div>
          
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingBookings.map((booking) => (
                <Link 
                  key={booking.id} 
                  to={`/booking/${booking.id}`}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-saffron/5 border border-saffron/5 hover:border-saffron/20 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-saffron/5 rounded-full flex items-center justify-center text-3xl shadow-inner border border-saffron/10 group-hover:scale-110 transition-transform font-bold text-saffron">
                        ॐ
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-text-dark">Booking #{booking.id}</h4>
                        <div className="text-xs font-bold text-text-dark/40">Status: {booking.status}</div>
                      </div>
                    </div>
                    <div className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                      getStatusStyles(booking.status)
                    )}>
                      {booking.status === "in_progress" && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron"></span>
                        </span>
                      )}
                      {booking.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-dashed border-saffron/10">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-saffron shadow-sm">
                          <Calendar size={14} />
                        </div>
                        <span className="text-xs font-bold text-text-dark/60">
                          {new Date(booking.scheduledAt).toLocaleDateString()}
                        </span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-saffron shadow-sm">
                          <Clock size={14} />
                        </div>
                        <span className="text-xs font-bold text-text-dark/60">
                          {new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-100">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Calendar size={32} />
               </div>
               <h4 className="text-lg font-bold text-text-dark mb-1">No Upcoming Rituals</h4>
               <p className="text-sm text-text-dark/40 mb-6">You haven't booked any ceremonies for the coming days.</p>
               <Link to="/find-pandit" className="inline-flex px-8 py-4 bg-saffron text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-saffron/20 hover:bg-text-dark transition-all">
                  Start Your Journey
               </Link>
            </div>
          )}
        </section>

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <section>
            <h3 className="text-2xl font-black text-text-dark mb-8">Past Bookings</h3>
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-saffron/5 border border-saffron/5 overflow-hidden">
               {pastBookings.map((booking, idx) => (
                 <div 
                   key={booking.id} 
                   className={cn(
                     "p-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-colors",
                     idx !== pastBookings.length - 1 ? "border-b border-slate-50" : ""
                   )}
                 >
                   <div className="flex items-center gap-6 flex-1">
                      <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-3xl border border-slate-100 shadow-inner text-slate-400">
                        ॐ
                      </div>
                      <div>
                         <h4 className="text-lg font-bold text-text-dark">Booking #{booking.id}</h4>
                         <div className="text-xs font-bold text-text-dark/40 flex items-center gap-4 mt-1">
                            <span>Service Completed</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                            <span>{new Date(booking.scheduledAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-4 w-full md:w-auto">
                      <Link 
                        to={`/review/${booking.id}`}
                        className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-saffron/20 text-saffron font-black text-[10px] uppercase tracking-widest hover:bg-saffron/5 transition-all text-center"
                      >
                         Write Review
                      </Link>
                      <Link 
                        to="/book"
                        className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-saffron text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-saffron/20 hover:bg-text-dark transition-all text-center"
                      >
                         Book Again
                      </Link>
                   </div>
                 </div>
               ))}
            </div>
          </section>
        )}
      </main>

      {/* Quick Actions Float */}
      <section className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
         <Link to="/find-pandit" className="w-14 h-14 bg-text-dark text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-saffron transition-all group scale-110">
            <Calendar size={24} className="group-hover:scale-110 transition-transform" />
            <div className="absolute right-full mr-4 bg-text-dark text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              New Booking
            </div>
         </Link>
      </section>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="fixed inset-0 bg-[#0F0F2D]/70 backdrop-blur-sm z-100"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-4xl shadow-2xl z-101 overflow-hidden"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-black text-text-dark">Edit Profile</h2>
                    <p className="text-xs text-text-dark/40 font-bold mt-1">Update your personal details</p>
                  </div>
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="w-10 h-10 rounded-full bg-saffron/10 text-saffron flex items-center justify-center hover:bg-saffron hover:text-white transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Avatar */}
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 bg-saffron/10 rounded-full flex items-center justify-center text-4xl font-black text-saffron border-2 border-saffron/20">
                    {editName.charAt(0).toUpperCase() || "?"}
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/30" size={18} />
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full bg-slate-50 rounded-xl py-4 pl-12 pr-4 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 outline-none border-none"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/30" size={18} />
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) setEditPhone(val);
                        }}
                        maxLength={10}
                        className="w-full bg-slate-50 rounded-xl py-4 pl-12 pr-4 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 outline-none border-none"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  {userEmail && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/20" size={18} />
                        <input
                          type="email"
                          value={userEmail}
                          readOnly
                          className="w-full bg-slate-100 rounded-xl py-4 pl-12 pr-4 font-bold text-text-dark/40 outline-none border-none cursor-not-allowed"
                        />
                      </div>
                      <p className="text-[9px] font-bold text-text-dark/20 uppercase tracking-widest pl-1">Email cannot be changed</p>
                    </div>
                  )}

                  {saveError && (
                    <p className="text-red-500 text-[10px] font-bold text-center">{saveError}</p>
                  )}

                  {saveSuccess ? (
                    <div className="w-full py-4 bg-green-50 text-green-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Saved Successfully!
                    </div>
                  ) : (
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving || !editName.trim()}
                      className="w-full py-5 bg-saffron text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-saffron/30 hover:bg-text-dark transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <><Loader2 size={16} className="animate-spin" /> Saving...</>
                      ) : (
                        <><Save size={16} /> Save Changes</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
