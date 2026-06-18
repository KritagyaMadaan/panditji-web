import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils.ts";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db as firestoreDb, auth } from "../lib/firebase.ts";

// Ceremony data with Material Symbols icon names
const ceremonies = [
  { id: "griha-pravesh", name: "Griha Pravesh", icon: "home_work", price: 5100 },
  { id: "satyanarayan", name: "Satyanarayan", icon: "menu_book", price: 3100 },
  { id: "vivah-puja", name: "Vivah Puja", icon: "favorite", price: 11000 },
  { id: "namkaran", name: "Namkaran", icon: "child_care", price: 2100 },
  { id: "sunderkand", name: "Sunderkand", icon: "auto_stories", price: 4500 },
  { id: "mundan", name: "Mundan", icon: "celebration", price: 2500 },
];

const timeSlots = ["06:00 AM", "09:30 AM", "11:00 AM"];

const paymentMethods = [
  { id: "upi", name: "UPI", desc: "GPay, PhonePe", icon: "payments" },
  { id: "card", name: "Card", desc: "Credit / Debit", icon: "credit_card" },
  { id: "banking", name: "Banking", desc: "Net Banking", icon: "account_balance" },
  { id: "wallet", name: "Wallet", desc: "Amazon, Paytm", icon: "account_balance_wallet" },
];

interface PanditData {
  id: string;
  name: string;
  photoUrl?: string;
  rating: number;
  experience: number;
  isVerified: boolean;
  services?: Array<{ id: string; name: string; price: number }>;
  basePrice?: number;
}

