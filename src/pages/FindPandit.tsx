import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  MapPin, 
  Star, 
  CheckCircle, 
  Languages, 
  Calendar,
  Filter,
  ChevronDown,
  Clock,
  X
} from "lucide-react";
import { cn } from "../lib/utils.ts";

const cities = ["Delhi", "Noida", "Ghaziabad", "Meerut", "Mumbai", "Bangalore", "Jaipur", "Hyderabad"];
const services = ["Griha Pravesh", "Satyanarayan", "Rudrabhishek", "Navgraha Puja", "Lakshmi Puja", "Mundan", "Naamkaran", "Shradh", "Havan", "Marriage Puja"];
const languages = ["Hindi", "Sanskrit", "Tamil", "Telugu", "Kannada", "Bengali"];
const ratings = ["3+", "4+", "4.5+"];
const sortOptions = ["Relevance", "Rating", "Price: Low to High", "Price: High to Low"];

interface MockPandit {
  id: number;
  name: string;
  photo: string;
  photoUrl?: string;
  rating: number;
  reviews: number;
  experience: number;
  specializations: string[];
  languages: string[];
  price: number;
  distance: string;
  isFromDb?: boolean;
}

const mockPandits: MockPandit[] = [
  {
    id: 1,
    name: "Pandit Rajesh Shastri",
    photo: "🧘‍♂️",
    rating: 4.95,
    reviews: 248,
    experience: 18,
    specializations: ["Griha Pravesh", "Havan", "Vastu"],
    languages: ["Hindi", "Sanskrit"],
    price: 3100,
    distance: "2.3 km"
  },
  {
    id: 2,
    name: "Acharya Manoj Kumar",
    photo: "📿",
    rating: 4.80,
    reviews: 124,
    experience: 15,
    specializations: ["Marriage", "Navgraha Puja"],
    languages: ["Hindi", "Bengali"],
    price: 5100,
    distance: "4.1 km"
  },
  {
    id: 3,
    name: "Pandit Vishwanath Iyer",
    photo: "📔",
    rating: 4.90,
    reviews: 186,
    experience: 22,
    specializations: ["Rudrabhishek", "Satyanarayan"],
    languages: ["Tamil", "Sanskrit", "English"],
    price: 4500,
    distance: "1.8 km"
  },
  {
    id: 4,
    name: "Pandit Gajanand Mishra",
    photo: "🐚",
    rating: 4.75,
    reviews: 92,
    experience: 12,
    specializations: ["Mundan", "Naamkaran"],
    languages: ["Hindi", "Sanskrit"],
    price: 2500,
    distance: "3.5 km"
  },
  {
    id: 5,
    name: "Acharya Raghavan Swamy",
    photo: "🕉️",
    rating: 4.85,
    reviews: 156,
    experience: 20,
    specializations: ["Lakshmi Puja", "Havan"],
    languages: ["Telugu", "Kannada", "Hindi"],
    price: 3500,
    distance: "5.2 km"
  },
  {
    id: 6,
    name: "Pandit Suresh Pandey",
    photo: "🪔",
    rating: 4.70,
    reviews: 84,
    experience: 10,
    specializations: ["Shradh", "Satyanarayan"],
    languages: ["Hindi"],
    price: 2100,
    distance: "6.0 km"
  },
  {
    id: 7,
    name: "Pandit Anand Dubey",
    photo: "🧘",
    rating: 4.92,
    reviews: 210,
    experience: 16,
    specializations: ["Griha Pravesh", "Marriage Puja"],
    languages: ["Hindi", "Sanskrit"],
    price: 7500,
    distance: "1.2 km"
  },
  {
    id: 8,
    name: "Acharya Vinay Pathak",
    photo: "✨",
    rating: 4.65,
    reviews: 67,
    experience: 8,
    specializations: ["Navgraha Puja", "Havan"],
    languages: ["Hindi", "Marwadi"],
    price: 2800,
    distance: "8.4 km"
  }
];

let isFirstLoadSincePageReload = true;

