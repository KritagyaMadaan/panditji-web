import { useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser 
} from "firebase/auth";
import { auth } from "./lib/firebase.ts";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  User as UserIcon, 
  LogOut, 
  MapPin, 
  Menu, 
  X,
  Phone
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
import LoginModal from "./components/LoginModal.tsx";

function AppContent() {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setFbUser(u);
      if (u) {
        await syncUser(u);
        fetchBookings(u);
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

  const syncUser = async (u: FirebaseUser) => {
    try {
      const token = await u.getIdToken();
      const res = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: "91" + Math.floor(1000000000 + Math.random() * 9000000000), // Mock phone
          name: u.displayName,
        }),
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Sync error:", err);
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
      const token = await u.getIdToken();
      const res = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : []));
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setBookings([]);
    }
  };

  const login = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (userData: any) => {
    setUser({
      id: Math.floor(Math.random() * 10000),
      uid: Math.random().toString(),
      name: userData.name || "User",
      email: "",
      phone: userData.phone,
      role: userData.role,
      isVerified: true,
      photoUrl: null
    });
    navigate("/dashboard");
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFbUser(null);
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

  return (
    <div className="min-h-screen mandala-bg">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-saffron/10 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-saffron rounded-lg flex items-center justify-center text-white font-bold text-xl">ॐ</div>
              <h1 className="text-2xl font-bold font-decorative tracking-tight text-text-dark">BookPandit<span className="text-saffron">Ji</span></h1>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              <Link to="/find-pandit" className={`text-sm font-bold transition-colors ${location.pathname === '/find-pandit' ? 'text-saffron' : 'text-text-dark/70 hover:text-saffron'}`}>Find Pandit</Link>
              <Link to="/" className="text-sm font-medium text-text-dark/70 hover:text-saffron transition-colors">Services</Link>
              <Link to="/weddings" className={`text-sm font-bold transition-colors ${location.pathname === '/weddings' ? 'text-saffron' : 'text-text-dark/70 hover:text-saffron'}`}>Weddings</Link>
              <Link to="/astrology" className={`text-sm font-bold transition-colors ${location.pathname === '/astrology' ? 'text-saffron' : 'text-text-dark/70 hover:text-saffron'}`}>Astrology</Link>
              <Link to="/remedies" className={`text-sm font-bold transition-colors ${location.pathname === '/remedies' ? 'text-amber-500' : 'text-text-dark/70 hover:text-amber-500'}`}>Remedies</Link>
              <Link to="/muhurat" className={`text-sm font-bold transition-colors ${location.pathname === '/muhurat' ? 'text-gold' : 'text-text-dark/70 hover:text-gold'}`}>Muhurat</Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      <Routes>
        <Route path="/" element={<Home services={services} pandits={pandits} onBook={() => navigate('/book')} onFindPandit={() => navigate('/find-pandit')} />} />
        <Route path="/find-pandit" element={<FindPandit />} />
        <Route path="/pandit/:id" element={<PanditProfile />} />
        <Route path="/book" element={<BookingWizard />} />
        <Route path="/booking-confirmed" element={<BookingConfirmation />} />
        <Route path="/astrology" element={<Astrology />} />
        <Route path="/kundali/preview" element={<KundaliPreview />} />
        <Route path="/weddings" element={<Weddings />} />
        <Route path="/muhurat" element={<MuhuratCalculator />} />
        <Route path="/pandit/onboarding" element={<PanditOnboarding />} />
        <Route path="/pandit/dashboard" element={<PanditDashboard />} />
        <Route path="/pandit/plans" element={<PanditPlans />} />
        <Route path="/remedies" element={<RemediesMarketplace />} />
        <Route path="/dashboard" element={<Dashboard userName={user?.name} />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/review/:bookingId" element={<ReviewPage />} />
      </Routes>

      {/* Booking Modal (Simplified) */}
      <AnimatePresence>
        {isBookingModalOpen && selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-text-dark/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 text-center bg-gradient-to-br from-saffron to-gold text-white relative">
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
      <footer className="bg-text-dark text-white pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-saffron rounded-lg flex items-center justify-center text-white font-bold">B</div>
              <Link to="/"><h1 className="text-2xl font-bold text-saffron tracking-tight">BookPanditJi</h1></Link>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Preserving tradition, simplifying devotion. India's favorite digital gateway to spiritual peace.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-saffron transition-colors cursor-pointer">
                <Phone size={18} />
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-6">Our Services</h5>
            <ul className="space-y-4 text-white/60 text-sm">
              <li className="hover:text-saffron cursor-pointer">Havan & Puja</li>
              <li className="hover:text-saffron cursor-pointer">Astrology Charts</li>
              <li className="hover:text-saffron cursor-pointer">Vastu Shastra</li>
              <li className="hover:text-saffron cursor-pointer">Wedding Rituals</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-6">Company</h5>
            <ul className="space-y-4 text-white/60 text-sm">
              <li className="hover:text-saffron cursor-pointer">About Us</li>
              <li className="hover:text-saffron cursor-pointer">Verified Pandits</li>
              <li className="hover:text-saffron cursor-pointer">
                <Link to="/pandit/onboarding">Join as Pandit</Link>
              </li>
              <li className="hover:text-saffron cursor-pointer">Support</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-6">Download Our App</h5>
            <p className="text-white/60 text-sm mb-6">Get the BookPanditJi mobile experience for faster bookings.</p>
            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs font-bold">iOS</div>
                <div>
                  <div className="text-[10px] uppercase opacity-50 font-bold">Download on</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs font-bold">GP</div>
                <div>
                  <div className="text-[10px] uppercase opacity-50 font-bold">Get it on</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-white/5 text-xs text-white/30">
          © 2026 BookPanditJi Pvt Ltd. All rights reserved. Spiritual peace at your doorstep.
        </div>
      </footer>
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
