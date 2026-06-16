import { useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser 
} from "firebase/auth";
import { 
  doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp 
} from "firebase/firestore";
import { auth, db as firestoreDb } from "./lib/firebase.ts";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  X,
  Phone,
  ChevronRight,
  LogOut,
  Menu,
  MapPin,
  User as UserIcon
} from "lucide-react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Service, User, Booking, Pandit } from "./types.ts";
import Home from "./pages/Home.tsx";
import FindPandit from "./pages/FindPandit.tsx";
import PanditProfile from "./pages/PanditProfile.tsx";
import BookingWizard from "./pages/BookingWizard.tsx";
import BookingConfirmation from "./pages/BookingConfirmation.tsx";
import Astrology from "./pages/Astrology.tsx";
import KundaliPreview from "./pages/KundaliPreview.tsx";
import Weddings from "./pages/Weddings.tsx";
import MuhuratCalculator from "./pages/MuhuratCalculator.tsx";
import PanditOnboarding from "./pages/PanditOnboarding.tsx";
import PanditDashboard from "./pages/PanditDashboard.tsx";
import PanditPlans from "./pages/PanditPlans.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import BookingDetails from "./pages/BookingDetails.tsx";
import ReviewPage from "./pages/ReviewPage.tsx";
import RemediesMarketplace from "./pages/RemediesMarketplace.tsx";
import AuthPage from "./pages/AuthPage.tsx";