export default function FindPandit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Detect if this specific mount is a document reload
  const checkReload = () => {
    if (!isFirstLoadSincePageReload) return false;
    isFirstLoadSincePageReload = false;
    
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        return (navEntries[0] as PerformanceNavigationTiming).type === "reload";
      }
    } catch (e) {}
    return typeof window !== "undefined" && window.performance && window.performance.navigation && window.performance.navigation.type === 1;
  };

  const wasReloaded = checkReload();

  const initialCity = wasReloaded ? "" : (searchParams.get("location") || "");
  const initialService = wasReloaded ? "" : (searchParams.get("ritual") || "");
  const initialDate = wasReloaded ? "" : (searchParams.get("date") || "");

  // Filter input state (what user picks in dropdowns)
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedLang, setSelectedLang] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("Relevance");
  const [isLoading, setIsLoading] = useState(true);
  const [dbPandits, setDbPandits] = useState<MockPandit[]>([]);
  const dateRef = useRef<HTMLInputElement>(null);

  // Fetch real registered pandits from backend
  useEffect(() => {
    fetch("/api/pandits")
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        if (!Array.isArray(data)) return;
        const mapped: MockPandit[] = data.map((p, i) => ({
          id: p.id,
          name: p.name,
          photo: "🧘",
          photoUrl: p.photoUrl || undefined,
          rating: p.rating ? parseFloat(String(p.rating)) : 4.5,
          reviews: 0,
          experience: p.experience || 0,
          specializations: Array.isArray(p.specializations) ? p.specializations : [],
          languages: Array.isArray(p.languages) ? p.languages : [],
          price: 2500 + i * 300,
          distance: `${(2 + i * 1.3).toFixed(1)} km`,
          isFromDb: true,
        }));
        setDbPandits(mapped);
      })
      .catch(() => {});
  }, []);

  // Merge DB pandits (shown first) with local mock pandits
  const allPandits = [
    ...dbPandits,
    ...mockPandits.filter(m => !dbPandits.some(d => d.id === m.id))
  ];

  // Derived filtered results — now live again
  const filteredPandits = allPandits
    .filter(p => {
      const matchesCity = !selectedCity || (selectedCity === "Delhi" ? p.id % 2 === 0 : p.id % 2 !== 0); // Mock logic for city
      const matchesService = !selectedService || p.specializations.some(s => s.toLowerCase().includes(selectedService.toLowerCase()));
      const matchesRating = !minRating || p.rating >= parseFloat(minRating.replace("+", ""));
      const matchesLang = !selectedLang || p.languages.includes(selectedLang);
      return matchesCity && matchesService && matchesRating && matchesLang;
    })
    .sort((a, b) => {
      if (sort === "Rating") {
        return b.rating - a.rating;
      }
      if (sort === "Price: Low to High") {
        return a.price - b.price;
      }
      if (sort === "Price: High to Low") {
        return b.price - a.price;
      }
      return 0; // Relevance
    });

  // Sync state to URL params for persistence on reload
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCity) params.set("location", selectedCity);
    if (selectedService) params.set("ritual", selectedService);
    if (selectedDate) params.set("date", selectedDate);
    
    // Use replace: true to avoid cluttering history
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedCity, selectedService, selectedDate, navigate]);

  const hasActiveFilters = !!(selectedCity || selectedService || selectedDate || selectedLang || minRating);

  const handleClearFilters = () => {
    setSelectedCity("");
    setSelectedService("");
    setSelectedDate("");
    setSelectedLang("");
    setMinRating("");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Sticky Filter Bar */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-saffron/10 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-full border border-saffron/5">
            <MapPin size={16} className="text-saffron" />
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-text-dark focus:ring-0 appearance-none cursor-pointer"
            >
              <option value="">Select Location</option>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            <ChevronDown size={14} className="text-text-dark/40" />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-full border border-saffron/5">
            <Filter size={16} className="text-saffron" />
            <select 
              value={selectedService} 
              onChange={(e) => setSelectedService(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-text-dark focus:ring-0 appearance-none cursor-pointer"
            >
              <option value="">All Services</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="text-text-dark/40" />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-full border border-saffron/5">
            <Languages size={16} className="text-saffron" />
            <select 
              value={selectedLang} 
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-text-dark focus:ring-0 appearance-none cursor-pointer"
            >
              <option value="">Any Language</option>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown size={14} className="text-text-dark/40" />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-full border border-saffron/5">
            <Star size={16} className="text-saffron" />
            <select 
              value={minRating} 
              onChange={(e) => setMinRating(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-text-dark focus:ring-0 appearance-none cursor-pointer"
            >
              <option value="">Min Rating</option>
              {ratings.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown size={14} className="text-text-dark/40" />
          </div>

          <div 
            onClick={() => { dateRef.current?.showPicker(); }}
            className="relative bg-slate-50 border border-saffron/5 rounded-full py-2.5 px-10 hover:bg-slate-100 transition-colors cursor-pointer overflow-hidden"
          >
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-saffron" />
            <input 
              ref={dateRef}
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, pointerEvents: 'none' }}
            />
            <div className="text-sm font-bold text-text-dark whitespace-nowrap">
              {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "Select Date"}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-white hover:bg-red-600 transition-all flex items-center gap-1.5 cursor-pointer bg-red-50 hover:shadow-lg hover:shadow-red-600/10 px-4 py-2.5 rounded-full border border-red-200"
            >
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-12 py-12">
        {/* Results Info */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-black text-text-dark">
              Showing <span className="text-saffron">{filteredPandits.length} pandits</span> in {selectedCity || "all cities"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-black uppercase tracking-widest text-text-dark/40">Sort By</span>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-saffron/10 rounded-xl py-2 px-4 text-sm font-bold shadow-sm focus:ring-0 appearance-none cursor-pointer"
            >
              {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence mode="wait">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-saffron/5 animate-pulse">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-100 rounded-full"></div>
                      <div className="h-3 w-24 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 w-full bg-slate-100 rounded-full"></div>
                    <div className="h-4 w-2/3 bg-slate-100 rounded-full"></div>
                  </div>
                  <div className="h-12 w-full bg-slate-100 rounded-2xl"></div>
                </div>
              ))
            ) : filteredPandits.length > 0 ? (
              filteredPandits.map((pandit, idx) => (
                <motion.div
                  key={pandit.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-saffron/5 border border-saffron/5 hover:border-saffron/20 transition-all flex flex-col h-full group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-saffron/5 rounded-full flex items-center justify-center text-3xl border-2 border-saffron/10 shadow-inner overflow-hidden group-hover:scale-110 transition-transform relative">
                        {pandit.photoUrl
                          ? <img src={pandit.photoUrl} alt={pandit.name} className="w-full h-full object-cover rounded-full" />
                          : pandit.photo
                        }
                        {pandit.isFromDb && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" title="Registered Pandit" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text-dark mb-1">{pandit.name}</h3>
                        <div className="flex items-center gap-1.5 text-green-500 bg-green-50 px-2 py-0.5 rounded-full w-fit">
                          <CheckCircle size={12} fill="currentColor" className="text-white" />
                          <span className="text-[10px] font-black uppercase tracking-wider">KYC & Aadhaar Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gold">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-black">{pandit.rating}</span>
                      <span className="text-[10px] text-text-dark/40 font-bold">({pandit.reviews})</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="inline-flex items-center bg-orange-50 text-saffron px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-saffron/10">
                      <Clock size={12} className="mr-1.5" />
                      {pandit.experience}+ Years of Sadhana
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pandit.specializations.map(spec => (
                        <span key={spec} className="px-3 py-1 bg-slate-50 text-text-dark/60 text-[10px] font-bold rounded-full border border-slate-100 italic">
                          {spec}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-text-dark/50 text-[11px] font-medium">
                      <Languages size={14} className="text-saffron/60" />
                      Spoken: {pandit.languages.join(", ")}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-dashed border-saffron/10 flex items-end justify-between mb-8">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/40 mb-1">Starting Price</div>
                      <div className="text-2xl font-black text-text-dark">₹{pandit.price.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-dark/50 text-xs font-bold">
                      <MapPin size={14} className="text-saffron" />
                      {pandit.distance} away
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Link to={`/pandit/${pandit.id}`} className="py-3.5 rounded-2xl border-2 border-text-dark/5 text-text-dark/60 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center">
                      View Profile
                    </Link>
                    <Link to={`/book`} className="py-3.5 rounded-2xl bg-saffron text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-saffron/20 hover:shadow-xl hover:shadow-saffron/40 hover:bg-text-dark transition-all flex items-center justify-center">
                      Book Now
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
                <div className="text-4xl mb-4">🕉️</div>
                <h3 className="text-xl font-bold text-text-dark mb-2">No Pandits Found</h3>
                <p className="text-text-dark/40 italic">Try adjusting your filters to discover more Acharyas.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Load More */}
        <div className="flex justify-center">
          <button className="px-10 py-5 bg-white border border-saffron/20 text-saffron font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-saffron hover:text-white transition-all shadow-xl shadow-saffron/5">
            Load More Pandits
          </button>
        </div>
      </main>

      {/* Trust Quote */}
      <section className="bg-text-dark py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl text-saffron/20 font-decorative mb-4">"</div>
          <p className="text-2xl md:text-3xl text-white/90 font-medium italic mb-8 leading-relaxed">
            Purity in rituals is the key to spiritual elevation. We ensure every ceremony is performed following authentic Vedic paramapara.
          </p>
          <div className="h-1 w-20 bg-saffron mx-auto"></div>
        </div>
      </section>
    </div>
  );
}
