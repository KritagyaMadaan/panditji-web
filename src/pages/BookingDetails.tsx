import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  AlertCircle, 
  ArrowLeft, 
  Star,
  ShieldCheck,
  CreditCard,
  Hash,
  XCircle
} from "lucide-react";
import { cn } from "../lib/utils.ts";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db as firestoreDb } from "../lib/firebase.ts";

const statusSteps = [
  "pending",
  "confirmed",
  "en-route",
  "arrived",
  "in-progress",
  "completed"
];

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending": return "Pending Approval";
    case "confirmed": return "Confirmed";
    case "en-route": return "Pandit En Route";
    case "arrived": return "Pandit Arrived";
    case "in-progress": return "Ceremony in Progress";
    case "completed": return "Completed";
    case "cancelled": return "Cancelled";
    default: return status.toUpperCase();
  }
};

const getStatusDescription = (status: string) => {
  switch (status) {
    case "pending": return "Waiting for Acharya to accept your booking request.";
    case "confirmed": return "Acharya has accepted. Preparing for the ceremony.";
    case "en-route": return "Acharya is travelling to your location.";
    case "arrived": return "Acharya has reached the ceremony location.";
    case "in-progress": return "The sacred mantras and rituals are in progress.";
    case "completed": return "The puja ceremony was completed successfully. Blessings to you!";
    case "cancelled": return "This booking request was cancelled.";
    default: return "";
  }
};