export default function BookingWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Selection state
  const [selectedCeremony, setSelectedCeremony] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateFormatted, setSelectedDateFormatted] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Location state
  const [address, setAddress] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  // Pandit data from Firestore
  const [pandit, setPandit] = useState<PanditData | null>(null);
  const [loadingPandit, setLoadingPandit] = useState(true);

  // Booking state
  const [isBooking, setIsBooking] = useState(false);

  // Get pandit ID from URL or state
  const panditId = searchParams.get("pandit") || (location.state as any)?.panditId || null;

  // Fetch pandit from Firestore
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPandit = async () => {
      if (!panditId) {
        setLoadingPandit(false);
        return;
      }
      try {
        const panditDoc = await getDoc(doc(firestoreDb, "pandits", panditId));
        if (panditDoc.exists()) {
          const data = panditDoc.data();
          setPandit({
            id: panditDoc.id,
            name: data.name || "Pandit Ji",
            photoUrl: data.photoUrl || undefined,
            rating: data.rating ? parseFloat(String(data.rating)) : 4.9,
            experience: data.experience || 0,
            isVerified: data.isVerified || data.onboardingCompleted || false,
            services: data.services || undefined,
            basePrice: data.basePrice ? Number(data.basePrice) : undefined,
          });
        }
      } catch (err) {
        console.error("Error fetching pandit:", err);
      } finally {
        setLoadingPandit(false);
      }
    };

    fetchPandit();
  }, [panditId]);

  // Derive available ceremonies (use pandit's services if available, otherwise defaults)
  const availableCeremonies = pandit?.services && pandit.services.length > 0
    ? pandit.services.map((s, i) => ({
        id: s.id || `service-${i}`,
        name: s.name,
        icon: ceremonies[i % ceremonies.length].icon,
        price: s.price,
      }))
    : ceremonies;

  // Validation
  const isStep1Valid = !!(selectedCeremony && selectedDate && selectedTime);
  const isStep2Valid = !!(address && houseNo && city && pincode);
  const isStep3Valid = !!paymentMethod;

  const isCurrentStepValid = step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : isStep3Valid;

  // Price calculations
  const platformFee = Math.round(selectedPrice * 0.18);
  const gst = Math.round((selectedPrice + platformFee) * 0.05);
  const totalAmount = selectedPrice + platformFee + gst;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const dateObj = new Date(e.target.value + "T00:00:00");
      const formatted = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      setSelectedDate(e.target.value);
      setSelectedDateFormatted(formatted);
    }
  };

  const changeStep = (delta: number) => {
    const nextStep = step + delta;
    if (nextStep < 1 || nextStep > 3) return;
    if (delta > 0 && !isCurrentStepValid) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);
  };

  const handleBooking = async () => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    setIsBooking(true);
    try {
      let customerName = auth.currentUser.displayName || "Devotee";
      let customerPhone = auth.currentUser.phoneNumber || "";
      
      try {
        const userDoc = await getDoc(doc(firestoreDb, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.name) customerName = userData.name;
          if (userData.phone) customerPhone = userData.phone;
        }
      } catch (err) {
        console.error("Error fetching customer name for booking:", err);
      }

      const bookingRef = await addDoc(collection(firestoreDb, "bookings"), {
        customerId: auth.currentUser.uid,
        customerName,
        customerPhone,
        panditId: panditId || null,
        panditName: pandit?.name || "Unassigned",
        service: selectedCeremony,
        servicePrice: selectedPrice,
        platformFee,
        gst,
        totalAmount,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        address: {
          fullAddress: address,
          houseNo,
          landmark,
          city,
          pincode,
        },
        specialInstructions,
        paymentMethod,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      navigate("/booking-confirmed", {
        state: {
          bookingId: bookingRef.id,
          service: selectedCeremony,
          date: selectedDate,
          time: selectedTime,
          total: totalAmount,
          panditName: pandit?.name,
        },
      });
    } catch (err) {
      console.error("Booking creation failed:", err);
      alert("Failed to create booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loadingPandit) {
    return (
      <div className="min-h-screen mandala-bg flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"
        />
        <div className="text-primary font-semibold text-sm animate-pulse font-sans">
          Preparing Your Booking...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mandala-bg flex flex-col items-center pt-8 pb-16">
      <main className="w-full max-w-[560px] px-4 flex flex-col items-center">
        {/* Progress Tracker */}
        <div className="w-full flex justify-between items-center mb-10 relative px-10">
          {/* Connecting line */}
          <div className="absolute top-5 left-10 right-10 h-[2px] bg-outline-variant z-0" />

          {[
            { label: "SERVICE", num: 1 },
            { label: "LOCATION", num: 2 },
            { label: "PAYMENT", num: 3 },
          ].map(({ label, num }) => (
            <div key={num} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-300 relative",
                  step > num
                    ? "border-green-500 bg-green-500 text-white"
                    : step === num
                    ? "border-primary bg-white text-primary"
                    : "border-outline-variant bg-white text-on-surface-variant"
                )}
              >
                {step > num ? (
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'wght' 700" }}
                  >
                    check
                  </span>
                ) : (
                  num
                )}
                {step === num && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-4 border-primary/20"
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[12px] uppercase tracking-tighter",
                  step > num
                    ? "font-bold text-green-500"
                    : step === num
                    ? "font-bold text-primary"
                    : "font-medium text-on-surface-variant"
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Card Container */}
        <div className="w-full bg-white rounded-2xl sacred-shadow relative overflow-hidden flex flex-col">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-[#ff6b00]" />

          <div className="p-6 flex-1">
            <AnimatePresence mode="wait">
              {/* STEP 1: Select Service & Time */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="font-decorative text-2xl font-bold text-on-surface">
                    Select Service & Time
                  </h2>

                  {/* Pandit Info Card */}
                  {pandit && (
                    <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-outline-variant/30">
                      <div className="w-14 h-14 rounded-full border-2 border-white shadow-sm overflow-hidden bg-surface-container-high flex items-center justify-center">
                        {pandit.photoUrl ? (
                          <img
                            src={pandit.photoUrl}
                            alt={pandit.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-primary text-[28px]">
                            person
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-on-surface">{pandit.name}</span>
                          {pandit.isVerified && (
                            <span
                              className="material-symbols-outlined text-primary text-[16px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                          <span className="flex items-center gap-0.5 text-primary">
                            <span
                              className="material-symbols-outlined text-[14px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span className="font-semibold">{pandit.rating}</span>
                          </span>
                          {pandit.experience > 0 && (
                            <span>• {pandit.experience}+ years exp.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ceremony Grid */}
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-3">
                      Ritual Category
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {availableCeremonies.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedCeremony(c.name);
                            setSelectedPrice(c.price);
                          }}
                          className={cn(
                            "border p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all",
                            selectedCeremony === c.name
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-outline-variant bg-white hover:border-primary/50"
                          )}
                        >
                          <span className="material-symbols-outlined text-primary text-[28px]">
                            {c.icon}
                          </span>
                          <span className="text-sm font-semibold text-on-surface">
                            {c.name}
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-medium">
                            ₹{c.price.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-3">
                        Schedule
                      </p>
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => dateInputRef.current?.showPicker()}
                      >
                        <div
                          className={cn(
                            "w-full flex items-center justify-between p-3.5 border rounded-xl bg-white cursor-pointer transition-colors",
                            selectedDate
                              ? "border-primary"
                              : "border-outline-variant group-hover:border-primary"
                          )}
                        >
                          <span
                            className={cn(
                              "text-sm font-medium",
                              selectedDateFormatted
                                ? "text-on-surface font-bold"
                                : "text-on-surface-variant"
                            )}
                          >
                            {selectedDateFormatted || "Select a date"}
                          </span>
                          <span className="material-symbols-outlined text-primary">
                            calendar_today
                          </span>
                        </div>
                        <input
                          ref={dateInputRef}
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleDateChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={cn(
                            "border p-2 rounded-lg text-center cursor-pointer font-semibold text-xs transition-all",
                            selectedTime === t
                              ? "bg-[#7A2E0A] text-white border-[#7A2E0A]"
                              : "bg-white text-on-surface border-outline-variant hover:border-primary/50"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Ceremony Location */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="font-decorative text-2xl font-bold text-on-surface">
                    Ceremony Location
                  </h2>

                  {/* Search Address */}
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-2">
                      Ceremony Address
                    </p>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        search
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-xl bg-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                        placeholder="Search for ceremony address..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Map Preview */}
                  <div className="w-full h-44 rounded-xl bg-surface-container-high border border-outline-variant relative overflow-hidden flex items-center justify-center">
                    <svg
                      className="absolute inset-0 w-full h-full opacity-30"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 20 H560 M0 60 H560 M0 100 H560 M0 140 H560"
                        stroke="#8E7164"
                        strokeWidth="1"
                      />
                      <path
                        d="M40 0 V176 M120 0 V176 M200 0 V176 M280 0 V176 M360 0 V176 M440 0 V176"
                        stroke="#8E7164"
                        strokeWidth="1"
                      />
                      <path d="M100 0 L400 176" stroke="#8E7164" strokeWidth="2" />
                    </svg>
                    <div className="relative z-10 text-center px-8 flex flex-col items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[32px]">
                        location_on
                      </span>
                      <p className="text-[12px] font-semibold text-on-surface opacity-70">
                        {address || "Your selected address will appear here"}
                      </p>
                    </div>
                  </div>

                  {/* Address Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
                        House / Flat No.
                      </label>
                      <input
                        className="w-full p-2.5 border border-outline-variant rounded-lg text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        placeholder="e.g. 402, Block A"
                        value={houseNo}
                        onChange={(e) => setHouseNo(e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        className="w-full p-2.5 border border-outline-variant rounded-lg text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        placeholder="e.g. Near Shiv Temple"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
                        City
                      </label>
                      <input
                        className="w-full p-2.5 border border-outline-variant rounded-lg text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        placeholder="e.g. Varanasi"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
                        Pincode
                      </label>
                      <input
                        className="w-full p-2.5 border border-outline-variant rounded-lg text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        placeholder="221001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
                        Special Instructions
                      </label>
                      <input
                        className="w-full p-2.5 border border-outline-variant rounded-lg text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        placeholder="e.g. Please bring extra incense sticks"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Review & Pay */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="font-decorative text-2xl font-bold text-on-surface">
                    Review & Pay
                  </h2>

                  {/* Review Card */}
                  <div className="bg-surface border border-outline-variant/40 rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-decorative text-lg font-bold text-primary">
                          {selectedCeremony}
                        </h3>
                        <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">
                            calendar_today
                          </span>
                          <span>
                            {selectedDateFormatted} • {selectedTime}
                          </span>
                        </p>
                        {address && (
                          <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[14px]">
                              location_on
                            </span>
                            <span>
                              {houseNo}, {address}, {city} - {pincode}
                            </span>
                          </p>
                        )}
                      </div>
                      {pandit && (
                        <div className="w-12 h-12 rounded-full border border-outline-variant overflow-hidden flex items-center justify-center bg-surface-container-high">
                          {pandit.photoUrl ? (
                            <img
                              src={pandit.photoUrl}
                              alt={pandit.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-primary text-[24px]">
                              person
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-outline-variant/40 pt-4 space-y-2">
                      <div className="flex justify-between text-sm text-on-surface-variant">
                        <span>Service Dakshina</span>
                        <span>₹{selectedPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-on-surface-variant">
                        <span>Platform Fee (18%)</span>
                        <span>₹{platformFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-on-surface-variant">
                        <span>GST (5%)</span>
                        <span>₹{gst.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-primary/10">
                        <span className="font-bold text-on-surface">Total Amount</span>
                        <span className="font-bold text-2xl text-primary">
                          ₹{totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-3">
                      Select Payment Method
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={cn(
                            "border p-3.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all",
                            paymentMethod === m.id
                              ? "border-[#2C1006] bg-[#2C1006]/5 ring-1 ring-[#2C1006]/20"
                              : "border-outline-variant bg-white hover:border-[#2C1006]/40"
                          )}
                        >
                          <span className="material-symbols-outlined text-primary text-[24px]">
                            {m.icon}
                          </span>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-on-surface leading-tight">
                              {m.name}
                            </span>
                            <span className="text-[10px] text-on-surface-variant">
                              {m.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <div className="p-6 bg-white border-t border-outline-variant/20 flex gap-4 items-center">
            {step > 1 && (
              <button
                onClick={() => changeStep(-1)}
                className="px-4 py-3 text-on-surface-variant font-bold text-sm flex items-center gap-1 hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">west</span>
                Previous Step
              </button>
            )}
            <button
              onClick={() => {
                if (step === 3) {
                  handleBooking();
                } else {
                  changeStep(1);
                }
              }}
              disabled={!isCurrentStepValid || isBooking}
              className={cn(
                "px-8 py-3.5 font-bold rounded-full transition-all flex-[2] flex items-center justify-center gap-2",
                isCurrentStepValid && !isBooking
                  ? "bg-[#2C1006] text-white cursor-pointer shadow-md active:scale-[0.98]"
                  : "bg-[#D1C8C1] text-white cursor-not-allowed shadow-none"
              )}
            >
              {isBooking ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Processing...
                </>
              ) : step === 3 ? (
                <>
                  <span>Pay ₹{totalAmount.toLocaleString()} Securely</span>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-[18px]">east</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Help Banner */}
        <div className="mt-6 flex items-center justify-center gap-4 text-on-surface-variant text-sm font-medium">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px] text-primary">
              verified_user
            </span>
            <span>Secure Booking</span>
          </div>
          <div className="w-[1px] h-3 bg-outline-variant" />
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px] text-primary">
              support_agent
            </span>
            <span>24/7 Support</span>
          </div>
        </div>
      </main>
    </div>
  );
}