function AppContent() {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setFbUser(u);
      if (u) {
        await loadUserFromFirestore(u);
        await fetchBookings(u);
      } else {
        setUser(null);
        setBookings([]);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchServices();
    fetchPandits();
  }, []);

  // Save or update user document in Firestore
  const saveUserToFirestore = async (
    u: FirebaseUser, 
    metadata?: { name?: string; phone?: string; role?: string; city?: string; spec?: string }
  ) => {
    try {
      const userRef = doc(firestoreDb, "users", u.uid);
      const existing = await getDoc(userRef);

      if (!existing.exists()) {
        // New user — create the document
        await setDoc(userRef, {
          uid: u.uid,
          email: u.email || null,
          name: metadata?.name || u.displayName || "Devotee",
          phone: metadata?.phone || u.phoneNumber || null,
          role: metadata?.role || "customer",
          city: metadata?.city || null,
          specialization: metadata?.spec || null,
          photoUrl: u.photoURL || null,
          isVerified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else if (metadata && Object.keys(metadata).length > 0) {
        // Existing user — update only provided fields
        const updates: any = { updatedAt: serverTimestamp() };
        if (metadata.name) updates.name = metadata.name;
        if (metadata.phone) updates.phone = metadata.phone;
        if (metadata.role) updates.role = metadata.role;
        if (metadata.city) updates.city = metadata.city;
        if (metadata.spec) updates.specialization = metadata.spec;
        await updateDoc(userRef, updates);
      }

      // Read back the saved document and set the local state
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setUser({ id: snap.id, ...snap.data() } as any);
      }
    } catch (err) {
      console.error("Firestore save error:", err);
    }
  };

  // Load user data from Firestore into local state
  const loadUserFromFirestore = async (u: FirebaseUser) => {
    try {
      const userRef = doc(firestoreDb, "users", u.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setUser({ id: snap.id, ...snap.data() } as any);
      } else {
        // User not in Firestore yet — create a basic record
        await saveUserToFirestore(u);
      }
    } catch (err) {
      console.error("Firestore load error:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      if (!res.ok) {
        if (res.status === 429) {
          console.warn("Rate limit hit for services");
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setServices(Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : []));
    } catch (err) {
      console.error("Fetch services error:", err);
      setServices([]);
    }
  };

  const fetchPandits = async () => {
    try {
      const res = await fetch("/api/pandits");
      if (!res.ok) {
        if (res.status === 429) {
          console.warn("Rate limit hit for pandits");
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPandits(Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : []));
    } catch (err) {
      console.error("Fetch pandits error:", err);
      setPandits([]);
    }
  };

  const fetchBookings = async (u: FirebaseUser) => {
    try {
      const q = query(
        collection(firestoreDb, "bookings"),
        where("customerId", "==", u.uid)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setBookings(data as any[]);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setBookings([]);
    }
  };

  const login = () => {
    navigate("/login");
  };

  const handleLoginSuccess = async (userData: any) => {
    // This is now handled within AuthPage.tsx, but kept for legacy or other flows
    navigate("/dashboard");
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFbUser(null);
    navigate("/");
  };

  const handleBook = async (service: Service) => {
    if (!fbUser) {
      login();
      return;
    }
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full mb-4"
        />
        <div className="text-saffron font-black text-xs uppercase tracking-[0.2em] animate-pulse">Loading Sacred Space...</div>
      </div>
    );
  }

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const hideHeaderAndFooter = 
    isAuthPage || 
    location.pathname === "/dashboard" || 
    location.pathname === "/pandit/dashboard" || 
    location.pathname === "/pandit/onboarding" || 
    location.pathname === "/pandit/plans" || 
    location.pathname.startsWith("/signup/pandit");

  return (
    <div className="min-h-screen mandala-bg">
      {/* Navigation */}
      {!hideHeaderAndFooter && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-saffron/10 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-saffron rounded-lg flex items-center justify-center text-white font-bold text-xl">ॐ</div>
              <h1 className="text-2xl font-bold font-decorative tracking-tight text-text-dark">BookPandit<span className="text-saffron">Ji</span></h1>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              <Link to="/" className={`text-sm font-bold transition-colors ${location.pathname === '/' ? 'text-saffron' : 'text-text-dark/70 hover:text-saffron'}`}>Home</Link>
              <Link to="/find-pandit" className={`text-sm font-bold transition-colors ${location.pathname === '/find-pandit' ? 'text-saffron' : 'text-text-dark/70 hover:text-saffron'}`}>Find Pandit</Link>
              <Link to="/weddings" className={`text-sm font-bold transition-colors ${location.pathname === '/weddings' ? 'text-saffron' : 'text-text-dark/70 hover:text-saffron'}`}>Weddings</Link>
              <Link to="/astrology" className={`text-sm font-bold transition-colors ${location.pathname === '/astrology' ? 'text-saffron' : 'text-text-dark/70 hover:text-saffron'}`}>Astrology</Link>
              <Link to="/remedies" className={`text-sm font-bold transition-colors ${location.pathname === '/remedies' ? 'text-amber-500' : 'text-text-dark/70 hover:text-amber-500'}`}>Remedies</Link>
              <Link to="/muhurat" className={`text-sm font-bold transition-colors ${location.pathname === '/muhurat' ? 'text-gold' : 'text-text-dark/70 hover:text-gold'}`}>Muhurat</Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to={user.role === "pandit" ? "/pandit/dashboard" : "/dashboard"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-saffron/10 flex items-center justify-center text-saffron">
                      <UserIcon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-dark">{user.name}</span>
                      <span className="text-[10px] font-black text-saffron uppercase tracking-widest">{user.role}</span>
                    </div>
                  </Link>
                  <button onClick={logout} className="p-2 text-text-dark/50 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="bg-saffron text-white px-8 py-3 rounded-2xl text-[10px] uppercase font-black tracking-widest hover:bg-text-dark transition-all shadow-xl shadow-saffron/20 border-b-4 border-saffron-muted"
                >
                  Login / Signup
                </button>
              )}
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      )}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-100 md:hidden bg-white"
          >
            <div className="p-6 flex flex-col h-full bg-linear-to-b from-white to-orange-50">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-saffron rounded-lg flex items-center justify-center text-white font-bold text-xl">ॐ</div>
                  <h1 className="text-2xl font-bold font-decorative tracking-tight text-text-dark">BookPanditJi</h1>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-text-dark">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-text-dark flex items-center justify-between">
                  Home <ChevronRight className="text-saffron" />
                </Link>
                <Link to="/find-pandit" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-text-dark flex items-center justify-between">
                  Find Pandit <ChevronRight className="text-saffron" />
                </Link>
                <Link to="/weddings" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-text-dark flex items-center justify-between">
                  Weddings <ChevronRight className="text-saffron" />
                </Link>
                <Link to="/astrology" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-text-dark flex items-center justify-between">
                  Astrology <ChevronRight className="text-saffron" />
                </Link>
                <Link to="/remedies" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-text-dark flex items-center justify-between">
                  Remedies <ChevronRight className="text-amber-500" />
                </Link>
                <Link to="/muhurat" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-text-dark flex items-center justify-between">
                  Muhurat <ChevronRight className="text-gold" />
                </Link>
              </div>

              <div className="mt-auto pb-12">
                {user ? (
                  <div className="space-y-4">
                     <Link 
                       to={user.role === "pandit" ? "/pandit/dashboard" : "/dashboard"} 
                       onClick={() => setIsMenuOpen(false)}
                       className="flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm border border-saffron/10"
                     >
                      <div className="w-12 h-12 rounded-2xl bg-saffron/10 flex items-center justify-center text-saffron">
                        <UserIcon size={24} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-text-dark">{user.name}</span>
                        <span className="text-xs font-black text-saffron uppercase tracking-widest">{user.role}</span>
                      </div>
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-5 bg-white border-2 border-red-100 text-red-500 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      login();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-5 bg-saffron text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-saffron/20 border-b-4 border-saffron-muted"
                  >
                    Login / Signup
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup/devotee" element={<AuthPage />} />
        <Route path="/signup/pandit" element={<PanditOnboarding user={user} onComplete={() => loadUserFromFirestore(fbUser!)} />} />
        <Route path="/" element={<Home services={services} pandits={pandits} onBook={() => navigate('/book')} onFindPandit={() => navigate('/find-pandit')} />} />
        <Route path="/find-pandit" element={<FindPandit />} />
        <Route path="/pandit/:id" element={<PanditProfile />} />
        <Route path="/book" element={<BookingWizard />} />
        <Route path="/booking-confirmed" element={<BookingConfirmation />} />
        <Route path="/astrology" element={<Astrology />} />
        <Route path="/kundali/preview" element={<KundaliPreview />} />
        <Route path="/weddings" element={<Weddings />} />
        <Route path="/muhurat" element={<MuhuratCalculator />} />
        <Route path="/pandit/onboarding" element={<PanditOnboarding user={user} onComplete={() => loadUserFromFirestore(fbUser!)} />} />
        <Route path="/pandit/dashboard" element={<PanditDashboard user={user} />} />
        <Route path="/pandit/plans" element={<PanditPlans />} />
        <Route path="/remedies" element={<RemediesMarketplace />} />
        <Route path="/dashboard" element={<Dashboard user={user} bookings={bookings} onUserUpdate={(updated) => setUser(prev => prev ? { ...prev, ...updated } : prev)} />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/review/:bookingId" element={<ReviewPage />} />
      </Routes>

      {/* Booking Modal (Simplified) */}
      <AnimatePresence>
        {isBookingModalOpen && selectedService && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-text-dark/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-4xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 text-center bg-linear-to-br from-saffron to-gold text-white relative">
                <button onClick={() => setIsBookingModalOpen(false)} className="absolute right-6 top-6 hover:rotate-90 transition-transform">
                  <X />
                </button>
                <h3 className="text-3xl font-bold mb-2">Reserve {selectedService.name}</h3>
                <p className="opacity-90">Please provide schedule details</p>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-text-dark/50 uppercase mb-2">Select Date & Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-saffron" size={20} />
                      <input type="datetime-local" className="w-full bg-slate-50 border border-saffron/20 rounded-2xl py-4 pl-12 pr-4 font-semibold focus:outline-saffron" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-dark/50 uppercase mb-2">Ceremony Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-saffron" size={20} />
                      <input type="text" placeholder="Enter full address..." className="w-full bg-slate-50 border border-saffron/20 rounded-2xl py-4 pl-12 pr-4 font-semibold focus:outline-saffron" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-dashed">
                      <span className="text-lg font-bold">Total Amount</span>
                      <span className="text-2xl font-black text-saffron">₹{selectedService.basePrice}</span>
                    </div>
                    <button 
                      onClick={() => {
                        alert("In a real app, this would trigger Razorpay!");
                        setIsBookingModalOpen(false);
                      }}
                      className="w-full bg-saffron text-white py-5 rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-saffron/30 transition-all flex items-center justify-center gap-2"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!hideHeaderAndFooter && (
        <footer className="bg-inverse-surface text-on-inverse-surface pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary font-bold">ॐ</div>
              <Link to="/"><h1 className="text-2xl font-bold text-primary tracking-tight">BookPanditJi</h1></Link>
            </div>
            <p className="text-on-inverse-surface/60 text-sm leading-relaxed mb-6">
              Preserving tradition, simplifying devotion. India's favorite digital gateway to spiritual peace.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-6">Our Services</h5>
            <ul className="space-y-4 text-on-inverse-surface/50 text-sm">
              <li className="hover:text-primary transition-colors cursor-pointer">Havan & Puja</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Astrology Charts</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Vastu Shastra</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Wedding Rituals</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-6">Company</h5>
            <ul className="space-y-4 text-on-inverse-surface/50 text-sm">
              <li className="hover:text-primary transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Verified Pandits</li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                <Link to="/pandit/onboarding">Join as Pandit</Link>
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">Support</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-6">Download Our App</h5>
            <p className="text-on-inverse-surface/50 text-sm mb-6">Get the BookPanditJi mobile experience for faster bookings.</p>
            <div className="space-y-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-primary">iOS</div>
                <div>
                  <div className="text-[8px] uppercase opacity-40 font-black tracking-widest text-white">Download on</div>
                  <div className="text-sm font-black">App Store</div>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-primary">GP</div>
                <div>
                  <div className="text-[8px] uppercase opacity-40 font-black tracking-widest text-white">Get it on</div>
                  <div className="text-sm font-black">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-on-inverse-surface/5 text-[10px] font-black uppercase tracking-[0.2em] text-on-inverse-surface/20">
          © 2026 BookPanditJi Pvt Ltd. All rights reserved. Spiritual peace at your doorstep.
        </div>
      </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