export default function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const docRef = doc(firestoreDb, "bookings", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setBooking({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    setIsCancelling(true);
    try {
      const docRef = doc(firestoreDb, "bookings", id!);
      await updateDoc(docRef, {
        status: "cancelled",
        updatedAt: serverTimestamp()
      });
      setBooking((prev: any) => ({ ...prev, status: "cancelled" }));
      alert("Booking cancelled successfully.");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"
        />
        <div className="text-primary font-black text-xs uppercase tracking-[0.2em] animate-pulse">
          Loading Booking Details...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center p-4">
        <div className="text-5xl mb-4">🕉️</div>
        <h2 className="text-2xl font-black text-on-surface mb-2">Booking Not Found</h2>
        <p className="text-on-surface-variant mb-6">We couldn't find the booking details you requested.</p>
        <Link to="/dashboard" className="px-6 py-3 bg-[#2C1006] text-white rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-all">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentStatus = booking.status || "pending";
  const currentStepIndex = statusSteps.indexOf(currentStatus);

  const bookingRefId = `BPJ-${booking.id.slice(0, 8).toUpperCase()}`;

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formattedDate = formatDate(booking.scheduledDate);
  const formattedAddress = booking.address 
    ? `${booking.address.houseNo || ""}, ${booking.address.fullAddress || ""}, ${booking.address.city || ""} - ${booking.address.pincode || ""}`
    : "Not Specified";

  return (
    <div className="min-h-screen bg-surface pb-20 pt-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all mb-8"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Top Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-primary/5 border border-primary/5 mb-10 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
                 <ShieldCheck size={12} /> Secure Booking
              </div>
              <h1 className="text-3xl font-black text-on-surface tracking-tight">{booking.service || "Vedic Puja"}</h1>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm">
                   <Calendar size={16} className="text-primary" /> {formattedDate}
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm">
                   <Clock size={16} className="text-primary" /> {booking.scheduledTime || "Not Selected"}
                </div>
              </div>
              <div className="flex items-start gap-2 text-on-surface-variant font-bold text-sm max-w-md">
                 <MapPin size={16} className="shrink-0 mt-0.5 text-primary" /> {formattedAddress}
              </div>
            </div>
            <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 flex flex-col items-center justify-center min-w-[160px]">
               <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Dakshina Paid</div>
               <div className="text-3xl font-black text-primary">₹{(booking.totalAmount || 0).toLocaleString()}</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Status Timeline */}
          <div className="lg:col-span-12">
            <h2 className="text-xl font-black text-on-surface mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Hash size={16} />
              </div>
              Live Status Timeline
            </h2>
            
            <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl shadow-primary/5 border border-primary/5">
              {currentStatus === "cancelled" ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <XCircle className="text-red-500 w-16 h-16 mb-4" />
                  <h3 className="text-xl font-black text-on-surface">Puja Request Cancelled</h3>
                  <p className="text-on-surface-variant text-sm mt-2 max-w-sm">This booking has been cancelled and refunds are processed if applicable.</p>
                </div>
              ) : (
                <div className="relative space-y-12">
                  {/* Vertical Line */}
                  <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-outline-variant/30"></div>
                  
                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isActive = idx === currentStepIndex;

                    return (
                      <div key={step} className="relative flex items-start gap-10 group text-left">
                        {/* Step Indicator */}
                        <div className="relative z-10">
                          {isCompleted ? (
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                              <CheckCircle size={20} />
                            </div>
                          ) : isActive ? (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 scale-110">
                              <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                              </span>
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-white border-2 border-outline-variant flex items-center justify-center text-outline-variant">
                               <div className="w-2 h-2 rounded-full bg-current"></div>
                            </div>
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 pt-1">
                          <div className={cn(
                            "text-sm font-black uppercase tracking-widest transition-all",
                            isActive ? "text-primary scale-105 origin-left" : 
                            isCompleted ? "text-green-600" : "text-on-surface-variant/40"
                          )}>
                            {getStatusLabel(step)}
                          </div>
                          {isActive && (
                            <p className="text-xs font-bold text-on-surface-variant mt-1">
                              {getStatusDescription(step)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pandit Card */}
          <div className="lg:col-span-12">
             <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-primary/5 border border-primary/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6 text-left">
                   <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-4xl border-2 border-primary/10 shadow-inner">
                      🧘
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary">Assigned Acharya</div>
                      <h3 className="text-2xl font-black text-on-surface">{booking.panditName || "Awaiting Assignment"}</h3>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 text-secondary text-sm font-black">
                            <Star size={14} fill="currentColor" /> 4.9
                         </div>
                         <div className="text-xs font-bold text-on-surface-variant">
                           {booking.panditId ? "+91 98765-XXXXX" : "Contact details hidden"}
                         </div>
                      </div>
                   </div>
                </div>
                {booking.panditId && (
                  <button 
                    onClick={() => alert("Calling Pandit Ji...")}
                    className="w-full md:w-auto px-10 py-5 bg-[#2C1006] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3"
                  >
                     <Phone size={16} />
                     Call Acharya
                  </button>
                )}
             </div>
          </div>

          {/* Detailed Info */}
          <div className="lg:col-span-12">
             <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl shadow-primary/5 border border-primary/5 text-left">
                <h3 className="text-lg font-black text-on-surface mb-8 uppercase tracking-widest">Ritual Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Service Requested</div>
                      <div className="text-sm font-bold text-on-surface">{booking.service || "Vedic Puja"}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Scheduled Date & Time</div>
                      <div className="text-sm font-bold text-on-surface">{formattedDate} at {booking.scheduledTime || "Not Selected"}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Ceremony Address</div>
                      <div className="text-sm font-bold text-on-surface leading-relaxed">{formattedAddress}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Payment Info</div>
                      <div className="flex items-center gap-2 text-sm font-bold text-on-surface">
                         <CreditCard size={14} className="text-primary" /> Paid via {booking.paymentMethod?.toUpperCase() || "Online"}
                      </div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Booking ID</div>
                      <div className="text-sm font-bold text-on-surface font-mono bg-surface px-3 py-1 rounded-lg border border-outline-variant/30 inline-block">{bookingRefId}</div>
                   </div>
                   {booking.specialInstructions && (
                     <div className="space-y-1 col-span-full">
                        <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Special Instructions</div>
                        <div className="text-sm font-bold text-on-surface leading-relaxed">{booking.specialInstructions}</div>
                     </div>
                   )}
                </div>

                {currentStatus !== "completed" && currentStatus !== "cancelled" && (
                  <div className="mt-12 pt-10 border-t border-outline-variant/30 flex flex-col items-center gap-4">
                     <button 
                       onClick={handleCancelBooking}
                       disabled={isCancelling}
                       className="px-8 py-3 rounded-full border-2 border-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                     >
                        {isCancelling ? "Cancelling..." : "Cancel Booking"}
                     </button>
                     <p className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest">Cancellation is free up to 24 hours prior to slot</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Support Footer */}
        <div className="mt-12 text-center p-10 bg-on-surface rounded-[2.5rem] shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 mandala-bg opacity-[0.03] scale-150"></div>
           <div className="relative z-10">
             <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={24} />
             </div>
             <h4 className="text-xl font-bold text-white mb-2">Facing an issue?</h4>
             <p className="text-white/40 text-sm font-medium mb-8">Our dedicated support team is here to help you 24/7.</p>
             <button className="text-primary font-black text-[10px] uppercase tracking-widest hover:tracking-[0.2em] transition-all">
                Contact Support Agent
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
