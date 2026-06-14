import { useState } from "react";
import { motion } from "motion/react";
import { 
  Bell, 
  ChevronRight, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Award,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  Heart,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils.ts";

interface DashboardProps {
  userName?: string;
}

const upcomingBookings = [
  {
    id: "B-2024-0847",
    panditName: "Pt. Rajesh Shastri",
    photo: "🧘‍♂️",
    service: "Griha Pravesh Puja",
    date: "Oct 24, 2023",
    time: "11:00 AM",
    status: "Confirmed",
    statusColor: "bg-blue-500/10 text-blue-600"
  },
  {
    id: "B-2024-0849",
    panditName: "Acharya Manoj Kumar",
    photo: "📿",
    service: "Satyanarayan Katha",
    date: "Today",
    time: "04:30 PM",
    status: "En Route",
    statusColor: "bg-saffron/10 text-saffron",
    pulsing: true
  }
];

const pastBookings = [
  {
    id: "B-2024-0801",
    panditName: "Pandit Vishwanath Iyer",
    photo: "📔",
    service: "Rudrabhishek Puja",
    date: "Sep 15, 2023",
    status: "Completed"
  },
  {
    id: "B-2024-0790",
    panditName: "Acharya Vinod Tiwari",
    photo: "🪔",
    service: "Navgraha Shanti",
    date: "Aug 20, 2023",
    status: "Completed"
  }
];

const savedPandits = [
  {
    id: 1,
    name: "Pt. Shyam Narayan",
    photo: "🧘",
    rating: 4.98,
    reviews: 320
  },
  {
    id: 2,
    name: "Dr. Meenakshi Iyer",
    photo: "📔",
    rating: 4.85,
    reviews: 156
  },
  {
    id: 3,
    name: "Acharya Vinay Pathak",
    photo: "✨",
    rating: 4.65,
    reviews: 67
  }
];

export default function Dashboard({ userName = "Aditya" }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-saffron/10 pt-12 pb-8 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 lg:px-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-text-dark tracking-tight">Namaste, {userName}</h1>
            <p className="text-sm font-bold text-text-dark/40 mt-1">May your day be filled with spiritual peace.</p>
          </div>
          <div className="relative">
            <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-text-dark/30 hover:bg-saffron/10 hover:text-saffron transition-all border border-slate-100">
              <Bell size={24} />
            </button>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg">
              2
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-12 py-10 space-y-12">
        {/* Profile Summary Card */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-saffron/5 border border-saffron/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-saffron/5 rounded-full flex items-center justify-center text-4xl border-2 border-saffron/10 overflow-hidden shadow-inner font-bold">
                 {userName.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-black text-text-dark">{userName} Sharma</h2>
                <div className="flex items-center gap-2 text-text-dark/40 font-bold text-sm mt-1">
                   <CheckCircle size={14} className="text-green-500" /> +91 98711XXXXX
                </div>
              </div>
           </div>
           <div className="flex gap-4">
              <button className="px-6 py-3 rounded-xl bg-slate-50 text-text-dark/60 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 flex items-center gap-2">
                 <Settings size={14} /> Edit Profile
              </button>
              <button className="px-6 py-3 rounded-xl bg-saffron text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-saffron/20 hover:bg-text-dark transition-all flex items-center gap-2">
                 <Award size={14} /> VIP Devotee
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingBookings.map((booking) => (
              <Link 
                key={booking.id} 
                to={`/booking/${booking.id}`}
                className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-saffron/5 border border-saffron/5 hover:border-saffron/20 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-saffron/5 rounded-full flex items-center justify-center text-3xl shadow-inner border border-saffron/10 group-hover:scale-110 transition-transform">
                      {booking.photo}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-text-dark">{booking.panditName}</h4>
                      <div className="text-xs font-bold text-text-dark/40">{booking.service}</div>
                    </div>
                  </div>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                    booking.statusColor
                  )}>
                    {booking.pulsing && (
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
                      <span className="text-xs font-bold text-text-dark/60">{booking.date}</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-saffron shadow-sm">
                        <Clock size={14} />
                      </div>
                      <span className="text-xs font-bold text-text-dark/60">{booking.time}</span>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Past Bookings */}
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
                    <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-3xl border border-slate-100 shadow-inner">
                      {booking.photo}
                    </div>
                    <div>
                       <h4 className="text-lg font-bold text-text-dark">{booking.panditName}</h4>
                       <div className="text-xs font-bold text-text-dark/40 flex items-center gap-4 mt-1">
                          <span>{booking.service}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                          <span>Completed on {booking.date}</span>
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

        {/* Saved Pandits */}
        <section>
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-text-dark">Saved Pandits</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 hover:text-saffron transition-colors">View All</button>
           </div>
           
           <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide md:mx-0 md:px-0">
              {savedPandits.map((pandit) => (
                <div key={pandit.id} className="min-w-[240px] bg-white rounded-[2rem] p-6 shadow-xl shadow-saffron/5 border border-saffron/5 flex flex-col items-center text-center group">
                   <div className="w-16 h-16 bg-saffron/5 rounded-full flex items-center justify-center text-3xl mb-4 border border-saffron/10 shadow-inner group-hover:scale-110 transition-transform">
                      {pandit.photo}
                   </div>
                   <h4 className="text-md font-bold text-text-dark mb-1">{pandit.name}</h4>
                   <div className="flex items-center gap-1.5 text-gold mb-6">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-black">{pandit.rating}</span>
                      <span className="text-[10px] font-bold text-text-dark/30">({pandit.reviews})</span>
                   </div>
                   <Link 
                    to="/book"
                    className="w-full py-3 rounded-xl bg-slate-50 text-text-dark/60 font-black text-[10px] uppercase tracking-widest hover:bg-saffron hover:text-white transition-all border border-slate-100"
                   >
                     Book Now
                   </Link>
                </div>
              ))}
              <div className="min-w-[200px] bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6 text-slate-400 gap-3 cursor-pointer hover:bg-white transition-all">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Heart size={20} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Find More</span>
              </div>
           </div>
        </section>
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
    </div>
  );
}
