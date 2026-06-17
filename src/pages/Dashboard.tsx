import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, 
  ChevronRight, 
  Calendar, 
  Clock, 
  CheckCircle,
  Settings,
  X,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Save,
  Loader2,
  Search,
  LogOut,
  Heart,
  Star,
  MessageCircle,
  Navigation,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils.ts";
import { User, Booking } from "../types.ts";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db as firestoreDb } from "../lib/firebase.ts";
import { auth } from "../lib/firebase.ts";
import { updateProfile, signOut } from "firebase/auth";

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
  const [editCity, setEditCity] = useState(user?.city || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const userName = user?.name || "Devotee";
  const userPhone = user?.phone || "Not provided";
  const userEmail = user?.email || "";
  const userRole = user?.role || "customer";
  const userCity = user?.city || "";

  const upcomingBookings = bookings.filter(b => 
    ["pending", "confirmed", "in_progress"].includes(b.status)
  );
  
  const pastBookings = bookings.filter(b => 
    ["completed", "cancelled"].includes(b.status)
  );

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-700 border-green-200";
      case "in_progress": return "bg-tertiary-container/10 text-tertiary border-tertiary/20";
      case "completed": return "bg-green-100 text-green-700 border-transparent";
      case "cancelled": return "bg-red-100 text-red-700 border-transparent";
      default: return "bg-surface-container-highest text-on-surface-variant border-transparent";
    }
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    setSaveError("");
    try {
      const uid = auth.currentUser.uid;
      await updateDoc(doc(firestoreDb, "users", uid), {
        name: editName.trim(),
        phone: editPhone.trim() || null,
        city: editCity.trim() || null,
        updatedAt: serverTimestamp(),
      });
      await updateProfile(auth.currentUser, { displayName: editName.trim() });
      if (onUserUpdate) {
        onUserUpdate({ name: editName.trim(), phone: editPhone.trim() || null, city: editCity.trim() || null } as any);
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
    <div className="min-h-screen bg-surface">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white sacred-shadow h-16 flex items-center px-4 md:px-8 max-w-[1440px] mx-auto border-b border-outline-variant/30">
        <div className="flex items-center gap-2 font-decorative text-xl font-bold text-primary">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">ॐ</div>
          <span className="hidden sm:inline">BookPanditJi</span>
        </div>
        
        <div className="flex-1 flex justify-center items-center px-4 md:px-12">
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-full max-w-md border border-outline-variant/30 group focus-within:border-primary transition-all">
            <Search className="text-on-surface-variant/40 mr-2 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-on-surface placeholder:text-on-surface-variant/50" 
              placeholder="Search rituals or Pandits..." 
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <span className="hidden lg:inline text-sm font-black text-primary tracking-tight">Hi, {userName.split(' ')[0]} 🙏</span>
          <button className="p-2 rounded-full hover:bg-surface-container transition-colors relative text-on-surface-variant">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full border border-white"></span>
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-outline-variant overflow-hidden cursor-pointer hover:border-primary transition-colors" onClick={() => setIsEditOpen(true)}>
             {user?.photoUrl || auth.currentUser?.photoURL ? (
               <img src={user?.photoUrl || auth.currentUser?.photoURL || undefined} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-primary-container flex items-center justify-center text-white font-bold select-none">
                 {userName.charAt(0)}
               </div>
             )}
          </div>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16 py-8 border-r border-outline-variant/30 w-64 space-y-2 bg-surface-container-low">
          <div className="px-6 pb-8 flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => setIsEditOpen(true)}>
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden group-hover:border-primary/20 transition-all">
                {user?.photoUrl || auth.currentUser?.photoURL ? (
                  <img src={user?.photoUrl || auth.currentUser?.photoURL || undefined} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary-container flex items-center justify-center text-3xl text-white font-bold">
                    {userName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container rounded-full p-1.5 border-2 border-white shadow-md">
                 <CheckCircle size={14} />
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-decorative text-on-surface text-lg font-bold">{userName}</h3>
              <span className="bg-secondary-container text-on-secondary-container text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mt-2 inline-block">Verified Devotee</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            <Link to="/dashboard" className="flex items-center gap-4 py-3 px-6 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95">
              <Calendar size={18} />
              <span className="text-sm font-black uppercase tracking-widest">Upcoming Booking</span>
            </Link>
            <Link to="/find-pandit" className="flex items-center gap-4 py-3 px-6 text-on-surface-variant hover:bg-surface-container-highest/20 rounded-full transition-all">
              <Heart size={18} />
              <span className="text-sm font-black tracking-widest uppercase">Saved Pandits</span>
            </Link>
            <button 
              onClick={() => setIsEditOpen(true)}
              className="w-full flex items-center gap-4 py-3 px-6 text-on-surface-variant hover:bg-surface-container-highest/20 rounded-full transition-all"
            >
              <UserIcon size={18} />
              <span className="text-sm font-black uppercase tracking-widest">My Profile</span>
            </button>
          </nav>

          <div className="p-4 border-t border-outline-variant/30">
            <button 
              onClick={() => {
                signOut(auth);
                window.location.href = "/";
              }}
              className="flex items-center gap-4 py-3 px-6 text-red-500 hover:bg-red-50 rounded-full w-full transition-colors group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-black uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-12">
          {/* Upcoming Section */}
          <section id="upcoming">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-on-surface tracking-tight">Upcoming Booking</h2>
                <p className="text-sm font-bold text-on-surface-variant/60 mt-1">May your ceremonies be auspicious and blessed.</p>
              </div>
              <Link to="/find-pandit" className="text-primary text-xs font-black uppercase tracking-[0.2em] hover:translate-x-1 transition-transform flex items-center gap-2">
                Book New <ChevronRight size={16} />
              </Link>
            </div>

            {upcomingBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {upcomingBookings.map((booking) => (
                  <motion.div 
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl sacred-shadow border-t-4 border-primary-container overflow-hidden group hover:scale-[1.02] transition-all"
                  >
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Ritual Booking</span>
                          <h4 className="text-xl font-black text-on-surface mt-1">#{String(booking.id).slice(0, 8)}</h4>
                        </div>
                        <div className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          getStatusStyles(booking.status)
                        )}>
                          {booking.status}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xl">
                          ॐ
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60">Assigned Pandit</p>
                          <p className="font-bold text-on-surface">Seeking Pandit...</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-3 text-on-surface-variant/60">
                          <Calendar size={16} className="text-primary" />
                          <span className="text-xs font-bold">{new Date(booking.scheduledAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3 text-on-surface-variant/60">
                          <Clock size={16} className="text-primary" />
                          <span className="text-xs font-bold">{new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest sacred-shadow hover:bg-primary-container transition-all flex items-center justify-center gap-2">
                          <Navigation size={14} /> Track
                        </button>
                        <button className="flex-1 border border-primary text-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                          <MessageCircle size={14} /> Chat
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-outline-variant/30 sacred-shadow">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6 text-outline-variant">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-black text-on-surface mb-2">No Upcoming Rituals</h3>
                <p className="text-sm font-bold text-on-surface-variant/60 max-w-xs mx-auto mb-10">Start your spiritual journey by booking your first ceremony today.</p>
                <Link 
                  to="/find-pandit"
                  className="inline-flex px-10 py-5 bg-primary text-white rounded-full font-black text-xs uppercase tracking-[0.2em] sacred-shadow hover:bg-primary-container transition-all shadow-xl shadow-primary/20"
                >
                  Book New Ritual
                </Link>
              </div>
            )}
          </section>

          {/* Past Bookings Section */}
          <section id="past">
            <h2 className="text-2xl font-black text-on-surface mb-8 tracking-tight">Past Booking</h2>
            <div className="bg-white rounded-[2.5rem] sacred-shadow overflow-hidden border border-outline-variant/20">
              {pastBookings.length > 0 ? (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-surface-container-low text-on-surface-variant/60 font-black text-[10px] uppercase tracking-[0.2em] border-b border-outline-variant/20">
                      <tr>
                        <th className="px-8 py-5">Date</th>
                        <th className="px-8 py-5">ID</th>
                        <th className="px-8 py-5">Amount</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-sm font-bold">
                      {pastBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-8 py-6 text-on-surface">{new Date(booking.scheduledAt).toLocaleDateString()}</td>
                          <td className="px-8 py-6 text-on-surface-variant/60 font-mono tracking-tighter">#{String(booking.id).slice(0, 8)}</td>
                          <td className="px-8 py-6 text-primary">₹{(booking as any).totalPrice || "---"}</td>
                          <td className="px-8 py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              booking.status === 'completed' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            )}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="text-primary hover:underline text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-auto group">
                              <FileText size={14} className="group-hover:scale-110 transition-transform" /> Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-on-surface-variant/20 font-black uppercase tracking-[0.4em] text-xs">Awaiting First Ritual</p>
                </div>
              )}
            </div>
          </section>

          {/* Saved Pandits Section */}
          <section id="saved">
             <div className="flex justify-between items-end mb-8">
               <div>
                 <h2 className="text-2xl font-black text-on-surface tracking-tight">Saved Pandits</h2>
                 <p className="text-sm font-bold text-on-surface-variant/60 mt-1">Your chosen guides for spiritual journey.</p>
               </div>
             </div>
             
             <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-outline-variant/30 sacred-shadow">
               <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6 text-outline-variant">
                 <Heart size={28} />
               </div>
               <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">No saved Pandits yet</p>
             </div>
          </section>
        </main>
      </div>

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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl z-101 overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-2xl font-black text-on-surface tracking-tight">Edit Profile</h2>
                    <p className="text-xs font-bold text-on-surface-variant/40 mt-1">Update your personal sanctuary details</p>
                  </div>
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="w-10 h-10 rounded-full bg-surface-container text-on-surface hover:bg-primary-container hover:text-white transition-all flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30 ml-1">Full Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface focus:outline-none focus:border-primary transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30 ml-1">Mobile Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) setEditPhone(val);
                        }}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface focus:outline-none focus:border-primary transition-all"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30 ml-1">Sacred City</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="text"
                        value={editCity}
                        onChange={e => setEditCity(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface focus:outline-none focus:border-primary transition-all"
                        placeholder="e.g. Varanasi, Haridwar"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30 ml-1">Email (Immutable)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline/30" size={18} />
                      <input
                        type="email"
                        value={userEmail}
                        readOnly
                        className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl py-4 pl-12 pr-4 font-bold text-on-surface/40 outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {saveError && <p className="text-red-500 text-[10px] font-black text-center">{saveError}</p>}

                  {saveSuccess ? (
                    <div className="w-full py-5 bg-green-50 text-green-600 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-green-100 animate-pulse">
                      <CheckCircle size={18} /> Saved Successfully!
                    </div>
                  ) : (
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving || !editName.trim()}
                      className="w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-full sacred-shadow hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-6"
                    >
                      {isSaving ? (
                        <><Loader2 size={18} className="animate-spin" /> Transmitting...</>
                      ) : (
                        <><Save size={18} /> Conserve Changes</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Link to="/find-pandit" className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center sacred-shadow hover:scale-110 active:scale-90 transition-all">
          <Calendar size={24} />
        </Link>
      </div>
    </div>
  );
}
