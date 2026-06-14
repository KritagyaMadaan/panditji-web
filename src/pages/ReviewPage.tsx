import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  Camera, 
  CheckCircle, 
  Share2, 
  ArrowLeft, 
  LayoutDashboard,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { cn } from "../lib/utils.ts";

const tags = [
  "Punctual", 
  "Knowledgeable", 
  "Calm", 
  "Proper Samagri", 
  "Good Pronunciation"
];

// Mock data lookup function
const getBookingDetails = (id: string) => ({
  id,
  panditName: "Pt. Rajesh Shastri",
  photo: "🧘‍♂️",
  service: "Griha Pravesh Puja",
});

export default function ReviewPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const booking = getBookingDetails(bookingId || "B-DEFAULT");

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50/30 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-saffron/10 border border-saffron/5 p-12 text-center"
        >
          <div className="relative mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-green-500/30"
            >
              <CheckCircle size={48} />
            </motion.div>
          </div>

          <h1 className="text-3xl font-black text-text-dark mb-4 tracking-tight">Thank you for your feedback!</h1>
          <p className="text-text-dark/40 font-bold mb-10 leading-relaxed">Your review helps the community find the best spiritual guides and helps {booking.panditName} grow.</p>

          <div className="space-y-4">
            <button className="w-full py-5 bg-[#25D366] text-white rounded-2xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-green-500/20 hover:opacity-90 transition-all">
              <Share2 size={18} />
              Share on WhatsApp
            </button>
            <Link 
              to="/dashboard"
              className="w-full py-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-text-dark/40 hover:text-saffron transition-all"
            >
              <LayoutDashboard size={18} />
              Back to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20 pt-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-dark/30 hover:text-saffron transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-2xl shadow-saffron/5 border border-saffron/5 overflow-hidden"
        >
          {/* Top Profile Header */}
          <div className="bg-slate-50/50 p-10 border-b border-slate-50 flex items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm border border-saffron/10">
              {booking.photo}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-saffron mb-1">Ritual Completed</div>
              <h1 className="text-2xl font-black text-text-dark tracking-tight">{booking.panditName}</h1>
              <p className="text-sm font-bold text-text-dark/40">{booking.service}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-12 space-y-12">
            {/* Star Rating */}
            <div className="text-center space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">How was your experience?</label>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-colors"
                  >
                    <Star 
                      size={44} 
                      fill={star <= (hoverRating || rating) ? "#FF6B00" : "none"} 
                      className={cn(
                        "transition-all duration-300",
                        star <= (hoverRating || rating) ? "text-saffron drop-shadow-[0_0_8px_rgba(255,107,0,0.3)]" : "text-slate-200"
                      )}
                      strokeWidth={2}
                    />
                  </motion.button>
                ))}
              </div>
              <div className="text-sm font-black text-saffron h-5">
                {rating === 1 && "Need Improvement"}
                {rating === 2 && "Fair Experience"}
                {rating === 3 && "Good Ritual"}
                {rating === 4 && "Very Satisfied"}
                {rating === 5 && "Excellent & Peaceful"}
              </div>
            </div>

            {/* Tag Pills */}
            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30 block text-center">What stood out most?</label>
              <div className="flex flex-wrap justify-center gap-3">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      selectedTags.includes(tag) 
                        ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/20" 
                        : "bg-slate-50 text-text-dark/40 border-transparent hover:border-saffron/20"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Section */}
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30 flex items-center gap-2">
                 <MessageSquare size={14} /> Additional Comments
               </label>
               <textarea 
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full bg-slate-50 border-none rounded-[2rem] py-6 px-8 font-bold text-text-dark focus:ring-2 focus:ring-saffron/20 min-h-[150px] resize-none transition-all"
               />
               
               <button type="button" className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl text-text-dark/40 hover:bg-slate-100 transition-all border border-slate-100 border-dashed">
                 <Camera size={20} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
               </button>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit"
                disabled={rating === 0}
                className={cn(
                  "w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-4",
                  rating > 0 
                    ? "bg-saffron text-white shadow-2xl shadow-saffron/40 hover:bg-text-dark" 
                    : "bg-slate-100 text-text-dark/20 cursor-not-allowed opacity-50"
                )}
              >
                Submit Review
                <Sparkles size={18} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
