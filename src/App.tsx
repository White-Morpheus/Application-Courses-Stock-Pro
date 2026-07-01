import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  AlertTriangle,
  Check,
  Share2,
  Clipboard,
  PlusCircle,
  ChevronUp,
  ChevronDown,
  Camera,
  FileText,
  BarChart2,
  Calendar,
  Settings,
  User,
  X,
  Loader2,
  RefreshCw,
  Info,
  CheckSquare,
  Sparkles,
  ArrowRightLeft,
  LayoutDashboard,
  TrendingUp,
  Clock,
  ArrowUpDown,
  SlidersHorizontal
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// ==========================================
// OUTILS ET FONCTIONS UTILITAIRES POUR IMAGES
// ==========================================

const handleUploadBase64 = (file: File, callback: (base64: string) => void) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result as string);
  };
  reader.readAsDataURL(file);
};

const renderItemIcon = (emoji: string, imageUrl?: string, className = "w-8 h-8 flex items-center justify-center shrink-0 text-base bg-white border border-slate-100 rounded-lg shadow-sm") => {
  if (imageUrl && imageUrl.trim()) {
    return (
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0 overflow-hidden rounded-lg bg-white shadow-sm border border-slate-100">
        <img
          src={imageUrl}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback) (fallback as HTMLElement).classList.remove("hidden");
          }}
        />
        <span className={`${className} hidden`}>{emoji}</span>
      </div>
    );
  }
  return <span className={className}>{emoji}</span>;
};

// Composant de sélection d'icône unifié (Emoji ou Image)
const IconPicker = ({
  emoji,
  imageUrl,
  onChange,
  accentColor = "emerald"
}: {
  emoji: string;
  imageUrl?: string;
  onChange: (emoji: string, imageUrl?: string) => void;
  accentColor?: "emerald" | "amber";
}) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'image'>(
    imageUrl && imageUrl.trim() ? 'image' : 'emoji'
  );

  useEffect(() => {
    if (imageUrl && imageUrl.trim()) {
      setActiveTab('image');
    } else {
      setActiveTab('emoji');
    }
  }, [imageUrl]);

  const activeBg = accentColor === "emerald" ? "bg-emerald-600 text-white" : "bg-amber-500 text-white";
  const ringColor = accentColor === "emerald" ? "focus:ring-emerald-500" : "focus:ring-amber-500";

  return (
    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3 space-y-3">
      <div className="flex gap-3 items-center">
        {/* Aperçu de l'icône */}
        <div className="shrink-0">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 text-center">Aperçu</label>
          {renderItemIcon(emoji || "📦", imageUrl, "w-11 h-11 flex items-center justify-center text-xl bg-white border border-slate-200 rounded-xl shadow-sm")}
        </div>

        {/* Sélection de l'onglet */}
        <div className="flex-1 space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase">Type d'Icône</label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('emoji');
                onChange(emoji || "📦", "");
              }}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition ${
                activeTab === 'emoji' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              😀 Emoji
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('image');
                onChange(emoji || "📦", imageUrl || "");
              }}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition ${
                activeTab === 'image' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🖼️ Image
            </button>
          </div>
        </div>
      </div>

      {/* Zone de contenu de l'onglet actif */}
      <div className="pt-1 border-t border-slate-100">
        {activeTab === 'emoji' ? (
          <div className="space-y-2">
            <label className="block text-[9px] font-bold text-slate-400 uppercase">Saisir ou choisir un Emoji</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                maxLength={2}
                value={emoji}
                onChange={(e) => onChange(e.target.value, "")}
                placeholder="📦"
                className={`w-12 text-center text-xl bg-white border border-slate-200 rounded-xl py-1.5 focus:ring-1 focus:outline-none font-bold ${ringColor}`}
              />
              <div className="flex flex-wrap gap-1">
                {["🍎", "🥦", "🥩", "🧀", "🍞", "🥛", "🥤", "🧼", "🧴", "❄️", "🍳", "📦"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onChange(preset, "")}
                    className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-150 rounded-lg shadow-sm text-sm transition hover:scale-110 active:scale-95"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-[9px] font-bold text-slate-400 uppercase">Adresse URL ou Importer un fichier</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="https://example.com/image.png"
                value={imageUrl || ""}
                onChange={(e) => onChange(emoji, e.target.value)}
                className={`flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none min-w-0 font-medium ${ringColor}`}
              />
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-slate-600 shrink-0 transition flex items-center gap-1 shadow-sm">
                📁 Importer
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleUploadBase64(file, (base64) => {
                        onChange(emoji, base64);
                      });
                    }
                  }}
                />
              </label>
            </div>
            {imageUrl && (
              <button
                type="button"
                onClick={() => onChange(emoji, "")}
                className="text-rose-500 text-[10px] font-bold hover:underline block ml-auto"
              >
                Réinitialiser l'image (Retour à l'emoji)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// TYPES ET INTERFACES (Pour structurer nos données)
// ==========================================

export interface ExpiryDate {
  date: string;
  quantity: number;
}

export interface StockLocation {
  id: string;
  name: string;
  emoji: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  emoji: string;
  category: string; // ID de la catégorie
  stockLocation?: string; // ID du lieu de stockage (ex: frigo, cave, etc.)
  quantity: number; // Quantité en stock
  minQuantity: number; // Seuil d'alerte minimum
  unit: string; // Unité (L, kg, g, pièces, paquets)
  price: number; // Prix unitaire estimé
  expiryDates: ExpiryDate[]; // Dates de péremption du produit
  lastBoughtTimes: number; // Compteur pour les statistiques
  totalExpenses: number; // Dépenses cumulées sur ce produit
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  order: number;
  imageUrl?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  user: string;
  totalPrice: number;
  itemsCount: number;
  items: Array<{
    name: string;
    emoji: string;
    quantity: number;
    price: number;
  }>;
}

export interface LogEntry {
  user: string;
  date: string;
  details: string;
}

export interface ListData {
  id: string;
  name: string;
  products: Product[];
  categories: Category[];
  stockLocations?: StockLocation[]; // Lieux de stockage de la liste
  history: HistoryItem[];
  logs: LogEntry[];
  lastModifiedAt: string;
  lastModifiedBy: string;
  users?: string[];
}

const DEFAULT_USERS_LIST = ["Lucas", "Marie", "Sophie", "Thomas", "Emma"];

const CLIENT_DEFAULT_STOCK_LOCATIONS: StockLocation[] = [
  { id: "cuisine", name: "Cuisine (Général)", emoji: "🍳" },
  { id: "frigo", name: "Réfrigérateur", emoji: "🥛" },
  { id: "congelo", name: "Congélateur", emoji: "❄️" },
  { id: "placard", name: "Placard / Épicerie", emoji: "🥫" },
  { id: "cave", name: "Cave / Cellier", emoji: "🍾" }
];
const PRESET_USER_COLORS: Record<string, string> = {
  Lucas: "bg-blue-500 text-white border-blue-600",
  Marie: "bg-pink-500 text-white border-pink-600",
  Sophie: "bg-purple-500 text-white border-purple-600",
  Thomas: "bg-amber-500 text-white border-amber-600",
  Emma: "bg-indigo-500 text-white border-indigo-600"
};

const CLIENT_DEFAULT_CATEGORIES = [
  { id: "fruits-legumes", name: "Fruits & Légumes", emoji: "🥦", order: 0 },
  { id: "produits-laitiers", name: "Produits Laitiers", emoji: "🥛", order: 1 },
  { id: "epicerie-salee", name: "Épicerie Salée", emoji: "🥫", order: 2 },
  { id: "epicerie-sucree", name: "Épicerie Sucrée", emoji: "🍫", order: 3 },
  { id: "boissons", name: "Boissons", emoji: "🥤", order: 4 },
  { id: "viandes-poissons", name: "Viandes & Poissons", emoji: "🥩", order: 5 },
  { id: "entretien-maison", name: "Entretien & Maison", emoji: "🧼", order: 6 },
  { id: "hygiene-beaute", name: "Hygiène & Beauté", emoji: "🧴", order: 7 },
  { id: "autre", name: "Autre", emoji: "📦", order: 8 }
];

const CLIENT_DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Lait Demi-écrémé",
    emoji: "🥛",
    category: "produits-laitiers",
    quantity: 3,
    minQuantity: 2,
    unit: "L",
    price: 1.15,
    expiryDates: [
      { date: "2026-07-05", quantity: 2 },
      { date: "2026-07-15", quantity: 1 }
    ],
    lastBoughtTimes: 3,
    totalExpenses: 5.75
  },
  {
    id: "prod-2",
    name: "Pommes Gala",
    emoji: "🍎",
    category: "fruits-legumes",
    quantity: 1,
    minQuantity: 4,
    unit: "pièces",
    price: 0.40,
    expiryDates: [
      { date: "2026-07-08", quantity: 1 }
    ],
    lastBoughtTimes: 8,
    totalExpenses: 6.40
  },
  {
    id: "prod-3",
    name: "Pâtes Penne Rigate",
    emoji: "🍝",
    category: "epicerie-salee",
    quantity: 1.5,
    minQuantity: 1,
    unit: "kg",
    price: 1.80,
    expiryDates: [
      { date: "2027-12-01", quantity: 1.5 }
    ],
    lastBoughtTimes: 4,
    totalExpenses: 7.20
  },
  {
    id: "prod-4",
    name: "Yaourts Nature x4",
    emoji: "🥣",
    category: "produits-laitiers",
    quantity: 1,
    minQuantity: 2,
    unit: "paquets",
    price: 1.45,
    expiryDates: [
      { date: "2026-07-01", quantity: 1 }
    ],
    lastBoughtTimes: 12,
    totalExpenses: 17.40
  },
  {
    id: "prod-5",
    name: "Jambon Cuit sans Couenne",
    emoji: "🥩",
    category: "viandes-poissons",
    quantity: 0,
    minQuantity: 1,
    unit: "paquets",
    price: 2.89,
    expiryDates: [],
    lastBoughtTimes: 5,
    totalExpenses: 14.45
  }
];

export default function App() {
  // ==========================================
  // ÉTATS GLOBAUX DE L'APPLICATION
  // ==========================================
  
  // Utilisateur actif & Synchronisation
  const [currentUser, setCurrentUser] = useState<string>(() => {
    return localStorage.getItem("pantry_user") || "Lucas";
  });
  const [users, setUsers] = useState<string[]>(DEFAULT_USERS_LIST);
  const [listId, setListId] = useState<string>(() => {
    // Permet de créer/partager des listes via le hash de l'URL (ex: #famille-smith)
    const hash = window.location.hash.replace("#", "");
    return hash || "default";
  });
  
  // États de données (chargés depuis le serveur)
  const [listName, setListName] = useState<string>("Ma Liste de Courses");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stockLocations, setStockLocations] = useState<StockLocation[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastModifiedAt, setLastModifiedAt] = useState<string>("");
  const [lastModifiedBy, setLastModifiedBy] = useState<string>("");

  // États pour les listes et stocks multiples
  interface ListSummary { id: string; name: string; lastModifiedAt: string; lastModifiedBy: string; itemsCount: number }
  const [allLists, setAllLists] = useState<ListSummary[]>([]);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState<boolean>(false);
  const [isStockLocationModalOpen, setIsStockLocationModalOpen] = useState<boolean>(false);
  const [newWorkspaceId, setNewWorkspaceId] = useState<string>("");
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>("");
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>("all");

  // UI / Navigation & Filtres
  const [activeMainTab, setActiveMainTab] = useState<"overview" | "inventory" | "stats" | "expiry" | "reglage">("overview");
  const [productSortBy, setProductSortBy] = useState<string>("name-asc");
  const [statsPeriod, setStatsPeriod] = useState<"month" | "year" | "all">("month");
  
  const [expiryThresholdUrgent, setExpiryThresholdUrgent] = useState<number>(() => {
    return Number(localStorage.getItem("pantry_expiry_threshold_urgent") || "3");
  });
  const [expiryThresholdAttention, setExpiryThresholdAttention] = useState<number>(() => {
    return Number(localStorage.getItem("pantry_expiry_threshold_attention") || "7");
  });

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryForm, setEditCategoryForm] = useState({ name: "", emoji: "", imageUrl: "" });

  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  // États de l'onglet Réglages
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("📦");
  const [newCatImageUrl, setNewCatImageUrl] = useState("");
  const [newLocName, setNewLocName] = useState("");
  const [newLocEmoji, setNewLocEmoji] = useState("🧴");
  const [newLocImageUrl, setNewLocImageUrl] = useState("");
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [editLocForm, setEditLocForm] = useState({ name: "", emoji: "", imageUrl: "" });
  const [searchQueryReglage, setSearchQueryReglage] = useState("");
  const [selectedReglageProductIds, setSelectedReglageProductIds] = useState<string[]>([]);
  
  // États de l'ajout en lot (Bulk Add)
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [bulkAddStep, setBulkAddStep] = useState<"input" | "edit">("input");
  const [bulkAddDrafts, setBulkAddDrafts] = useState<Product[]>([]);
  const [bulkAddText, setBulkAddText] = useState("");
  const [bulkAddCategory, setBulkAddCategory] = useState("autre");
  const [bulkAddStockLocation, setBulkAddStockLocation] = useState("cuisine");
  const [bulkAddQuantity, setBulkAddQuantity] = useState(1);
  const [bulkAddUnit, setBulkAddUnit] = useState("pièces");
  
  // États de la sélection des utilisateurs
  const [userModalTab, setUserModalTab] = useState<"select" | "parameters">("select");
  const [newUserName, setNewUserName] = useState("");
  const [userToDeleteConfirm, setUserToDeleteConfirm] = useState<string | null>(null);

  const getUserColor = (username: string) => {
    const presetColors: Record<string, string> = {
      Lucas: "bg-blue-500 text-white border-blue-600",
      Marie: "bg-pink-500 text-white border-pink-600",
      Sophie: "bg-purple-500 text-white border-purple-600",
      Thomas: "bg-amber-500 text-white border-amber-600",
      Emma: "bg-indigo-500 text-white border-indigo-600"
    };
    if (presetColors[username]) return presetColors[username];
    
    const altColors = [
      "bg-emerald-500 text-white border-emerald-600",
      "bg-teal-500 text-white border-teal-600",
      "bg-cyan-500 text-white border-cyan-600",
      "bg-violet-500 text-white border-violet-600",
      "bg-fuchsia-500 text-white border-fuchsia-600",
      "bg-rose-500 text-white border-rose-600",
      "bg-orange-500 text-white border-orange-600",
    ];
    let sum = 0;
    for (let i = 0; i < username.length; i++) {
      sum += username.charCodeAt(i);
    }
    return altColors[sum % altColors.length];
  };
  
  // Modals et Formulaires
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Scanner d'appareil photo / Téléchargement IA
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannerType, setScannerType] = useState<"receipt" | "list">("receipt");
  const [scannedImageBase64, setScannedImageBase64] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [aiPreviewProducts, setAiPreviewProducts] = useState<any[]>([]);
  const [showAiPreviewModal, setShowAiPreviewModal] = useState<boolean>(false);
  
  // Formulaire d'édition / création de produit temporaire
  const [prodForm, setProdForm] = useState({
    name: "",
    emoji: "📦",
    category: "autre",
    quantity: 1,
    minQuantity: 1,
    unit: "pièces",
    price: 0,
    expiryDates: [] as ExpiryDate[],
    imageUrl: ""
  });
  
  // Formulaire d'ajout de date de péremption temporaire (dans l'édition)
  const [tempExpiry, setTempExpiry] = useState({
    date: "",
    quantity: 1
  });

  // Référence de l'input caméra
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  // Éviter d'écraser la saisie en cours lors des sondages (polling)
  const isEditingRef = useRef<boolean>(false);

  // Sauvegarder l'utilisateur dans le stockage local
  useEffect(() => {
    localStorage.setItem("pantry_user", currentUser);
  }, [currentUser]);

  // Sauvegarder les seuils de péremption configurables
  useEffect(() => {
    localStorage.setItem("pantry_expiry_threshold_urgent", expiryThresholdUrgent.toString());
  }, [expiryThresholdUrgent]);

  useEffect(() => {
    localStorage.setItem("pantry_expiry_threshold_attention", expiryThresholdAttention.toString());
  }, [expiryThresholdAttention]);

  // Écouter le changement de hash dans l'URL pour changer de liste
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setListId(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Écouter l'événement beforeinstallprompt pour capturer l'installation native PWA (Android / Chrome)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("[PWA] beforeinstallprompt capturé avec succès.");
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // ==========================================
  // SYNCHRONISATION EN TEMPS RÉEL (Polling)
  // ==========================================
  
  // Charger les données de la liste
  const fetchList = async (showLoader = false) => {
    if (
      isEditingRef.current ||
      isProductModalOpen ||
      isBulkAddModalOpen ||
      isCategoryModalOpen ||
      isUserModalOpen ||
      isStockLocationModalOpen ||
      isWorkspaceModalOpen ||
      showAiPreviewModal ||
      editingCategoryId !== null ||
      editingLocId !== null ||
      (document.activeElement && (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.tagName === "SELECT"
      ))
    ) {
      return; // Ne pas interrompre l'utilisateur pendant qu'il édite
    }
    if (showLoader) setIsSyncing(true);
    
    try {
      const res = await fetch(`/api/lists/${listId}`);
      if (!res.ok) throw new Error("Erreur de connexion avec le serveur.");
      const data: ListData = await res.json();
      
      setListName(data.name);
      setProducts(data.products || []);
      // Trier les catégories selon leur ordre
      const sortedCats = (data.categories || []).sort((a, b) => a.order - b.order);
      setCategories(sortedCats);
      setStockLocations(data.stockLocations || CLIENT_DEFAULT_STOCK_LOCATIONS);
      setHistory(data.history || []);
      setLogs(data.logs || []);
      setLastModifiedAt(data.lastModifiedAt || "");
      setLastModifiedBy(data.lastModifiedBy || "");
      if (data.users && data.users.length > 0) {
        setUsers(data.users);
      }
      setSyncError(null);

      // Sauvegarder dans localStorage pour un futur usage hors-ligne
      localStorage.setItem(`pantry_list_${listId}`, JSON.stringify(data));
    } catch (err: any) {
      console.warn("Échec de la récupération des données en ligne, bascule sur le cache local :", err);
      
      // Tentative de récupération depuis localStorage
      const cached = localStorage.getItem(`pantry_list_${listId}`);
      if (cached) {
        try {
          const data: ListData = JSON.parse(cached);
          setListName(data.name);
          setProducts(data.products || []);
          const sortedCats = (data.categories || []).sort((a, b) => a.order - b.order);
          setCategories(sortedCats);
          setStockLocations(data.stockLocations || CLIENT_DEFAULT_STOCK_LOCATIONS);
          setHistory(data.history || []);
          setLogs(data.logs || []);
          setLastModifiedAt(data.lastModifiedAt || "");
          setLastModifiedBy(data.lastModifiedBy || "");
          if (data.users && data.users.length > 0) {
            setUsers(data.users);
          }
          // Note informative plutôt qu'une erreur bloquante
          setSyncError("Mode local hors-ligne actif. Données lues depuis le cache du navigateur.");
        } catch (parseErr) {
          console.error("Échec du parsing du cache local :", parseErr);
        }
      } else {
        // Initialiser avec les données de démonstration par défaut s'il n'y a aucun cache
        const fallbackData: ListData = {
          id: listId,
          name: listId === "default" ? "Ma Liste de Courses" : `Liste : ${listId}`,
          products: CLIENT_DEFAULT_PRODUCTS,
          categories: CLIENT_DEFAULT_CATEGORIES,
          stockLocations: CLIENT_DEFAULT_STOCK_LOCATIONS,
          history: [],
          logs: [{
            user: "Système",
            date: new Date().toISOString(),
            details: "Initialisation automatique de la liste locale hors-ligne."
          }],
          lastModifiedAt: new Date().toISOString(),
          lastModifiedBy: "Système",
          users: DEFAULT_USERS_LIST
        };

        setListName(fallbackData.name);
        setProducts(fallbackData.products);
        setCategories(fallbackData.categories);
        setStockLocations(fallbackData.stockLocations || CLIENT_DEFAULT_STOCK_LOCATIONS);
        setHistory(fallbackData.history);
        setLogs(fallbackData.logs);
        setLastModifiedAt(fallbackData.lastModifiedAt);
        setLastModifiedBy(fallbackData.lastModifiedBy);
        setUsers(fallbackData.users);

        localStorage.setItem(`pantry_list_${listId}`, JSON.stringify(fallbackData));
        setSyncError("Application initialisée localement (mode hors-ligne ou serveur indisponible).");
      }
    } finally {
      if (showLoader) setIsSyncing(false);
    }
  };

  // Charger au démarrage et configurer un intervalle de rafraîchissement (polling)
  useEffect(() => {
    fetchList(true);
    const interval = setInterval(() => {
      fetchList(false);
    }, 4000); // Polling toutes les 4 secondes
    return () => clearInterval(interval);
  }, [listId]);

  // Charger la liste globale des listes de courses et de stocks
  const fetchAllLists = async () => {
    try {
      const res = await fetch("/api/lists");
      if (res.ok) {
        const data = await res.json();
        setAllLists(data);
      }
    } catch (err) {
      console.warn("Échec de chargement des listes de stocks :", err);
    }
  };

  useEffect(() => {
    fetchAllLists();
  }, [listId]);

  // Persister l'utilisateur courant localement
  useEffect(() => {
    localStorage.setItem("pantry_user", currentUser);
  }, [currentUser]);

  // Réinitialiser la confirmation de suppression à la fermeture du modal ou changement d'onglet
  useEffect(() => {
    if (!isUserModalOpen) {
      setUserToDeleteConfirm(null);
    }
  }, [isUserModalOpen, userModalTab]);

  // Sauvegarder l'état mis à jour sur le serveur
  const saveToServer = async (
    updatedProducts: Product[],
    updatedCategories: Category[],
    updatedHistory: HistoryItem[],
    actionDetail: string,
    updatedUsersList?: string[],
    updatedStockLocations?: StockLocation[]
  ) => {
    setIsSyncing(true);
    
    // Créer une nouvelle ligne de journal d'activité
    const newLogEntry: LogEntry = {
      user: currentUser,
      date: new Date().toISOString(),
      details: actionDetail
    };
    
    const updatedLogs = [newLogEntry, ...logs].slice(0, 50); // Garder les 50 derniers logs
    const finalUsers = updatedUsersList || users;
    const finalStockLocations = updatedStockLocations || stockLocations;

    const payload: ListData = {
      id: listId,
      name: listName,
      products: updatedProducts,
      categories: updatedCategories,
      stockLocations: finalStockLocations,
      history: updatedHistory,
      logs: updatedLogs,
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: currentUser,
      users: finalUsers
    };

    // 1. Sauvegarde instantanée et locale pour une réactivité maximale (Optimistic UI)
    localStorage.setItem(`pantry_list_${listId}`, JSON.stringify(payload));
    setProducts(updatedProducts);
    setCategories(updatedCategories.sort((a, b) => a.order - b.order));
    setStockLocations(finalStockLocations);
    setHistory(updatedHistory);
    setLogs(updatedLogs);
    setLastModifiedAt(payload.lastModifiedAt);
    setLastModifiedBy(currentUser);
    setUsers(finalUsers);

    // 2. Tenter d'enregistrer sur le serveur d'API
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Impossible d'enregistrer les données sur le serveur.");
      const data: ListData = await res.json();
      
      // Mettre à jour avec les dernières données du serveur (en cas de modifications concurrentes)
      setProducts(data.products);
      setCategories(data.categories.sort((a, b) => a.order - b.order));
      setStockLocations(data.stockLocations || finalStockLocations);
      setHistory(data.history);
      setLogs(data.logs);
      setLastModifiedAt(data.lastModifiedAt);
      setLastModifiedBy(data.lastModifiedBy);
      if (data.users && data.users.length > 0) {
        setUsers(data.users);
      }
      setSyncError(null);
    } catch (err: any) {
      console.warn("Échec d'enregistrement sur le serveur, sauvegardé uniquement en local :", err);
      setSyncError("Modifications enregistrées localement dans le navigateur (serveur hors-ligne).");
    } finally {
      setIsSyncing(false);
    }
  };

  // ==========================================
  // LOGIQUE MÉTIER PRINCIPALE (Stock & Liste)
  // ==========================================

  // 1. Liste de courses intelligente - Génération conditionnelle
  // Un produit est auto-généré s'il tombe en dessous de son seuil (quantity < minQuantity)
  // La quantité suggérée à acheter est la différence nécessaire pour repasser au maximum (minQuantity) ou au moins +1
  const shoppingListItems = products.filter((p) => {
    // Règle conditionnelle stricte d'auto-ajout : quantité actuelle < seuil d'alerte
    return p.quantity < p.minQuantity;
  }).map((p) => {
    const quantityToBuy = Math.ceil(p.minQuantity - p.quantity);
    const estimatedPrice = quantityToBuy * (p.price || 0);
    return {
      product: p,
      quantityToBuy,
      estimatedPrice
    };
  });

  // Calcul du prix total estimé de la liste de courses
  const totalEstimatedShoppingPrice = shoppingListItems.reduce(
    (acc, item) => acc + item.estimatedPrice,
    0
  );

  // 2. Validation d'un achat dans la liste de courses
  // Cette action incrémente automatiquement le stock du produit concerné
  const handleValidatePurchase = async (productId: string, boughtQty: number) => {
    const productToUpdate = products.find((p) => p.id === productId);
    if (!productToUpdate) return;

    // Logique if/else de mise à jour des stocks
    const oldQty = productToUpdate.quantity;
    const newQty = oldQty + boughtQty;
    
    // Mettre à jour le produit
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          quantity: newQty,
          lastBoughtTimes: (p.lastBoughtTimes || 0) + 1,
          totalExpenses: (p.totalExpenses || 0) + (boughtQty * (p.price || 0))
        };
      }
      return p;
    });

    const detailText = `Achat validé : +${boughtQty} ${productToUpdate.unit} de ${productToUpdate.emoji} ${productToUpdate.name} (Stock passe de ${oldQty} à ${newQty})`;
    
    // Sauvegarde en temps réel
    await saveToServer(updatedProducts, categories, history, detailText);
  };

  // Validation globale de toute la liste de courses d'un coup
  const handleValidateAllShoppingList = async () => {
    if (shoppingListItems.length === 0) return;

    let totalTripCost = 0;
    const boughtItemsForHistory: any[] = [];

    const updatedProducts = products.map((p) => {
      const match = shoppingListItems.find((item) => item.product.id === p.id);
      if (match) {
        totalTripCost += match.estimatedPrice;
        boughtItemsForHistory.push({
          name: p.name,
          emoji: p.emoji,
          quantity: match.quantityToBuy,
          price: p.price
        });
        return {
          ...p,
          quantity: p.quantity + match.quantityToBuy,
          lastBoughtTimes: (p.lastBoughtTimes || 0) + 1,
          totalExpenses: (p.totalExpenses || 0) + match.estimatedPrice
        };
      }
      return p;
    });

    // Ajouter un élément à l'historique de courses
    const newHistoryItem: HistoryItem = {
      id: "hist-" + Date.now(),
      date: new Date().toISOString(),
      user: currentUser,
      totalPrice: Number(totalTripCost.toFixed(2)),
      itemsCount: boughtItemsForHistory.length,
      items: boughtItemsForHistory
    };

    const updatedHistory = [newHistoryItem, ...history];
    const detailText = `Validation globale de la liste de courses : ${boughtItemsForHistory.length} articles achetés pour un montant de ${totalTripCost.toFixed(2)}€`;

    await saveToServer(updatedProducts, categories, updatedHistory, detailText);
  };

  // 3. Gestion de Stock : Ajouter ou Modifier un produit
  const handleOpenAddProduct = () => {
    isEditingRef.current = true;
    setEditingProduct(null);
    setProdForm({
      name: "",
      emoji: "📦",
      category: categories[0]?.id || "autre",
      stockLocation: stockLocations[0]?.id || "cuisine",
      quantity: 1,
      minQuantity: 1,
      unit: "pièces",
      price: 0.99,
      expiryDates: [],
      imageUrl: ""
    });
    setTempExpiry({ date: "", quantity: 1 });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    isEditingRef.current = true;
    setEditingProduct(product);
    setProdForm({
      name: product.name || "",
      emoji: product.emoji || "📦",
      category: product.category || "autre",
      stockLocation: product.stockLocation || stockLocations[0]?.id || "cuisine",
      quantity: product.quantity !== undefined && product.quantity !== null ? product.quantity : 1,
      minQuantity: product.minQuantity !== undefined && product.minQuantity !== null ? product.minQuantity : 1,
      unit: product.unit || "pièces",
      price: product.price || 0,
      expiryDates: product.expiryDates || [],
      imageUrl: product.imageUrl || ""
    });
    setTempExpiry({ date: "", quantity: 1 });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;

    let updatedProducts: Product[];
    let actionDetail = "";

    if (editingProduct) {
      // Modification d'un produit existant
      updatedProducts = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: prodForm.name.trim(),
            emoji: prodForm.emoji,
            category: prodForm.category,
            stockLocation: prodForm.stockLocation,
            quantity: Number(prodForm.quantity),
            minQuantity: Number(prodForm.minQuantity),
            unit: prodForm.unit,
            price: Number(prodForm.price),
            expiryDates: prodForm.expiryDates,
            imageUrl: prodForm.imageUrl
          };
        }
        return p;
      });
      actionDetail = `Modification du produit ${prodForm.emoji} ${prodForm.name}`;
    } else {
      // Création d'un nouveau produit
      const newProduct: Product = {
        id: "prod-" + Date.now(),
        name: prodForm.name.trim(),
        emoji: prodForm.emoji,
        category: prodForm.category,
        stockLocation: prodForm.stockLocation,
        quantity: Number(prodForm.quantity),
        minQuantity: Number(prodForm.minQuantity),
        unit: prodForm.unit,
        price: Number(prodForm.price),
        expiryDates: prodForm.expiryDates,
        lastBoughtTimes: 0,
        totalExpenses: 0,
        imageUrl: prodForm.imageUrl
      };
      updatedProducts = [...products, newProduct];
      actionDetail = `Ajout d'un nouveau produit au stock : ${prodForm.emoji} ${prodForm.name}`;
    }

    await saveToServer(updatedProducts, categories, history, actionDetail);
    setIsProductModalOpen(false);
    isEditingRef.current = false;
  };

  const handleDeleteProduct = async (productId: string) => {
    const item = products.find((p) => p.id === productId);
    if (!item) return;

    if (confirm(`Voulez-vous vraiment supprimer ${item.emoji} ${item.name} du stock ?`)) {
      const updatedProducts = products.filter((p) => p.id !== productId);
      const detailText = `Suppression du produit ${item.emoji} ${item.name} du stock`;
      await saveToServer(updatedProducts, categories, history, detailText);
    }
  };

  // 4. Catégories : Ajouter, Modifier, Réordonner
  const handleAddCategory = async () => {
    const name = prompt("Nom de la nouvelle catégorie :");
    if (!name || !name.trim()) return;
    const emoji = prompt("Emoji pour cette catégorie :", "📦") || "📦";

    const newId = name.trim().toLowerCase().replace(/\s+/g, "-");
    const existing = categories.find((c) => c.id === newId);
    if (existing) {
      alert("Une catégorie portant ce nom existe déjà.");
      return;
    }

    const newCat: Category = {
      id: newId,
      name: name.trim(),
      emoji,
      order: categories.length
    };

    const updatedCats = [...categories, newCat];
    const detailText = `Création de la catégorie d'articles : ${emoji} ${name}`;
    await saveToServer(products, updatedCats, history, detailText);
  };

  const handleMoveCategory = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const updatedCats = [...categories];
    // Échange des ordres d'affichage
    const tempOrder = updatedCats[index].order;
    updatedCats[index].order = updatedCats[targetIndex].order;
    updatedCats[targetIndex].order = tempOrder;

    // Trier pour préserver la cohérence locale
    updatedCats.sort((a, b) => a.order - b.order);

    const detailText = `Changement de l'ordre des catégories d'affichage`;
    await saveToServer(products, updatedCats, history, detailText);
  };

  const handleDeleteCategory = async (catId: string) => {
    if (catId === "autre") {
      alert("La catégorie 'Autre' ne peut pas être supprimée.");
      return;
    }

    const linkedProducts = products.filter((p) => p.category === catId);
    const catName = categories.find((c) => c.id === catId)?.name || catId;

    if (confirm(`Voulez-vous supprimer la catégorie "${catName}" ? Les ${linkedProducts.length} produits liés seront déplacés vers "Autre".`)) {
      // Déplacer les produits vers 'autre'
      const updatedProducts = products.map((p) => {
        if (p.category === catId) {
          return { ...p, category: "autre" };
        }
        return p;
      });

      const updatedCats = categories.filter((c) => c.id !== catId).map((c, i) => ({
        ...c,
        order: i
      }));

      const detailText = `Suppression de la catégorie : ${catName}`;
      await saveToServer(updatedProducts, updatedCats, history, detailText);
    }
  };

  const handleEditCategory = async (catId: string, name: string, emoji: string, imageUrl?: string) => {
    if (!name.trim()) {
      alert("Le nom de la catégorie ne peut pas être vide.");
      return;
    }
    const updatedCats = categories.map((c) => {
      if (c.id === catId) {
        return { ...c, name: name.trim(), emoji: emoji || "📦", imageUrl: imageUrl || "" };
      }
      return c;
    });
    const detailText = `Modification de la catégorie : ${emoji || "📦"} ${name}`;
    await saveToServer(products, updatedCats, history, detailText);
    setEditingCategoryId(null);
  };

  const handleEditStockLocation = async (locId: string, name: string, emoji: string, imageUrl?: string) => {
    if (!name.trim()) {
      alert("Le nom du lieu de stockage ne peut pas être vide.");
      return;
    }
    const updatedLocs = stockLocations.map((s) => {
      if (s.id === locId) {
        return { ...s, name: name.trim(), emoji: emoji || "🧴", imageUrl: imageUrl || "" };
      }
      return s;
    });
    const detailText = `Modification du lieu de stockage : ${emoji || "🧴"} ${name}`;
    await saveToServer(products, categories, history, detailText, users, updatedLocs);
    setEditingLocId(null);
  };

  const getProductEmojiByName = (name: string, categoryEmoji: string): string => {
    const lower = name.toLowerCase();
    const dict: Record<string, string> = {
      lait: "🥛",
      beurre: "🧈",
      fromage: "🧀",
      yaourt: "🥛",
      oeuf: "🥚",
      creme: "🥛",
      pain: "🍞",
      baguette: "🥖",
      croissant: "🥐",
      brioche: "🍞",
      farine: "🌾",
      sucre: "🍬",
      sel: "🧂",
      huile: "🫗",
      vinaigre: "🍾",
      riz: "🍚",
      pates: "🍝",
      pate: "🍝",
      semoule: "🌾",
      ble: "🌾",
      quinoa: "🌾",
      lentilles: "🫘",
      haricots: "🫘",
      pois: "🫛",
      pomme: "🍎",
      poire: "🍐",
      banane: "🍌",
      orange: "🍊",
      citron: "🍋",
      fraise: "🍓",
      framboise: "🍓",
      cerise: "🍒",
      peche: "🍑",
      abricot: "🍑",
      raisin: "🍇",
      melon: "🍈",
      pasteque: "🍉",
      kiwi: "🥝",
      avocat: "🥑",
      tomate: "🍅",
      salade: "🥬",
      carotte: "🥕",
      oignon: "🧅",
      ail: "🧄",
      potato: "🥔",
      patate: "🥔",
      poivron: "🫑",
      courgette: "🥒",
      concombre: "🥒",
      aubergine: "🍆",
      champignon: "🍄",
      brocoli: "🥦",
      epinard: "🥬",
      haricot: "🫘",
      boeuf: "🥩",
      poulet: "🍗",
      porc: "🥓",
      jambon: "🥓",
      saucisse: "🌭",
      steak: "🥩",
      poisson: "🐟",
      saumon: "🐟",
      thon: "🐟",
      crevette: "🍤",
      eau: "💧",
      jus: "🧃",
      soda: "🥤",
      cola: "🥤",
      biere: "🍺",
      vin: "🍷",
      champagne: "🍾",
      cafe: "☕",
      the: "🍵",
      chocolat: "🍫",
      biscuits: "🍪",
      gateau: "🍰",
      bonbon: "🍬",
      chips: "🍿",
      savon: "🧼",
      shampoing: "🧴",
      dentifrice: "🪥",
      papier: "🧻",
      essuie: "🧻",
      lessive: "🧼",
      liquide: "🧼"
    };

    for (const [key, value] of Object.entries(dict)) {
      if (lower.includes(key)) return value;
    }
    return categoryEmoji;
  };

  const handleBulkAdd = async () => {
    if (bulkAddStep === "input") {
      if (!bulkAddText.trim()) {
        alert("Veuillez entrer au moins un nom de produit.");
        return;
      }

      const names = bulkAddText
        .split(/[\n,]+/)
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (names.length === 0) {
        alert("Aucun produit valide trouvé.");
        return;
      }

      const selectedCatObj = categories.find((c) => c.id === bulkAddCategory);
      const catEmoji = selectedCatObj?.emoji || "📦";

      const drafts: Product[] = names.map((name, index) => {
        const emoji = getProductEmojiByName(name, catEmoji);
        return {
          id: "draft-" + (Date.now() + index) + "-" + Math.floor(Math.random() * 1000),
          name: name,
          emoji: emoji,
          category: bulkAddCategory,
          stockLocation: bulkAddStockLocation,
          quantity: Number(bulkAddQuantity) || 1,
          minQuantity: 1,
          unit: bulkAddUnit || "pièces",
          price: 0,
          expiryDates: [],
          lastBoughtTimes: 0,
          totalExpenses: 0,
          imageUrl: ""
        };
      });

      setBulkAddDrafts(drafts);
      setBulkAddStep("edit");
    } else {
      // Étape "edit" -> Enregistrer définitivement
      if (bulkAddDrafts.length === 0) {
        alert("Aucun produit à ajouter.");
        return;
      }

      const newProductsList = [...products];
      const addedNames: string[] = [];

      bulkAddDrafts.forEach((draft) => {
        const realProduct: Product = {
          ...draft,
          id: "prod-" + Date.now() + "-" + Math.floor(Math.random() * 10000)
        };
        newProductsList.push(realProduct);
        addedNames.push(`${realProduct.emoji} ${realProduct.name}`);
      });

      const actionDetail = `Ajout en lot de ${bulkAddDrafts.length} produits (${addedNames.slice(0, 5).join(", ")}${bulkAddDrafts.length > 5 ? "..." : ""})`;
      await saveToServer(newProductsList, categories, history, actionDetail);

      setBulkAddText("");
      setBulkAddDrafts([]);
      setBulkAddStep("input");
      setIsBulkAddModalOpen(false);
    }
  };

  // Suppression d'une date de péremption pour un produit
  const handleRemoveExpiryDate = async (productId: string, dateStr: string) => {
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          expiryDates: (p.expiryDates || []).filter((exp) => exp.date !== dateStr)
        };
      }
      return p;
    });
    const pName = products.find(p => p.id === productId)?.name || "Produit";
    const detailText = `Suppression de la date de péremption (${new Date(dateStr).toLocaleDateString("fr-FR")}) pour ${pName}`;
    await saveToServer(updatedProducts, categories, history, detailText);
  };

  // 5. Gestion des Utilisateurs Collaboratifs (Membres)
  const handleAddUser = async (name: string) => {
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    if (users.includes(trimmed)) {
      alert("Cet utilisateur existe déjà !");
      return;
    }
    const updatedUsers = [...users, trimmed];
    setUsers(updatedUsers);
    setNewUserName("");
    await saveToServer(products, categories, history, `Ajout de l'utilisateur ${trimmed}`, updatedUsers);
  };

  const handleDeleteUser = async (userToDelete: string) => {
    if (users.length <= 1) {
      alert("Il doit rester au moins un utilisateur dans la liste.");
      return;
    }
    if (userToDeleteConfirm !== userToDelete) {
      setUserToDeleteConfirm(userToDelete);
      return;
    }
    
    const updatedUsers = users.filter((u) => u !== userToDelete);
    setUsers(updatedUsers);
    setUserToDeleteConfirm(null);
    let nextUser = currentUser;
    if (currentUser === userToDelete) {
      nextUser = updatedUsers[0];
      setCurrentUser(nextUser);
    }
    await saveToServer(products, categories, history, `Suppression de l'utilisateur ${userToDelete}`, updatedUsers);
  };

  // ==========================================
  // LOGIQUE DE SCAN IA (Tickets de caisse & Listes)
  // ==========================================

  // Allumer / éteindre la caméra de l'appareil
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Impossible d'accéder à la caméra. Veuillez importer une photo à la place.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setScannedImageBase64(dataUrl);
        stopCamera();
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScannedImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Envoyer la photo à l'API Gemini IA correspondante
  const handleProcessImageWithIA = async () => {
    if (!scannedImageBase64) return;
    setIsProcessingAI(true);

    try {
      const base64Clean = scannedImageBase64.split(",")[1];
      const mimeType = scannedImageBase64.split(";")[0].split(":")[1];
      
      const endpoint = scannerType === "receipt" ? "/api/scan-receipt" : "/api/extract-list";
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Clean,
          mimeType: mimeType,
          categories: categories
        })
      });

      if (!res.ok) {
        throw new Error("Le serveur IA a retourné une erreur lors de l'analyse.");
      }

      const data = await res.json();
      if (data && data.products) {
        const sanitizedProducts = data.products.map((p: any) => ({
          name: p.name || "",
          emoji: p.emoji || "📦",
          category: p.category || "autre",
          quantity: p.quantity !== undefined && p.quantity !== null ? Number(p.quantity) : 1,
          price: p.price !== undefined && p.price !== null ? Number(p.price) : 0,
          unit: p.unit || "pièces"
        }));
        setAiPreviewProducts(sanitizedProducts);
        setShowAiPreviewModal(true);
        setIsScannerOpen(false); // Fermer le scanner d'importation
      } else {
        alert("Aucun produit n'a été extrait. Essayez une image plus lumineuse.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Échec de l'analyse par l'IA : " + err.message);
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Valider et fusionner les produits extraits par l'IA dans la base principale
  const handleConfirmAIIntegration = async () => {
    let updatedProducts = [...products];
    const logDetails: string[] = [];

    aiPreviewProducts.forEach((aiP: any) => {
      // Nettoyage et vérification de la catégorie reçue par l'IA
      const catId = categories.some((c) => c.id === aiP.category) ? aiP.category : "autre";
      const parsedPrice = Number(aiP.price) || 0;
      const parsedQty = Number(aiP.quantity) || 1;

      // Chercher si un produit équivalent existe par son nom (en minuscule)
      const existingIndex = updatedProducts.findIndex(
        (p) => p.name.toLowerCase().trim() === aiP.name.toLowerCase().trim()
      );

      if (existingIndex !== -1) {
        // Le produit existe déjà : on incrémente ou on remplace
        const p = updatedProducts[existingIndex];
        
        if (scannerType === "receipt") {
          // Si c'est un ticket de caisse, on ajoute la quantité au stock
          const oldQty = p.quantity;
          p.quantity += parsedQty;
          p.price = parsedPrice > 0 ? parsedPrice : p.price; // mettre à jour le prix si détecté
          p.lastBoughtTimes = (p.lastBoughtTimes || 0) + 1;
          p.totalExpenses = (p.totalExpenses || 0) + (parsedQty * parsedPrice);
          logDetails.push(`+${parsedQty} ${p.unit} de ${p.emoji} ${p.name} (Ticket de caisse)`);
        } else {
          // Si c'est une liste de courses, on s'assure qu'elle est en dessous du seuil ou on configure sa minQuantity
          // Pour forcer l'ajout dans la liste de courses, on peut réduire la quantité ou augmenter le minQuantity
          // Pour cet exercice pédagogique, on va juste configurer la quantité minimale pour qu'il soit suggéré
          const oldMin = p.minQuantity;
          p.minQuantity = Math.max(p.minQuantity, p.quantity + parsedQty);
          logDetails.push(`Demande d'ajout de ${parsedQty} de ${p.name} via photo liste (Seuil augmenté à ${p.minQuantity})`);
        }
      } else {
        // Le produit n'existe pas : on le crée
        const newProd: Product = {
          id: "prod-" + Date.now() + Math.random().toString(36).substr(2, 5),
          name: aiP.name,
          emoji: aiP.emoji || "🛒",
          category: catId,
          // Si c'est un ticket de caisse, on l'a acheté donc on l'a en stock.
          // Si c'est une photo de liste de courses, on ne l'a pas en stock (qty=0) mais on veut l'acheter (minQty=qty détectée)
          quantity: scannerType === "receipt" ? parsedQty : 0,
          minQuantity: scannerType === "receipt" ? Math.max(1, Math.floor(parsedQty / 2)) : parsedQty,
          unit: aiP.unit || "pièces",
          price: parsedPrice,
          expiryDates: [],
          lastBoughtTimes: scannerType === "receipt" ? 1 : 0,
          totalExpenses: scannerType === "receipt" ? (parsedQty * parsedPrice) : 0
        };
        updatedProducts.push(newProd);
        logDetails.push(`Nouveau produit détecté par IA : ${newProd.emoji} ${newProd.name}`);
      }
    });

    const detailText = `Intégration IA (${scannerType === "receipt" ? "Ticket de caisse" : "Liste Photo"}) : ` + logDetails.join(", ");
    await saveToServer(updatedProducts, categories, history, detailText);
    
    setShowAiPreviewModal(false);
    setScannedImageBase64(null);
    setAiPreviewProducts([]);
  };

  // ==========================================
  // RAPPORTS DE PARTAGE & EXPORTS
  // ==========================================
  const handleCopyReport = (type: "stock" | "shopping") => {
    let text = "";
    if (type === "stock") {
      text = `📦 PANTRYPAL - RAPPORT DE STOCK (${new Date().toLocaleDateString("fr-FR")})\n`;
      text += `Lien de la liste : ${window.location.origin}/#${listId}\n\n`;
      categories.forEach((cat) => {
        const catProds = products.filter((p) => p.category === cat.id);
        if (catProds.length > 0) {
          text += `${cat.emoji} ${cat.name.toUpperCase()} :\n`;
          catProds.forEach((p) => {
            const warning = p.quantity < p.minQuantity ? "⚠️ SEUIL ALERTE" : "OK";
            text += `  - ${p.emoji} ${p.name} : ${p.quantity} / ${p.minQuantity} ${p.unit} (${warning})\n`;
          });
          text += `\n`;
        }
      });
    } else {
      text = `📝 PANTRYPAL - LISTE DE COURSES INTÉLLIGENTE (${new Date().toLocaleDateString("fr-FR")})\n`;
      text += `Lien de la liste : ${window.location.origin}/#${listId}\n`;
      text += `Estimation totale du panier : ${totalEstimatedShoppingPrice.toFixed(2)}€\n\n`;
      
      const itemsByCat: Record<string, typeof shoppingListItems> = {};
      shoppingListItems.forEach((item) => {
        const catId = item.product.category;
        if (!itemsByCat[catId]) itemsByCat[catId] = [];
        itemsByCat[catId].push(item);
      });

      categories.forEach((cat) => {
        const items = itemsByCat[cat.id] || [];
        if (items.length > 0) {
          text += `${cat.emoji} ${cat.name.toUpperCase()} :\n`;
          items.forEach((item) => {
            text += `  [ ] ${item.product.emoji} ${item.product.name} - Besoin : ${item.quantityToBuy} ${item.product.unit} (Est. ${item.estimatedPrice.toFixed(2)}€)\n`;
          });
          text += `\n`;
        }
      });
    }

    navigator.clipboard.writeText(text);
    alert(`Rapport de ${type === "stock" ? "stock" : "courses"} copié dans le presse-papiers avec succès !`);
  };

  // ==========================================
  // LOGIQUE DE CALCUL DES DATES DE PÉREMPTION
  // ==========================================
  const allExpiryDates = products.flatMap((p) => {
    return (p.expiryDates || []).map((exp) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expDate = new Date(exp.date);
      expDate.setHours(0, 0, 0, 0);
      
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Calcul du niveau d'alerte selon les seuils configurables
      let level: "URGENT" | "ATTENTION" | "SECURE" = "SECURE";
      if (diffDays <= expiryThresholdUrgent) {
        level = "URGENT";
      } else if (diffDays <= expiryThresholdAttention) {
        level = "ATTENTION";
      }

      return {
        productId: p.id,
        name: p.name,
        emoji: p.emoji,
        imageUrl: p.imageUrl,
        date: exp.date,
        quantity: exp.quantity,
        unit: p.unit,
        diffDays,
        level
      };
    });
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Expirations urgentes uniquement pour la boîte d'alerte rapide
  const urgentExpirations = allExpiryDates.filter((exp) => exp.level === "URGENT");

  // Déterminer l'état de péremption d'un produit spécifique pour l'affichage de l'inventaire
  const getProductExpiryStatus = (p: Product): { level: "URGENT" | "ATTENTION" | "SECURE"; days: number } | null => {
    if (!p.expiryDates || p.expiryDates.length === 0) return null;
    let worstLevel: "URGENT" | "ATTENTION" | "SECURE" = "SECURE";
    let minDays = Infinity;
    
    p.expiryDates.forEach((exp) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expDate = new Date(exp.date);
      expDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays < minDays) minDays = diffDays;
      
      if (diffDays <= expiryThresholdUrgent) {
        worstLevel = "URGENT";
      } else if (diffDays <= expiryThresholdAttention && worstLevel !== "URGENT") {
        worstLevel = "ATTENTION";
      }
    });
    
    return { level: worstLevel, days: minDays };
  };

  // ==========================================
  // CALCULS STATISTIQUES (Graphes)
  // ==========================================
  
  // Graphique 1 : Dépenses par Catégorie
  const expensesByCategoryData = categories.map((cat) => {
    const total = products
      .filter((p) => p.category === cat.id)
      .reduce((sum, p) => sum + (p.totalExpenses || 0), 0);
    return {
      name: cat.name,
      emoji: cat.emoji,
      value: Number(total.toFixed(2))
    };
  }).filter((item) => item.value > 0);

  // Graphique 2 : Dépenses Mensuelles Totales (historique groupé)
  const getMonthlyExpensesData = () => {
    const monthlyMap: Record<string, number> = {};
    history.forEach((hItem) => {
      const date = new Date(hItem.date);
      const monthNames = ["Janv", "Févr", "Mars", "Avril", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + hItem.totalPrice;
    });

    const monthOrder = ["Janv", "Févr", "Mars", "Avril", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
    return Object.keys(monthlyMap).map((key) => ({
      month: key,
      dépenses: Number(monthlyMap[key].toFixed(2))
    })).sort((a, b) => {
      const [mNameA, yA] = a.month.split(" ");
      const [mNameB, yB] = b.month.split(" ");
      if (yA !== yB) return Number(yA) - Number(yB);
      return monthOrder.indexOf(mNameA) - monthOrder.indexOf(mNameB);
    });
  };

  const monthlyExpensesChartData = getMonthlyExpensesData();

  // Graphique 3 : Produits les plus achetés selon la période filtrée
  const getTopBoughtProductsData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const filteredHistory = history.filter((item) => {
      const itemDate = new Date(item.date);
      if (statsPeriod === "month") {
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      }
      if (statsPeriod === "year") {
        return itemDate.getFullYear() === currentYear;
      }
      return true; // "all"
    });

    const counts: Record<string, { name: string; emoji: string; qty: number; count: number; cost: number }> = {};
    filteredHistory.forEach((hItem) => {
      (hItem.items || []).forEach((item) => {
        const key = item.name.toLowerCase().trim();
        if (!counts[key]) {
          counts[key] = {
            name: item.name,
            emoji: item.emoji || "🛒",
            qty: 0,
            count: 0,
            cost: 0
          };
        }
        counts[key].qty += item.quantity;
        counts[key].count += 1;
        counts[key].cost += item.quantity * (item.price || 0);
      });
    });

    return Object.values(counts)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)
      .map((item) => ({
        name: `${item.emoji} ${item.name}`,
        quantite: item.qty,
        achats: item.count,
        depense: Number(item.cost.toFixed(2))
      }));
  };

  const topBoughtProductsData = getTopBoughtProductsData();

  const COLORS = ["#059669", "#0284c7", "#f59e0b", "#ec4899", "#8b5cf6", "#3b82f6", "#ef4444", "#10b981"];

  // Normaliser pour la recherche insensible aux accents et à la casse
  const normalizeStr = (str: string) => {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Filtrer les produits pour l'affichage de la grille de stock
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryTab === "all" || p.category === selectedCategoryTab;
    const matchesStock = selectedStockFilter === "all" || p.stockLocation === selectedStockFilter;
    const matchesSearch = normalizeStr(p.name).includes(normalizeStr(searchQuery));
    return matchesCategory && matchesStock && matchesSearch;
  });

  // Trier les produits filtrés
  const getSortedProducts = (prods: Product[]) => {
    const list = [...prods];
    if (productSortBy === "name-asc") {
      return list.sort((a, b) => (a.name || "").localeCompare(b.name || "", "fr"));
    }
    if (productSortBy === "name-desc") {
      return list.sort((a, b) => (b.name || "").localeCompare(a.name || "", "fr"));
    }
    if (productSortBy === "stock-asc") {
      return list.sort((a, b) => Number(a.quantity || 0) - Number(b.quantity || 0));
    }
    if (productSortBy === "stock-desc") {
      return list.sort((a, b) => Number(b.quantity || 0) - Number(a.quantity || 0));
    }
    if (productSortBy === "price-asc") {
      return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }
    if (productSortBy === "price-desc") {
      return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }
    if (productSortBy === "expiry-asc") {
      return list.sort((a, b) => {
        const getMinExpiry = (p: Product) => {
          if (!p.expiryDates || p.expiryDates.length === 0) return Infinity;
          const dates = p.expiryDates.map(d => new Date(d.date).getTime()).filter(t => !isNaN(t));
          if (dates.length === 0) return Infinity;
          return Math.min(...dates);
        };
        const nextA = getMinExpiry(a);
        const nextB = getMinExpiry(b);
        return nextA - nextB;
      });
    }
    return list;
  };

  const displayedProducts = getSortedProducts(filteredProducts);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 pb-10">
      
      {/* ==========================================
          HEADER PRINCIPAL (Bento Style)
          ========================================== */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
            🛒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-emerald-950">PantryPal</h1>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Pro Collaborative</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-500 font-medium">Stock & Liste :</span>
              <button 
                onClick={() => {
                  fetchAllLists();
                  setIsWorkspaceModalOpen(true);
                }}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200/80 transition flex items-center gap-1.5 shrink-0"
              >
                <span>📂 {listName}</span>
                <span className="font-mono text-[9px] text-emerald-600 bg-emerald-100/50 px-1 rounded">#{listId}</span>
                <span className="text-[9px] text-emerald-600 font-normal">▼</span>
              </button>
            </div>
          </div>
        </div>

        {/* Boutons d'action rapides */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Indicateur de synchro en temps réel */}
          <div className="bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-spin' : 'bg-emerald-500 animate-pulse'}`}></div>
            <span className="text-slate-600 font-medium">
              Synchro : <span className="text-emerald-800 font-bold">{lastModifiedBy || "Système"}</span>
            </span>
            <button 
              onClick={() => fetchList(true)} 
              title="Forcer la synchronisation" 
              className="hover:text-emerald-700 transition"
              disabled={isSyncing}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Changer d'utilisateur */}
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
          >
            <User className="w-3.5 h-3.5" />
            <span>Moi : {currentUser}</span>
          </button>

          {/* Scanner un ticket / une liste */}
          <button
            onClick={() => {
              setScannerType("receipt");
              setIsScannerOpen(true);
            }}
            className="flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>📷 Scanner Ticket IA</span>
          </button>
          
          <button
            onClick={() => {
              setScannerType("list");
              setIsScannerOpen(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-700 text-white hover:bg-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📝 Lire Liste IA</span>
          </button>

          {/* Installer l'application sur mobile */}
          <button
            onClick={() => setIsPwaModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-md hover:scale-[1.02] active:scale-95 duration-150"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>📲 Installer sur Mobile</span>
          </button>
        </div>
      </header>

      {/* Bannière d'erreur de synchro */}
      {syncError && (
        <div className="bg-rose-50 border-y border-rose-200 px-6 py-2 text-xs text-rose-700 flex items-center gap-2 justify-between animate-pulse">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            {syncError}
          </span>
          <button onClick={() => fetchList(true)} className="underline font-bold hover:text-rose-900">
            Réessayer
          </button>
        </div>
      )}

      {/* Information sur le partage de liste */}
      <div className="max-w-7xl mx-auto w-full px-4 mt-3">
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex flex-col md:flex-row gap-3 items-center justify-between">
          <p className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-500 shrink-0" />
            <span>
              💡 <strong>Travaillez à plusieurs !</strong> Partagez simplement l'URL de cette page. Les modifications apportées par vos proches se synchroniseront instantanément. 
              Pour créer une nouvelle liste privée, modifiez la fin de l'adresse ou ajoutez un hashtag dans l'URL.
            </span>
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => {
                const name = prompt("Entrez un nouvel identifiant de liste (ex: maison, fete-samedi) :");
                if (name && name.trim()) {
                  window.location.hash = name.trim().toLowerCase().replace(/\s+/g, "-");
                }
              }}
              className="bg-white hover:bg-slate-50 text-slate-700 px-3 py-1 rounded-lg border border-slate-300 font-semibold transition text-[11px]"
            >
              🔄 Changer de liste
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Lien de la liste partagée copié dans le presse-papiers !");
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-semibold transition text-[11px]"
            >
              🔗 Copier le lien
            </button>
          </div>
        </div>
      </div>

      {/* Navigation principale par onglets (Bento-style tabs) */}
      <div className="max-w-7xl mx-auto w-full px-4 mt-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex flex-col lg:flex-row gap-1 shadow-sm">
          <button
            onClick={() => setActiveMainTab("overview")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeMainTab === "overview"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-amber-500" />
            <span>👁️ Vue d'ensemble du Stock</span>
          </button>

          <button
            onClick={() => setActiveMainTab("inventory")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeMainTab === "inventory"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-emerald-500" />
            <span>📋 Mes Placards & Liste de Courses</span>
          </button>
          
          <button
            onClick={() => setActiveMainTab("stats")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeMainTab === "stats"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <BarChart2 className="w-4 h-4 text-emerald-500" />
            <span>📊 Analyses & Statistiques</span>
          </button>
          
          <button
            onClick={() => setActiveMainTab("expiry")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeMainTab === "expiry"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Calendar className="w-4 h-4 text-rose-500" />
            <span>🕒 Dates de Péremption & Alertes</span>
            {urgentExpirations.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                {urgentExpirations.length} URGENT
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveMainTab("reglage")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeMainTab === "reglage"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span>⚙️ Réglages</span>
          </button>
        </div>
      </div>

      {/* ==========================================
          ONGLET 0 : VUE D'ENSEMBLE DU STOCK (DASHBOARD)
          ========================================== */}
      {activeMainTab === "overview" && (
        <main className="max-w-7xl mx-auto w-full p-4 space-y-6">
          {/* Header Dashboard */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50 rounded-3xl p-6 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👁️</span>
                <h2 className="text-xl font-bold text-slate-800">Vue d'ensemble de vos placards</h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Suivi global, répartition thématique, ruptures de stock critiques et activité en temps réel.
              </p>
            </div>
            {lastModifiedAt && (
              <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-right shadow-sm shrink-0 self-start md:self-auto">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dernière mise à jour</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  Par <span className="text-emerald-600 font-bold">{lastModifiedBy || "Système"}</span> le {new Date(lastModifiedAt).toLocaleDateString("fr-FR")} à {new Date(lastModifiedAt).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
          </div>

          {/* Indicateurs Clés (Bento-style Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Taux de santé du stock */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Santé du Stock</p>
                  <p className="text-3xl font-black mt-2 text-slate-900">
                    {products.length > 0 
                      ? Math.round((products.filter(p => p.quantity >= p.minQuantity).length / products.length) * 100)
                      : 100}%
                  </p>
                </div>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-2xl text-xl font-bold">🩺</span>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1.5">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${products.length > 0 ? (products.filter(p => p.quantity >= p.minQuantity).length / products.length) * 100 : 100}%` 
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  {products.filter(p => p.quantity >= p.minQuantity).length} références optimales sur {products.length}.
                </p>
              </div>
            </div>

            {/* Valeur totale du stock */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Valeur des Réserves</p>
                  <p className="text-3xl font-black mt-2 text-slate-900">
                    {products.reduce((acc, p) => acc + (p.quantity * (p.price || 0)), 0).toFixed(2)}€
                  </p>
                </div>
                <span className="p-2 bg-amber-50 text-amber-600 rounded-2xl text-xl font-bold">💰</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                Somme accumulée de la valeur de tous vos ingrédients actuellement disponibles en rayon.
              </p>
            </div>

            {/* Articles en rupture totale */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Ruptures de Stock</p>
                  <p className="text-3xl font-black mt-2 text-rose-600">
                    {products.filter(p => p.quantity === 0).length} articles
                  </p>
                </div>
                <span className="p-2 bg-rose-50 text-rose-600 rounded-2xl text-xl font-bold">🚨</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                Produits avec un stock de zéro, ajoutés automatiquement à votre liste de courses.
              </p>
            </div>

            {/* Volume Global */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Articles en Alerte</p>
                  <p className="text-3xl font-black mt-2 text-amber-500">
                    {products.filter(p => p.quantity < p.minQuantity).length} produits
                  </p>
                </div>
                <span className="p-2 bg-amber-50 text-amber-600 rounded-2xl text-xl font-bold">⚠️</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                Produits sous leur seuil d'alerte, nécessitant d'être réapprovisionnés prochainement.
              </p>
            </div>
          </div>

          {/* Grille principale : Résumé par catégories & Alertes prioritaires */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Colonne de Gauche (col-span-7) : État par Catégorie */}
            <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5">
              <div className="mb-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span>📂</span> État des Placards par Catégorie
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Remplissage, nombre d'articles et valeur estimée de chaque section.</p>
              </div>

              <div className="space-y-4">
                {categories.map((cat) => {
                  const catProds = products.filter(p => p.category === cat.id);
                  const totalReferences = catProds.length;
                  const totalUnits = catProds.reduce((acc, p) => acc + p.quantity, 0);
                  const totalValue = catProds.reduce((acc, p) => acc + (p.quantity * (p.price || 0)), 0);
                  const healthyProdsCount = catProds.filter(p => p.quantity >= p.minQuantity).length;
                  const healthPercent = totalReferences > 0 ? Math.round((healthyProdsCount / totalReferences) * 100) : 100;

                  // Déterminer la couleur de la barre de santé de la catégorie
                  let catBarColor = "bg-emerald-500";
                  let catBadgeBg = "bg-emerald-50 text-emerald-700 border-emerald-150";
                  let catStatus = "Optimal";

                  if (totalReferences === 0) {
                    catBarColor = "bg-slate-300";
                    catBadgeBg = "bg-slate-50 text-slate-400 border-slate-100";
                    catStatus = "Vide";
                  } else if (healthPercent < 40) {
                    catBarColor = "bg-rose-500";
                    catBadgeBg = "bg-rose-50 text-rose-700 border-rose-150";
                    catStatus = "Critique";
                  } else if (healthPercent < 75) {
                    catBarColor = "bg-amber-400";
                    catBadgeBg = "bg-amber-50 text-amber-700 border-amber-150";
                    catStatus = "À surveiller";
                  }

                  return (
                    <div key={cat.id} className="border border-slate-100 rounded-2xl p-4 hover:bg-slate-50/50 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{cat.emoji}</span>
                          <div>
                            <span className="font-bold text-slate-800 text-xs sm:text-sm">{cat.name}</span>
                            <span className="text-[10px] text-slate-400 block sm:inline sm:ml-2">
                              {totalReferences} {totalReferences > 1 ? "références" : "référence"} • {totalUnits} {totalReferences > 0 ? catProds[0].unit || "unités" : "unités"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
                            {totalValue.toFixed(2)}€
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${catBadgeBg} shrink-0`}>
                            {catStatus} ({healthPercent}%)
                          </span>
                        </div>
                      </div>

                      {totalReferences > 0 ? (
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`${catBarColor} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${healthPercent}%` }}
                          />
                        </div>
                      ) : (
                        <div className="w-full bg-slate-100 h-1.5 rounded-full border border-dashed border-slate-200" />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Colonne de Droite (col-span-5) : Alertes Stock & Activité Récente */}
            <section className="lg:col-span-5 space-y-6">
              
              {/* Box 1 : Alertes de Ruptures ou Stock Bas */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col min-h-[300px] max-h-[420px]">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span className="text-rose-500">⚠️</span> Alertes & Ruptures critiques
                  </h3>
                  <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                    {products.filter(p => p.quantity < p.minQuantity).length} alertes
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {products.filter(p => p.quantity < p.minQuantity).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400">
                      <span className="text-3xl">🎉</span>
                      <p className="font-bold text-slate-700 text-xs mt-2">Aucune alerte de stock !</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Tous vos produits sont bien approvisionnés.</p>
                    </div>
                  ) : (
                    products
                      .filter(p => p.quantity < p.minQuantity)
                      .sort((a, b) => {
                        const deficiencyA = a.minQuantity - a.quantity;
                        const deficiencyB = b.minQuantity - b.quantity;
                        return deficiencyB - deficiencyA;
                      })
                      .map((p) => {
                        const isRupture = p.quantity === 0;
                        return (
                          <div 
                            key={p.id} 
                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {renderItemIcon(p.emoji, p.imageUrl, "w-6 h-6 flex items-center justify-center text-xs shrink-0 bg-white border border-slate-100 rounded-lg shadow-sm")}
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-800 block truncate">{p.name}</span>
                                <span className={`text-[10px] font-medium leading-none ${isRupture ? 'text-rose-600 font-bold' : 'text-amber-600'}`}>
                                  {isRupture ? "Rupture de stock" : `Stock bas : ${p.quantity} / ${p.minQuantity} ${p.unit}`}
                                </span>
                              </div>
                            </div>

                            {/* Actions rapides */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg shadow-sm">
                                <button
                                  onClick={async () => {
                                    const updatedProducts = products.map((item) => {
                                      if (item.id === p.id) {
                                        return { ...item, quantity: Math.max(0, item.quantity - 1) };
                                      }
                                      return item;
                                    });
                                    await saveToServer(updatedProducts, categories, history, `Soustraction de stock (-1) pour ${p.name}`);
                                  }}
                                  disabled={p.quantity <= 0}
                                  className="w-5 h-5 hover:bg-slate-100 text-slate-600 rounded flex items-center justify-center font-bold text-xs disabled:opacity-20 transition"
                                  title="Retirer 1"
                                >
                                  -
                                </button>
                                <span className="text-xs font-bold px-1 text-slate-800 min-w-[12px] text-center">
                                  {p.quantity}
                                </span>
                                <button
                                  onClick={async () => {
                                    const updatedProducts = products.map((item) => {
                                      if (item.id === p.id) {
                                        return { ...item, quantity: item.quantity + 1 };
                                      }
                                      return item;
                                    });
                                    await saveToServer(updatedProducts, categories, history, `Ajout de stock (+1) pour ${p.name}`);
                                  }}
                                  className="w-5 h-5 hover:bg-slate-100 text-slate-600 rounded flex items-center justify-center font-bold text-xs transition"
                                  title="Ajouter 1"
                                >
                                  +
                                </button>
                              </span>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Box 2 : Activité Récente (Extrait) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col h-[280px]">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span>🔔</span> Activité Récente
                  </h3>
                  <button
                    onClick={() => {
                      setActiveMainTab("stats");
                      setTimeout(() => {
                        const el = document.getElementById("modification-history");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 150);
                    }}
                    className="text-[10px] font-bold text-emerald-600 hover:underline"
                  >
                    Afficher l'historique
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {logs.length === 0 ? (
                    <p className="text-slate-400 text-center py-10">Aucune activité enregistrée.</p>
                  ) : (
                    logs.slice(0, 5).map((log, idx) => {
                      const initials = log.user.substring(0, 2).toUpperCase();
                      const userColorClass = getUserColor(log.user);
                      
                      return (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${userColorClass}`}>
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-700 leading-tight text-[11px]">
                              <strong className="text-slate-900">{log.user}</strong> : {log.details}
                            </p>
                            <span className="text-[9px] text-slate-400 block mt-0.5">
                              {new Date(log.date).toLocaleDateString("fr-FR")} {new Date(log.date).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </section>

          </div>
        </main>
      )}

      {/* ==========================================
          ONGLET 1 : INVENTAIRE ET COURSES
          ========================================== */}
      {activeMainTab === "inventory" && (
        <main className="max-w-7xl mx-auto w-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
          
          {/* ==========================================
              COLONNE DE GAUCHE : Gestionnaire de Stock (col-span-7)
              ========================================== */}
          <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px] lg:min-h-[720px]">
            
            {/* Header du Stock */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📦</span>
                <h2 className="font-bold text-slate-800">Gestion du Stock</h2>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {products.length} articles
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none w-28 sm:w-36"
                />

                {/* Sélecteur de tri de produits */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs shadow-sm">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={productSortBy}
                    onChange={(e) => setProductSortBy(e.target.value)}
                    className="bg-transparent focus:outline-none text-slate-700 text-[11px] font-semibold cursor-pointer"
                  >
                    <option value="name-asc">Nom A-Z</option>
                    <option value="name-desc">Nom Z-A</option>
                    <option value="stock-asc">Stock bas d'abord</option>
                    <option value="stock-desc">Stock haut d'abord</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="expiry-asc">Péremption proche</option>
                  </select>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setBulkAddCategory(selectedCategoryTab !== "all" ? selectedCategoryTab : (categories[0]?.id || "autre"));
                      setBulkAddStockLocation(stockLocations[0]?.id || "cuisine");
                      setIsBulkAddModalOpen(true);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition border border-slate-200"
                    title="Ajouter plusieurs produits d'un coup"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ajouter en lot</span>
                  </button>
                  <button
                    onClick={handleOpenAddProduct}
                    className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Catégories de filtrage rapide */}
            <div className="px-4 py-2 bg-slate-50/40 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none pr-1">Catégorie :</span>
              <button
                onClick={() => setSelectedCategoryTab("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategoryTab === "all"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Tout
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryTab(cat.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition ${
                      selectedCategoryTab === cat.id
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                    <span className={`text-[9px] px-1 rounded-full ${selectedCategoryTab === cat.id ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 flex items-center gap-1 whitespace-nowrap"
              >
                <Settings className="w-3 h-3 text-slate-500" />
                <span>Gérer les catégories</span>
              </button>
            </div>

            {/* Lieux de stockage de filtrage rapide (Plusieurs stocks différents) */}
            <div className="px-4 py-2 bg-emerald-50/30 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider select-none pr-1">Stocks :</span>
              <button
                onClick={() => setSelectedStockFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedStockFilter === "all"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Tous les stocks
              </button>
              {stockLocations.map((loc) => {
                const count = products.filter((p) => p.stockLocation === loc.id).length;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedStockFilter(loc.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition ${
                      selectedStockFilter === loc.id
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{loc.emoji}</span>
                    <span>{loc.name}</span>
                    <span className={`text-[9px] px-1 rounded-full ${selectedStockFilter === loc.id ? 'bg-emerald-900 text-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={() => setIsStockLocationModalOpen(true)}
                className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 flex items-center gap-1 whitespace-nowrap"
              >
                <Settings className="w-3 h-3 text-slate-500" />
                <span>Gérer les stocks</span>
              </button>
            </div>

            {/* Liste des produits sous forme de Bento-Cards triées */}
            <div className="flex-1 p-4 overflow-y-auto max-h-[500px] lg:max-h-[600px] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatePresence>
                {displayedProducts.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">🫙</span>
                    <p>Aucun produit trouvé dans cette section.</p>
                    <button
                      onClick={handleOpenAddProduct}
                      className="mt-2 text-xs font-bold text-emerald-600 underline hover:text-emerald-800"
                    >
                      Créer le premier article
                    </button>
                  </div>
                ) : (
                  displayedProducts.map((p) => {
                    const isLowStock = p.quantity < p.minQuantity;
                    const ratio = p.minQuantity > 0 ? Math.min(100, (p.quantity / p.minQuantity) * 100) : 100;
                    
                    // Trouver les infos de catégorie
                    const cat = categories.find((c) => c.id === p.category);

                    // Calcul de la péremption pour cet item
                    const expiryStatus = getProductExpiryStatus(p);
                    const isNearExpiry = expiryStatus && (expiryStatus.level === "URGENT" || expiryStatus.level === "ATTENTION");

                    // Déterminer la couleur de la jauge de stock
                    let progressColor = "bg-emerald-500";
                    if (isLowStock) progressColor = "bg-rose-500";
                    else if (p.quantity <= p.minQuantity * 1.5) progressColor = "bg-amber-400";

                    return (
                      <motion.div
                        key={p.id}
                        layoutId={`prod-card-${p.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`p-3 border rounded-2xl bg-white shadow-sm flex flex-col justify-between transition group hover:border-emerald-300 relative ${
                          isLowStock 
                            ? "border-rose-200 bg-rose-50/20" 
                            : isNearExpiry
                              ? expiryStatus.level === "URGENT"
                                ? "border-rose-300 bg-rose-50/10 shadow-[0_0_12px_rgba(239,68,68,0.05)]"
                                : "border-amber-300 bg-amber-50/10"
                              : "border-slate-100"
                        }`}
                      >
                        {/* En-tête de la carte */}
                        <div className="flex items-start gap-3">
                          <div className="shrink-0">
                            {renderItemIcon(p.emoji, p.imageUrl, "w-11 h-11 flex items-center justify-center text-2xl bg-slate-50 border border-slate-150 rounded-xl shadow-inner")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm truncate" title={p.name}>
                              {p.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 flex items-center gap-0.5">
                                <span>{cat?.emoji}</span>
                                <span className="truncate max-w-[80px]">{cat?.name || "Sans catégorie"}</span>
                              </span>
                              {p.stockLocation && (
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50 flex items-center gap-0.5 font-medium">
                                  <span>{stockLocations.find(s => s.id === p.stockLocation)?.emoji || "🍳"}</span>
                                  <span className="truncate max-w-[85px]">{stockLocations.find(s => s.id === p.stockLocation)?.name || p.stockLocation}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions rapides sur le produit */}
                          <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition shrink-0">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              title="Modifier"
                              className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-emerald-600 transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              title="Supprimer"
                              className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Jauge de stock */}
                        <div className="mt-3">
                          <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 mb-1">
                            <span className="flex items-center gap-1.5">
                              Stock : <strong className="text-slate-800">{p.quantity} {p.unit}</strong>
                              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 p-0.5 rounded-md">
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const updatedProducts = products.map((item) => {
                                      if (item.id === p.id) {
                                        return { ...item, quantity: Math.max(0, item.quantity - 1) };
                                      }
                                      return item;
                                    });
                                    await saveToServer(updatedProducts, categories, history, `Soustraction de stock (-1) pour ${p.name}`);
                                  }}
                                  className="w-4 h-4 hover:bg-slate-200 text-slate-600 rounded flex items-center justify-center font-bold text-xs leading-none transition"
                                  title="Retirer 1"
                                >
                                  -
                                </button>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const updatedProducts = products.map((item) => {
                                      if (item.id === p.id) {
                                        return { ...item, quantity: item.quantity + 1 };
                                      }
                                      return item;
                                    });
                                    await saveToServer(updatedProducts, categories, history, `Ajout de stock (+1) pour ${p.name}`);
                                  }}
                                  className="w-4 h-4 hover:bg-slate-200 text-slate-600 rounded flex items-center justify-center font-bold text-xs leading-none transition"
                                  title="Ajouter 1"
                                >
                                  +
                                </button>
                              </span>
                            </span>
                            <span>Seuil : {p.minQuantity} {p.unit}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`${progressColor} h-full transition-all duration-300`} 
                              style={{ width: `${ratio}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Pied de carte avec informations prix / péremption */}
                        <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 font-medium">
                            Prix : <span className="text-slate-800 font-bold">{(p.price || 0).toFixed(2)}€ / {p.unit}</span>
                          </span>
                          
                          {isLowStock ? (
                            <span className="text-rose-600 bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">
                              Alerte stock !
                            </span>
                          ) : isNearExpiry ? (
                            <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                              expiryStatus.level === "URGENT" 
                                ? "text-rose-700 bg-rose-100 border border-rose-200 animate-pulse" 
                                : "text-amber-800 bg-amber-100 border border-amber-200"
                            }`}>
                              Péremption proche
                            </span>
                          ) : (
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                              Correct
                            </span>
                          )}
                        </div>

                        {/* Indicateur de dates de péremption associées */}
                        {p.expiryDates && p.expiryDates.length > 0 && (
                          <div className="absolute top-1 right-2 flex gap-1 items-center">
                            {expiryStatus && expiryStatus.level === "URGENT" && (
                              <span className="text-[9px] bg-rose-600 text-white font-extrabold px-1.5 py-0.5 rounded-full">
                                🚨 {expiryStatus.days < 0 ? 'Périmé !' : `${expiryStatus.days} jours`}
                              </span>
                            )}
                            {expiryStatus && expiryStatus.level === "ATTENTION" && (
                              <span className="text-[9px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-full">
                                🕒 {expiryStatus.days}j
                              </span>
                            )}
                            <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-600 font-mono px-1 rounded-full">
                              🕒 {p.expiryDates.length} exp
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Bouton de génération de rapport en bas du stock */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500">Besoin d'exporter l'état de vos placards ?</span>
              <button
                onClick={() => handleCopyReport("stock")}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Partager le rapport de stock</span>
              </button>
            </div>
          </section>

          {/* ==========================================
              COLONNE DE DROITE : Liste de Courses Intelligente (col-span-5)
              ========================================== */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Liste de courses auto-générée */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
              
              {/* Header de la Liste */}
              <div className="p-4 border-b border-slate-100 bg-emerald-50/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-bold text-slate-800">Liste de Courses</h2>
                  <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                    {shoppingListItems.length} articles
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estimation Panier</p>
                  <p className="text-base font-extrabold text-emerald-800">{totalEstimatedShoppingPrice.toFixed(2)}€</p>
                </div>
              </div>

              {/* Corps de la Liste de Courses */}
              <div className="flex-1 p-4 overflow-y-auto max-h-[350px] space-y-2">
                {shoppingListItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl">🎉</span>
                    <p className="font-semibold text-slate-600">Votre stock est au complet !</p>
                    <p className="text-xs text-slate-400 px-6">
                      Aucun article n'est en dessous du seuil d'alerte. Dès qu'un produit tombe en sous-stock, il s'ajoutera ici automatiquement.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-100 p-2 rounded-xl flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500 animate-pulse" />
                      <span>Ces articles se sont <strong>auto-ajoutés</strong> car leur stock est insuffisant.</span>
                    </p>

                    <AnimatePresence>
                      {shoppingListItems.map((item) => {
                        const p = item.product;
                        return (
                          <motion.div
                            key={p.id}
                            layoutId={`shopping-item-${p.id}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 group hover:bg-slate-50 transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Case à cocher pour valider l'achat */}
                              <button
                                onClick={() => handleValidatePurchase(p.id, item.quantityToBuy)}
                                title="Valider l'achat de cet article (met à jour le stock)"
                                className="w-5 h-5 border-2 border-emerald-500 rounded-lg flex items-center justify-center hover:bg-emerald-50 shrink-0 transition"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition" />
                              </button>
                              {renderItemIcon(p.emoji, p.imageUrl, "w-6 h-6 flex items-center justify-center text-xs shrink-0 bg-white border border-slate-100 rounded-lg shadow-sm")}
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                                <p className="text-[10px] text-slate-500">
                                  Stock actuel : {p.quantity} / {p.minQuantity} {p.unit}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {/* Quantité d'achat requise */}
                              <div className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-0.5 shadow-sm">
                                <span>+ {item.quantityToBuy}</span>
                                <span className="text-[9px] font-normal text-emerald-600 ml-0.5">{p.unit}</span>
                              </div>

                              {/* Estimation de prix */}
                              <div className="text-right min-w-[50px]">
                                <p className="text-xs font-bold text-slate-800">
                                  {item.estimatedPrice.toFixed(2)}€
                                </p>
                                <p className="text-[9px] text-slate-400">
                                  {p.price.toFixed(2)}€/u
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Validation globale de la liste */}
              {shoppingListItems.length > 0 && (
                <div className="p-3 bg-slate-900 text-white flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-70">Total panier ({shoppingListItems.length} articles)</span>
                    <span className="text-lg font-extrabold text-emerald-400">
                      {totalEstimatedShoppingPrice.toFixed(2)}€
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => handleCopyReport("shopping")}
                      className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Partager</span>
                    </button>
                    <button
                      onClick={handleValidateAllShoppingList}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl py-2 text-xs font-extrabold flex items-center justify-center gap-1.5 transition shadow-md"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Valider les achats</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ==========================================
                BENTO : Boîte d'Alerte Péremption (3 seuils)
                ========================================== */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚨</span>
                  <h3 className="font-bold text-slate-800 text-sm">Alertes de Péremption</h3>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  {allExpiryDates.length} DATES ENREGISTRÉES
                </span>
              </div>

              {allExpiryDates.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  Aucune date de péremption n'est configurée sur vos produits. Ajoutez-en lors de la modification d'un produit.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="pb-1.5 font-semibold">Produit</th>
                        <th className="pb-1.5 font-semibold">Date de péremption</th>
                        <th className="pb-1.5 font-semibold text-right">Quantité</th>
                        <th className="pb-1.5 font-semibold text-right">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allExpiryDates.slice(0, 5).map((exp, idx) => {
                        // Classe css selon le niveau
                        let statusBadge = "bg-emerald-100 text-emerald-800";
                        let statusText = "Sûr";
                        if (exp.level === "URGENT") {
                          statusBadge = "bg-rose-100 text-rose-800 border border-rose-200 font-bold animate-pulse";
                          statusText = exp.diffDays <= 0 ? "Périmé !" : "Urgent";
                        } else if (exp.level === "ATTENTION") {
                          statusBadge = "bg-amber-100 text-amber-800 border border-amber-200";
                          statusText = "Bientôt";
                        }

                        return (
                          <tr key={idx} className="border-b border-slate-50 last:border-0">
                            <td className="py-2 flex items-center gap-1 font-semibold text-slate-800">
                              <span>{exp.emoji}</span>
                              <span className="truncate max-w-[100px]">{exp.name}</span>
                            </td>
                            <td className="py-2 text-slate-600">
                              {new Date(exp.date).toLocaleDateString("fr-FR")}
                              <span className="text-[9px] text-slate-400 block">
                                {exp.diffDays < 0 
                                  ? `Dépassé il y a ${Math.abs(exp.diffDays)}j` 
                                  : exp.diffDays === 0 
                                    ? "Aujourd'hui !" 
                                    : `Dans ${exp.diffDays} jours`}
                              </span>
                            </td>
                            <td className="py-2 text-right text-slate-700 font-mono">
                              {exp.quantity} {exp.unit}
                            </td>
                            <td className="py-2 text-right">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${statusBadge}`}>
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {allExpiryDates.length > 5 && (
                    <div className="flex justify-between items-center mt-2.5">
                      <button 
                        onClick={() => setActiveMainTab("expiry")}
                        className="text-[10px] text-emerald-600 font-extrabold hover:underline"
                      >
                        Voir tout l'échéancier →
                      </button>
                      <p className="text-[10px] text-slate-400">
                        + {allExpiryDates.length - 5} autres dates...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ==========================================
                BENTO : Activité récente et Journal d'activité (Logs)
                ========================================== */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col h-[280px]">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span>🔔</span> Activité en Temps Réel
                </h3>
                <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {logs.length} événements
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {logs.length === 0 ? (
                  <p className="text-slate-400 text-center py-10">Aucune activité enregistrée.</p>
                ) : (
                  logs.map((log, idx) => {
                    const initials = log.user.substring(0, 2).toUpperCase();
                    const userColorClass = PRESET_USER_COLORS[log.user] || "bg-slate-400 text-white";
                    
                    return (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${userColorClass}`}>
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-700 leading-tight">
                            <strong className="text-slate-900">{log.user}</strong> : {log.details}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5">
                            {new Date(log.date).toLocaleString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </section>
        </main>
      )}

      {/* ==========================================
          ONGLET 2 : ANALYSES & STATISTIQUES (Dashboard complet)
          ========================================== */}
      {activeMainTab === "stats" && (
        <main className="max-w-7xl mx-auto w-full p-4 space-y-6">
          
          {/* Bento Grid d'en-tête de statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-emerald-400 text-2xl font-bold">💶</span>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-2">Dépenses Cumulées</p>
                <p className="text-3xl font-black mt-1 text-emerald-400">
                  {products.reduce((acc, p) => acc + (p.totalExpenses || 0), 0).toFixed(2)}€
                </p>
              </div>
              <p className="text-[10px] text-slate-500 mt-4">Total accumulé sur l'ensemble de vos achats validés.</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-sky-500 text-2xl font-bold">🛒</span>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-2">Estimation Courses Actuelles</p>
                <p className="text-3xl font-black mt-1 text-slate-900">
                  {totalEstimatedShoppingPrice.toFixed(2)}€
                </p>
              </div>
              <p className="text-[10px] text-slate-400 mt-4">Somme estimée pour acquérir les articles en alerte stock.</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-rose-500 text-2xl font-bold">⚠️</span>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-2">Placards en Alerte</p>
                <p className="text-3xl font-black mt-1 text-rose-500">
                  {products.filter(p => p.quantity < p.minQuantity).length} produits
                </p>
              </div>
              <p className="text-[10px] text-slate-400 mt-4">Articles dont la quantité actuelle est sous le seuil critique.</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-purple-500 text-2xl font-bold">📦</span>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-2">Total Références</p>
                <p className="text-3xl font-black mt-1 text-purple-600">
                  {products.length} articles
                </p>
              </div>
              <p className="text-[10px] text-slate-400 mt-4">Nombre de produits uniques configurés dans vos placards.</p>
            </div>

          </div>

          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Graphique 1 : Dépenses par catégorie */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col h-[360px]">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🍕</span> Répartition des Dépenses par Catégorie
                </h3>
                <p className="text-[11px] text-slate-400">Total dépensé par section d'ingrédients ou d'articles</p>
              </div>
              <div className="flex-1 min-h-[220px] flex items-center justify-center">
                {expensesByCategoryData.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center">Aucune dépense enregistrée pour le moment. Validez un achat dans votre liste.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {expensesByCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "12px", fontSize: "11px", color: "#fff" }}
                        formatter={(value: any, name: any, props: any) => [`${value} €`, `${props.payload.emoji} ${name}`]}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        align="center"
                        iconSize={10}
                        formatter={(value: any, entry: any, index: number) => {
                          const payload = expensesByCategoryData[index];
                          return <span className="text-[10px] text-slate-600 font-semibold">{payload?.emoji} {value}</span>;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Graphique 2 : Dépenses mensuelles totales */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col h-[360px]">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📈</span> Évolution des Dépenses Mensuelles Totales
                </h3>
                <p className="text-[11px] text-slate-400">Courbe ou barres de dépenses accumulées mois par mois</p>
              </div>
              <div className="flex-1 min-h-[220px]">
                {monthlyExpensesChartData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 gap-2">
                    <span className="text-3xl">📊</span>
                    <p className="text-xs">Aucun historique de dépenses mensuelles.</p>
                    <p className="text-[10px]">Validez des listes de courses pour commencer à collecter des données mensuelles historiques.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyExpensesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        unit="€"
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "12px", fontSize: "11px", color: "#fff" }}
                        formatter={(value: any) => [`${value} €`, "Dépenses"]}
                      />
                      <Bar dataKey="dépenses" fill="#059669" radius={[6, 6, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>

          {/* Graphique 3 : Top 5 produits achetés avec filtre de période */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏆</span> Produits les Plus Achetés par Période
                </h3>
                <p className="text-[11px] text-slate-400">Filtrage dynamique de vos habitudes de consommation</p>
              </div>

              {/* Sélecteur de période */}
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-xs font-bold shadow-inner">
                <button
                  onClick={() => setStatsPeriod("month")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    statsPeriod === "month"
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  📅 Ce Mois-ci
                </button>
                <button
                  onClick={() => setStatsPeriod("year")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    statsPeriod === "year"
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ⏳ Cette Année
                </button>
                <button
                  onClick={() => setStatsPeriod("all")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    statsPeriod === "all"
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ♾️ Tout le temps
                </button>
              </div>
            </div>

            <div className="min-h-[250px] flex items-center justify-center">
              {topBoughtProductsData.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2 max-w-md">
                  <span className="text-4xl">🤷‍♂️</span>
                  <p className="text-xs font-bold">Aucune donnée d'achat sur cette période.</p>
                  <p className="text-[10px]">Alimentez vos placards ou validez des articles achetés dans l'onglet de stock pour mettre à jour les statistiques.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topBoughtProductsData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "12px", fontSize: "11px", color: "#fff" }}
                      formatter={(value: any, name: any) => {
                        if (name === "quantite") return [value, "Quantité achetée"];
                        if (name === "achats") return [value, "Nombre de fois validé"];
                        return [`${value} €`, "Dépense totale"];
                      }}
                    />
                    <Bar dataKey="quantite" fill="#0284c7" name="quantite" radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar dataKey="depense" fill="#f59e0b" name="depense" radius={[4, 4, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            {topBoughtProductsData.length > 0 && (
              <div className="flex gap-4 justify-center items-center text-[10px] mt-4 font-bold uppercase text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-sky-600 rounded"></span>
                  <span>Volume Quantité achetée</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-amber-500 rounded"></span>
                  <span>Dépenses estimées (€)</span>
                </div>
              </div>
            )}
          </div>

          {/* ==========================================
              HISTORIQUE DES MODIFICATIONS ET ACTIVITÉ (Logs complets)
              ========================================== */}
          <div 
            id="modification-history" 
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 scroll-mt-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📜</span> Historique des Modifications
                </h3>
                <p className="text-[11px] text-slate-400">
                  Journal complet des actions, des ajouts et des mises à jour des stocks
                </p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                {logs.length} événements enregistrés
              </span>
            </div>

            <div className="max-h-[450px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {logs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <span className="text-3xl">📭</span>
                  <p className="text-xs font-bold">Aucune activité enregistrée pour le moment.</p>
                </div>
              ) : (
                [...logs].reverse().map((log, idx) => {
                  const initials = log.user.substring(0, 2).toUpperCase();
                  const userColorClass = getUserColor(log.user);
                  
                  return (
                    <div 
                      key={idx} 
                      className="flex gap-3.5 items-start p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition border border-slate-100/50 hover:border-slate-200/80"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border shadow-sm ${userColorClass}`}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-slate-900 text-xs font-bold">{log.user}</strong>
                          <span className="text-[9px] text-slate-400 font-semibold bg-white border border-slate-150 px-2 py-0.5 rounded-md shadow-2xs">
                            {new Date(log.date).toLocaleDateString("fr-FR")} à {new Date(log.date).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed mt-1 text-[11px] font-medium">
                          {log.details}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </main>
      )}

      {/* ==========================================
          ONGLET 3 : ÉCHÉANCIER COMPLET DES PÉREMPTIONS & ALERTES
          ========================================== */}
      {activeMainTab === "expiry" && (
        <main className="max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Panneau de configuration de seuils d'alerte */}
          <section className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="text-xl">⚙️</span>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Seuils Configurables</h3>
                <p className="text-[10px] text-slate-400">Configurez l'affichage des alertes de péremption.</p>
              </div>
            </div>

            {/* Ajuster les seuils en jours */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-rose-600 uppercase mb-1.5">
                  🚨 Seuil Critique (Urgence rouge) : {expiryThresholdUrgent} jours ou moins
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={expiryThresholdUrgent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setExpiryThresholdUrgent(val);
                    if (val >= expiryThresholdAttention) {
                      setExpiryThresholdAttention(val + 1);
                    }
                  }}
                  className="w-full accent-rose-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-600 uppercase mb-1.5">
                  ⚠️ Seuil d'Alerte (Attention orange) : {expiryThresholdAttention} jours ou moins
                </label>
                <input
                  type="range"
                  min="1"
                  max="90"
                  value={expiryThresholdAttention}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setExpiryThresholdAttention(Math.max(val, expiryThresholdUrgent + 1));
                  }}
                  className="w-full accent-amber-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Boutons de raccourcis rapides */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Configurations Recommandées :</p>
              <div className="flex flex-col gap-1.5 text-xs">
                <button
                  onClick={() => {
                    setExpiryThresholdUrgent(3);
                    setExpiryThresholdAttention(7);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 py-1.5 rounded-lg font-semibold text-slate-700 transition text-left px-2.5 flex justify-between"
                >
                  <span>🚀 Courte conservation (3j / 7j)</span>
                  <span className="text-slate-400">Défaut</span>
                </button>
                <button
                  onClick={() => {
                    setExpiryThresholdUrgent(7);
                    setExpiryThresholdAttention(14);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 py-1.5 rounded-lg font-semibold text-slate-700 transition text-left px-2.5 flex justify-between"
                >
                  <span>📅 Conservation moyenne (7j / 14j)</span>
                  <span className="text-slate-400">Moyenne</span>
                </button>
                <button
                  onClick={() => {
                    setExpiryThresholdUrgent(15);
                    setExpiryThresholdAttention(30);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 py-1.5 rounded-lg font-semibold text-slate-700 transition text-left px-2.5 flex justify-between"
                >
                  <span>🥫 Longue conservation (15j / 30j)</span>
                  <span className="text-slate-400">Épicerie/Boîtes</span>
                </button>
              </div>
            </div>

            {/* Statistiques rapides de péremption */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1 text-slate-600">
              <p className="font-bold text-slate-700">📋 Résumé de l'état :</p>
              <p className="flex justify-between">
                <span>Total de dates enregistrées :</span>
                <strong className="text-slate-800">{allExpiryDates.length}</strong>
              </p>
              <p className="flex justify-between">
                <span>🔴 Produits critiques (urgence) :</span>
                <strong className="text-rose-600 font-bold">{urgentExpirations.length}</strong>
              </p>
              <p className="flex justify-between">
                <span>🟡 Produits d'attention :</span>
                <strong className="text-amber-600 font-bold">
                  {allExpiryDates.filter(e => e.level === "ATTENTION").length}
                </strong>
              </p>
              <p className="flex justify-between">
                <span>🟢 Produits sûrs :</span>
                <strong className="text-emerald-600 font-bold">
                  {allExpiryDates.filter(e => e.level === "SECURE").length}
                </strong>
              </p>
            </div>
          </section>

          {/* Échéancier complet (col-span-8) */}
          <section className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Tableau Complet de Suivi des Péremptions</h3>
                <p className="text-[10px] text-slate-400">Vue panoramique ordonnée chronologiquement de tous les arrivages.</p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {allExpiryDates.length} enregistrements
              </span>
            </div>

            {allExpiryDates.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-400 gap-2">
                <span className="text-4xl">🗓️</span>
                <p className="font-bold text-slate-600">Aucun produit n'a de date de péremption enregistrée.</p>
                <p className="text-xs text-slate-400 max-w-sm">
                  Pour ajouter une date de péremption, allez sur l'onglet d'inventaire, cliquez sur "Modifier" l'un des produits et liez une date et quantité à vos arrivages !
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="pb-2 font-bold uppercase tracking-wider">Emoji & Nom du Produit</th>
                      <th className="pb-2 font-bold uppercase tracking-wider">Date de Péremption</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-right">Quantité concernée</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-center">Jours Restants</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-right">Statut / Niveau</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allExpiryDates.map((exp, idx) => {
                      let statusBadge = "bg-emerald-100 text-emerald-800 border-emerald-200";
                      let statusText = "Sûr";
                      if (exp.level === "URGENT") {
                        statusBadge = "bg-rose-100 text-rose-800 border-rose-300 animate-pulse";
                        statusText = exp.diffDays <= 0 ? "Périmé" : "Urgent !";
                      } else if (exp.level === "ATTENTION") {
                        statusBadge = "bg-amber-100 text-amber-800 border-amber-300";
                        statusText = "Attention";
                      }

                      return (
                        <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                          <td className="py-2.5 font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-lg bg-slate-100 p-1 rounded-lg">{exp.emoji}</span>
                            <span>{exp.name}</span>
                          </td>
                          <td className="py-2.5 text-slate-600 font-semibold">
                            {new Date(exp.date).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="py-2.5 text-right font-mono text-slate-700 font-bold">
                            {exp.quantity} {exp.unit}
                          </td>
                          <td className="py-2.5 text-center">
                            {exp.diffDays < 0 ? (
                              <span className="text-rose-600 font-bold font-mono">
                                Dépassé de {Math.abs(exp.diffDays)}j
                              </span>
                            ) : exp.diffDays === 0 ? (
                              <span className="text-rose-600 font-extrabold animate-bounce block">
                                Aujourd'hui !
                              </span>
                            ) : (
                              <span className={`font-bold font-mono ${exp.level === 'URGENT' ? 'text-rose-600' : exp.level === 'ATTENTION' ? 'text-amber-600' : 'text-slate-600'}`}>
                                {exp.diffDays} jours
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 text-right">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-extrabold uppercase ${statusBadge}`}>
                              {statusText}
                            </span>
                          </td>
                          <td className="py-2.5 text-right">
                            <div className="flex gap-1 justify-end">
                              {/* Option de forcer l'ajout dans la liste */}
                              <button
                                onClick={async () => {
                                  // Augmenter le minQuantity pour forcer l'ajout
                                  const prod = products.find(p => p.id === exp.productId);
                                  if (!prod) return;
                                  const updatedProducts = products.map((p) => {
                                    if (p.id === exp.productId) {
                                      return {
                                        ...p,
                                        minQuantity: Math.max(p.minQuantity, p.quantity + 1)
                                      };
                                    }
                                    return p;
                                  });
                                  const detailText = `Ajout urgent de ${prod.name} à la liste de courses car l'arrivage expire bientôt (${new Date(exp.date).toLocaleDateString("fr-FR")})`;
                                  await saveToServer(updatedProducts, categories, history, detailText);
                                  alert(`Le produit ${prod.name} a été forcé dans la liste de courses.`);
                                }}
                                title="Ajouter à la liste de courses"
                                className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-2 py-1 rounded-lg border border-emerald-200"
                              >
                                Racheter
                              </button>
                              
                              {/* Supprimer cet arrivage périmé / consommé */}
                              <button
                                onClick={() => handleRemoveExpiryDate(exp.productId, exp.date)}
                                title="Supprimer cet arrivage spécifique"
                                className="text-[10px] bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 px-2 py-1 rounded-lg font-bold border border-slate-200"
                              >
                                Consommé
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </main>
      )}

      {/* ==========================================
          ONGLET 4 : RÉGLAGES (CONFIGURATIONS & LOTS)
          ========================================== */}
      {activeMainTab === "reglage" && (
        <main className="max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================
              COLONNE GAUCHE : Gestion des Catégories & Lieux de Stockage (col-span-5)
             ======================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Gestion des Catégories */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col">
              <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                    <span>📂</span> Gestion des Catégories
                  </h2>
                  <p className="text-[10px] text-slate-400">Ajoutez, supprimez et triez vos catégories de produits.</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                  {categories.length} catégories
                </span>
              </div>

              {/* Formulaire d'ajout rapide de catégorie */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 mb-4 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ajout Rapide :</span>
                <div className="space-y-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Nom de catégorie (ex: Surgelés)"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none w-full font-medium"
                    />
                  </div>
                  {/* Icône de catégorie (Unifiée) */}
                  <IconPicker
                    emoji={newCatEmoji}
                    imageUrl={newCatImageUrl}
                    onChange={(emoji, imageUrl) => {
                      setNewCatEmoji(emoji);
                      setNewCatImageUrl(imageUrl || "");
                    }}
                    accentColor="amber"
                  />
                  <button
                    onClick={async () => {
                      if (!newCatName.trim()) {
                        alert("Veuillez saisir un nom pour la catégorie.");
                        return;
                      }
                      const cleanId = newCatName.trim().toLowerCase().replace(/\s+/g, "-");
                      if (categories.some((c) => c.id === cleanId)) {
                        alert("Une catégorie portant ce nom existe déjà.");
                        return;
                      }
                      const newCat = {
                        id: cleanId,
                        name: newCatName.trim(),
                        emoji: newCatEmoji || "📦",
                        order: categories.length,
                        imageUrl: newCatImageUrl
                      };
                      const updatedCats = [...categories, newCat];
                      await saveToServer(products, updatedCats, history, `Ajout de la catégorie ${newCat.emoji} ${newCat.name}`);
                      setNewCatName("");
                      setNewCatEmoji("📦");
                      setNewCatImageUrl("");
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 px-4 rounded-xl transition shadow-sm w-full text-center font-bold"
                  >
                    Ajouter la catégorie
                  </button>
                </div>
              </div>

              {/* Liste des catégories triables & supprimables */}
              <div className="space-y-1.5 overflow-y-auto max-h-[250px] pr-1">
                {categories.map((cat, idx) => {
                  const linkedCount = products.filter((p) => p.category === cat.id).length;
                  const isEditing = editingCategoryId === cat.id;

                  if (isEditing) {
                    return (
                      <div
                        key={cat.id}
                        className="flex flex-col gap-2.5 p-3 bg-amber-50/50 border border-amber-300 rounded-2xl animate-fade-in w-full"
                      >
                        <div>
                          <input
                            type="text"
                            value={editCategoryForm.name}
                            onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name: e.target.value })}
                            className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none w-full font-semibold text-slate-800"
                            placeholder="Nom de catégorie"
                          />
                        </div>
                        {/* Sélecteur d'icône unifié pour la modification de catégorie */}
                        <IconPicker
                          emoji={editCategoryForm.emoji}
                          imageUrl={editCategoryForm.imageUrl}
                          onChange={(emoji, imageUrl) => setEditCategoryForm({ ...editCategoryForm, emoji, imageUrl: imageUrl || "" })}
                          accentColor="amber"
                        />
                        <div className="flex justify-end gap-1.5 pt-1.5 border-t border-slate-100">
                          <button
                            onClick={() => setEditingCategoryId(null)}
                            className="text-[10px] font-bold text-slate-500 hover:bg-slate-100 bg-white border border-slate-200 px-2.5 py-1 rounded-lg transition"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleEditCategory(cat.id, editCategoryForm.name, editCategoryForm.emoji, editCategoryForm.imageUrl)}
                            className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg transition shadow-sm"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl transition group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {renderItemIcon(cat.emoji, cat.imageUrl)}
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 truncate block">{cat.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {linkedCount} {linkedCount > 1 ? "produits liés" : "produit lié"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Modifier la catégorie */}
                        <button
                          onClick={() => {
                            setEditingCategoryId(cat.id);
                            setEditCategoryForm({ name: cat.name || "", emoji: cat.emoji || "", imageUrl: cat.imageUrl || "" });
                          }}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition"
                          title="Modifier la catégorie"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Boutons d'ordonnancement */}
                        <button
                          onClick={() => handleMoveCategory(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition"
                          title="Monter"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveCategory(idx, "down")}
                          disabled={idx === categories.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition"
                          title="Descendre"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Suppression de catégorie */}
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          disabled={cat.id === "autre"}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition"
                          title="Supprimer la catégorie"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Gestion des Lieux de Stockage */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col">
              <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                    <span>🏠</span> Lieux de Stockage / Stocks
                  </h2>
                  <p className="text-[10px] text-slate-400">Ajoutez, modifiez et gérez vos différents stocks physiques.</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-100/50">
                  {stockLocations.length} lieux
                </span>
              </div>

              {/* Formulaire d'ajout rapide de lieu de stockage */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 mb-4 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ajout Rapide :</span>
                <div className="space-y-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Nom (ex: Congélateur, Garage)"
                      value={newLocName}
                      onChange={(e) => setNewLocName(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none w-full font-medium"
                    />
                  </div>
                  {/* Icône de lieu de stockage (Unifiée) */}
                  <IconPicker
                    emoji={newLocEmoji}
                    imageUrl={newLocImageUrl}
                    onChange={(emoji, imageUrl) => {
                      setNewLocEmoji(emoji);
                      setNewLocImageUrl(imageUrl || "");
                    }}
                    accentColor="emerald"
                  />
                  <button
                    onClick={async () => {
                      if (!newLocName.trim()) {
                        alert("Veuillez saisir un nom pour le lieu de stockage.");
                        return;
                      }
                      const cleanId = newLocName.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
                      if (stockLocations.some((s) => s.id === cleanId)) {
                        alert("Un lieu de stockage portant ce nom existe déjà.");
                        return;
                      }
                      const newLoc: StockLocation = {
                        id: cleanId,
                        name: newLocName.trim(),
                        emoji: newLocEmoji || "🧴",
                        imageUrl: newLocImageUrl
                      };
                      const updatedLocs = [...stockLocations, newLoc];
                      await saveToServer(products, categories, history, `Ajout du lieu de stockage ${newLoc.emoji} ${newLoc.name}`, users, updatedLocs);
                      setNewLocName("");
                      setNewLocEmoji("🧴");
                      setNewLocImageUrl("");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition shadow-sm w-full text-center"
                  >
                    Ajouter le lieu
                  </button>
                </div>
              </div>

              {/* Liste des lieux de stockage */}
              <div className="space-y-1.5 overflow-y-auto max-h-[250px] pr-1">
                {stockLocations.map((loc) => {
                  const linkedCount = products.filter((p) => p.stockLocation === loc.id).length;
                  const isEditing = editingLocId === loc.id;

                  if (isEditing) {
                    return (
                      <div
                        key={loc.id}
                        className="flex flex-col gap-2.5 p-3 bg-emerald-50/50 border border-emerald-300 rounded-2xl animate-fade-in w-full"
                      >
                        <div>
                          <input
                            type="text"
                            value={editLocForm.name}
                            onChange={(e) => setEditLocForm({ ...editLocForm, name: e.target.value })}
                            className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none w-full font-semibold text-slate-800"
                            placeholder="Nom du lieu"
                          />
                        </div>
                        {/* Sélecteur d'icône unifié pour la modification du lieu de stockage */}
                        <IconPicker
                          emoji={editLocForm.emoji}
                          imageUrl={editLocForm.imageUrl}
                          onChange={(emoji, imageUrl) => setEditLocForm({ ...editLocForm, emoji, imageUrl: imageUrl || "" })}
                          accentColor="emerald"
                        />
                        <div className="flex justify-end gap-1.5 pt-1.5 border-t border-slate-100">
                          <button
                            onClick={() => setEditingLocId(null)}
                            className="text-[10px] font-bold text-slate-500 hover:bg-slate-100 bg-white border border-slate-200 px-2.5 py-1 rounded-lg transition"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleEditStockLocation(loc.id, editLocForm.name, editLocForm.emoji, editLocForm.imageUrl)}
                            className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg transition shadow-sm"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={loc.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl transition group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {renderItemIcon(loc.emoji, loc.imageUrl)}
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 truncate block">{loc.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {linkedCount} {linkedCount > 1 ? "produits liés" : "produit lié"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Modifier le lieu */}
                        <button
                          onClick={() => {
                            setEditingLocId(loc.id);
                            setEditLocForm({ name: loc.name || "", emoji: loc.emoji || "", imageUrl: loc.imageUrl || "" });
                          }}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition"
                          title="Modifier le lieu de stockage"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Suppression de lieu */}
                        <button
                          onClick={async () => {
                            if (stockLocations.length <= 1) {
                              alert("Il doit y avoir au moins un lieu de stockage.");
                              return;
                            }
                            if (confirm(`Voulez-vous vraiment supprimer le lieu de stockage "${loc.name}" ? Tous les produits liés seront basculés vers un autre lieu.`)) {
                              const updatedLocs = stockLocations.filter(s => s.id !== loc.id);
                              const fallbackId = updatedLocs[0]?.id || "cuisine";
                              const updatedProducts = products.map(p => {
                                if (p.stockLocation === loc.id) {
                                  return { ...p, stockLocation: fallbackId };
                                }
                                return p;
                              });
                              await saveToServer(
                                updatedProducts,
                                categories,
                                history,
                                `Suppression du lieu de stockage : ${loc.name}`,
                                users,
                                updatedLocs
                              );
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Supprimer le lieu de stockage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ========================================================
              COLONNE DROITE : Gestion des Produits (col-span-7)
             ======================================================== */}
          <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col min-h-[500px]">
            <div className="border-b border-slate-100 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <span>📦</span> Gestion des Produits
                </h2>
                <p className="text-[10px] text-slate-400">Modifiez, triez et supprimez vos produits en lot ou individuellement.</p>
              </div>
              <div className="flex gap-1.5 self-start sm:self-auto">
                <button
                  onClick={() => {
                    setBulkAddCategory(categories[0]?.id || "autre");
                    setBulkAddStockLocation(stockLocations[0]?.id || "cuisine");
                    setIsBulkAddModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Ajouter en lot</span>
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProdForm({
                      name: "",
                      category: categories[0]?.id || "autre",
                      quantity: 1,
                      minQuantity: 1,
                      unit: "pièces",
                      price: 0,
                      notes: "",
                      emoji: "📦",
                      expiryDates: []
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nouveau Produit</span>
                </button>
              </div>
            </div>

            {/* Barre de recherche & Filtre */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Rechercher un produit à configurer..."
                value={searchQueryReglage}
                onChange={(e) => setSearchQueryReglage(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none flex-1 font-semibold text-slate-800"
              />
            </div>

            {/* Actions groupées / Multi-sélection */}
            {selectedReglageProductIds.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                  <span className="text-xs font-bold text-amber-900">
                    {selectedReglageProductIds.length} {selectedReglageProductIds.length > 1 ? "produits sélectionnés" : "produit sélectionné"}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {/* Changer la catégorie */}
                  <select
                    onChange={async (e) => {
                      const catId = e.target.value;
                      if (!catId) return;
                      const catObj = categories.find((c) => c.id === catId);
                      if (!catObj) return;

                      const updated = products.map((p) => {
                        if (selectedReglageProductIds.includes(p.id)) {
                          return { ...p, category: catId };
                        }
                        return p;
                      });

                      await saveToServer(
                        updated,
                        categories,
                        history,
                        `Changement de catégorie en lot pour ${selectedReglageProductIds.length} produits vers : ${catObj.emoji} ${catObj.name}`
                      );
                      setSelectedReglageProductIds([]);
                      e.target.value = "";
                    }}
                    className="text-[10px] bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>📁 Classer par catégorie...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>

                  {/* Changer de stock location */}
                  <select
                    onChange={async (e) => {
                      const locId = e.target.value;
                      if (!locId) return;
                      const locObj = stockLocations.find((l) => l.id === locId);
                      if (!locObj) return;

                      const updated = products.map((p) => {
                        if (selectedReglageProductIds.includes(p.id)) {
                          return { ...p, stockLocation: locId };
                        }
                        return p;
                      });

                      await saveToServer(
                        updated,
                        categories,
                        history,
                        `Changement de stock en lot pour ${selectedReglageProductIds.length} produits vers : ${locObj.emoji} ${locObj.name}`
                      );
                      setSelectedReglageProductIds([]);
                      e.target.value = "";
                    }}
                    className="text-[10px] bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>🏠 Ranger dans le stock...</option>
                    {stockLocations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.emoji} {loc.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setSelectedReglageProductIds([])}
                    className="text-[10px] font-extrabold text-slate-600 hover:bg-slate-200/50 bg-white border border-slate-200 px-2.5 py-1 rounded-lg transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Voulez-vous vraiment supprimer les ${selectedReglageProductIds.length} produits sélectionnés ?`)) {
                        const updatedProducts = products.filter((p) => !selectedReglageProductIds.includes(p.id));
                        await saveToServer(
                          updatedProducts,
                          categories,
                          history,
                          `Suppression groupée de ${selectedReglageProductIds.length} produits`
                        );
                        setSelectedReglageProductIds([]);
                      }
                    }}
                    className="text-[10px] font-extrabold text-white bg-rose-600 hover:bg-rose-700 px-2.5 py-1 rounded-lg transition shadow-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )}

            {/* Liste des produits sous forme de tableau ou ligne compacte */}
            {(() => {
              const filteredProds = products
                .filter((p) => {
                  if (!searchQueryReglage.trim()) return true;
                  return normalizeStr(p.name).includes(normalizeStr(searchQueryReglage));
                })
                .sort((a, b) => (a.name || "").localeCompare(b.name || "", "fr"));

              if (filteredProds.length === 0) {
                return (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-400 gap-2">
                    <span className="text-3xl">🔍</span>
                    <p className="font-bold text-slate-600 text-xs">Aucun produit trouvé</p>
                    <p className="text-[10px] text-slate-400 max-w-xs">
                      Modifiez votre recherche ou ajoutez un nouveau produit pour commencer !
                    </p>
                  </div>
                );
              }

              const allSelected = filteredProds.length > 0 && filteredProds.every((p) => selectedReglageProductIds.includes(p.id));

              return (
                <div className="flex-1 flex flex-col">
                  {/* Ligne "Tout sélectionner" */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const ids = filteredProds.map((p) => p.id);
                            setSelectedReglageProductIds((prev) => Array.from(new Set([...prev, ...ids])));
                          } else {
                            const ids = filteredProds.map((p) => p.id);
                            setSelectedReglageProductIds((prev) => prev.filter((id) => !ids.includes(id)));
                          }
                        }}
                        className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5"
                      />
                      <span>Nom & Infos</span>
                    </div>
                    <span>Actions</span>
                  </div>

                  {/* Lignes produits scrollables */}
                  <div className="space-y-1.5 overflow-y-auto max-h-[380px] pr-1 flex-1">
                    {filteredProds.map((p) => {
                      const isSelected = selectedReglageProductIds.includes(p.id);
                      const catInfo = categories.find((c) => c.id === p.category);
                      return (
                        <div
                          key={p.id}
                          className={`flex items-center justify-between p-2 rounded-xl border transition ${
                            isSelected
                              ? "bg-amber-50/40 border-amber-300"
                              : "bg-slate-50 hover:bg-slate-100/50 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedReglageProductIds((prev) => [...prev, p.id]);
                                } else {
                                  setSelectedReglageProductIds((prev) => prev.filter((id) => id !== p.id));
                                }
                              }}
                              className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5 shrink-0"
                            />
                            {renderItemIcon(p.emoji, p.imageUrl, "w-7 h-7 flex items-center justify-center text-sm shrink-0 bg-white border border-slate-100 rounded-lg shadow-sm")}
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-800 block truncate">{p.name}</span>
                              <div className="flex flex-wrap gap-1 mt-0.5 items-center">
                                <span className="text-[9px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.2 rounded font-medium">
                                  {catInfo ? `${catInfo.emoji} ${catInfo.name}` : "Autre"}
                                </span>
                                <span className="text-[9px] font-mono font-bold text-slate-500">
                                  Stock: {p.quantity} {p.unit}
                                </span>
                                {p.price > 0 && (
                                  <span className="text-[9px] font-mono font-bold text-emerald-600">
                                    {p.price.toFixed(2)} €
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-1 shrink-0">
                            {/* Modifier */}
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProdForm({
                                  name: p.name || "",
                                  category: p.category || "autre",
                                  quantity: p.quantity !== undefined && p.quantity !== null ? p.quantity : 1,
                                  minQuantity: p.minQuantity !== undefined && p.minQuantity !== null ? p.minQuantity : 1,
                                  unit: p.unit || "pièces",
                                  price: p.price || 0,
                                  notes: p.notes || "",
                                  emoji: p.emoji || "📦",
                                  expiryDates: p.expiryDates || []
                                });
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition"
                              title="Modifier les détails"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Supprimer */}
                            <button
                              onClick={async () => {
                                if (confirm(`Voulez-vous vraiment supprimer "${p.name}" ?`)) {
                                  const updated = products.filter((item) => item.id !== p.id);
                                  await saveToServer(updated, categories, history, `Suppression de l'article : ${p.name}`);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Supprimer le produit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </section>

        </main>
      )}

      {/* Footer Global */}
      <footer className="max-w-7xl mx-auto w-full px-4 mt-6 text-center text-slate-400 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 PantryPal Collaborative - Code clair et pédagogique.</p>
        <p className="font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
          Système local-first sauvegardé en temps réel.
        </p>
      </footer>

      {/* ==========================================
          MODALS ET DIALOGUES DE CONFIGURATION
          ========================================== */}

      {/* 1. MODAL : AJOUTER / MODIFIER UN PRODUIT */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-xl"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">
                  {editingProduct ? `Modifier l'article` : "Ajouter un nouvel article"}
                </h3>
                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    isEditingRef.current = false;
                  }}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-5 space-y-4">
                
                {/* Nom du Produit */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nom du Produit</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Lait d'Amande Bio"
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Icône du produit (Unifiée) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Icône du Produit</label>
                  <IconPicker
                    emoji={prodForm.emoji}
                    imageUrl={prodForm.imageUrl}
                    onChange={(emoji, imageUrl) => setProdForm({ ...prodForm, emoji, imageUrl })}
                    accentColor="emerald"
                  />
                </div>

                {/* Catégorie et Unité */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Catégorie</label>
                    <select
                      value={prodForm.category}
                      onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.emoji} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Unité de Mesure</label>
                    <select
                      value={prodForm.unit}
                      onChange={(e) => setProdForm({ ...prodForm, unit: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="pièces">pièces (u)</option>
                      <option value="L">Litres (L)</option>
                      <option value="ml">Millilitres (ml)</option>
                      <option value="kg">Kilogrammes (kg)</option>
                      <option value="g">Grammes (g)</option>
                      <option value="paquets">paquets</option>
                      <option value="sachets">sachets</option>
                      <option value="bouteilles">bouteilles</option>
                      <option value="canettes">canettes</option>
                      <option value="briques">briques</option>
                      <option value="boîtes">boîtes (conserve)</option>
                      <option value="bocaux">bocaux</option>
                      <option value="pots">pots</option>
                      <option value="barquettes">barquettes</option>
                      <option value="rouleaux">rouleaux</option>
                      <option value="tranches">tranches</option>
                      <option value="gousses">gousses</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Lieu de Stockage</label>
                      <button 
                        type="button"
                        onClick={() => setIsStockLocationModalOpen(true)}
                        className="text-[9px] text-emerald-700 hover:underline font-bold"
                      >
                        Gérer +
                      </button>
                    </div>
                    <select
                      value={prodForm.stockLocation}
                      onChange={(e) => setProdForm({ ...prodForm, stockLocation: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium text-slate-800"
                    >
                      {stockLocations.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.emoji} {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quantité actuelle, seuil et prix */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Stock Actuel</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={prodForm.quantity}
                      onChange={(e) => setProdForm({ ...prodForm, quantity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Seuil Alerte (Min)</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={prodForm.minQuantity}
                      onChange={(e) => setProdForm({ ...prodForm, minQuantity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Prix Unitaire (€)</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={prodForm.price}
                      onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Gérer les dates de péremption du produit */}
                <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>🕒 Dates de Péremption liées</span>
                    <span className="text-[10px] text-slate-400 font-normal">Pour plusieurs arrivages</span>
                  </h4>
                  
                  {/* Liste des péremptions existantes */}
                  {prodForm.expiryDates.length === 0 ? (
                    <p className="text-[10px] text-slate-500 text-center py-1">Aucune date de péremption enregistrée.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-[100px] overflow-y-auto">
                      {prodForm.expiryDates.map((exp, i) => (
                        <div key={i} className="flex justify-between items-center text-[11px] bg-white p-1.5 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-700">
                            📅 {new Date(exp.date).toLocaleDateString("fr-FR")}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-slate-100 px-1 rounded font-bold text-slate-600">
                              Qté: {exp.quantity} {prodForm.unit}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const list = prodForm.expiryDates.filter((_, idx) => idx !== i);
                                setProdForm({ ...prodForm, expiryDates: list });
                              }}
                              className="text-rose-500 hover:text-rose-700 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Ajouter une date */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 items-end">
                    <div className="col-span-2">
                      <label className="block text-[9px] text-slate-500 font-bold uppercase mb-0.5">Nouvelle date d'expiration</label>
                      <input
                        type="date"
                        value={tempExpiry.date}
                        onChange={(e) => setTempExpiry({ ...tempExpiry, date: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!tempExpiry.date) return;
                          // Ajouter la date triée
                          const list = [...prodForm.expiryDates, { date: tempExpiry.date, quantity: Number(prodForm.quantity) }]
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                          setProdForm({ ...prodForm, expiryDates: list });
                          setTempExpiry({ date: "", quantity: 1 });
                        }}
                        className="w-full bg-slate-900 text-white py-1 rounded-lg text-xs font-bold hover:bg-slate-800"
                      >
                        + Lier
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProductModalOpen(false);
                      isEditingRef.current = false;
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. MODAL : GÉRER LES CATÉGORIES (Modification d'ordre / d'emojis) */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-md w-full overflow-hidden shadow-xl"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <span>⚙️</span> Gérer les Catégories de Produits
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-xs text-slate-500">
                  Modifiez l'ordre de priorité de tri de vos placards en montant ou descendant les catégories ou supprimez les catégories non désirées.
                </p>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {categories.map((cat, idx) => {
                    const isEditing = editingCategoryId === cat.id;
                    return (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl group"
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1 mr-2">
                            <input
                              type="text"
                              maxLength={2}
                              value={editCategoryForm.emoji}
                              onChange={(e) => setEditCategoryForm({ ...editCategoryForm, emoji: e.target.value })}
                              className="w-8 h-8 text-center text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <input
                              type="text"
                              value={editCategoryForm.name}
                              onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name: e.target.value })}
                              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1"
                            />
                            <button
                              onClick={async () => {
                                if (!editCategoryForm.name.trim()) return;
                                const updatedCats = categories.map((c) => {
                                  if (c.id === cat.id) {
                                    return {
                                      ...c,
                                      name: editCategoryForm.name.trim(),
                                      emoji: editCategoryForm.emoji || "📦"
                                    };
                                  }
                                  return c;
                                });
                                const detailText = `Modification de la catégorie : ${editCategoryForm.emoji} ${editCategoryForm.name}`;
                                await saveToServer(products, updatedCats, history, detailText);
                                setEditingCategoryId(null);
                              }}
                              className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-1 rounded hover:bg-emerald-700"
                            >
                              OK
                            </button>
                            <button
                              onClick={() => setEditingCategoryId(null)}
                              className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded hover:bg-slate-300"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-lg bg-white border border-slate-200 w-8 h-8 rounded-lg flex items-center justify-center shadow-inner">
                              {cat.emoji}
                            </span>
                            <span className="text-xs font-bold text-slate-800 truncate">{cat.name}</span>
                            <button
                              onClick={() => {
                                setEditingCategoryId(cat.id);
                                setEditCategoryForm({ name: cat.name || "", emoji: cat.emoji || "" });
                              }}
                              title="Modifier cette catégorie"
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-emerald-600 transition opacity-100 md:opacity-0 md:group-hover:opacity-100"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {!isEditing && (
                          <div className="flex items-center gap-1">
                            {/* Boutons monter / descendre */}
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveCategory(idx, "up")}
                              className="p-1 hover:bg-white rounded border border-slate-200 disabled:opacity-30 transition"
                            >
                              <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
                            </button>
                            <button
                              disabled={idx === categories.length - 1}
                              onClick={() => handleMoveCategory(idx, "down")}
                              className="p-1 hover:bg-white rounded border border-slate-200 disabled:opacity-30 transition"
                            >
                              <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                            </button>

                            <button
                              disabled={cat.id === "autre"}
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition ml-1 disabled:opacity-30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={handleAddCategory}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Créer une Catégorie</span>
                  </button>
                  <button
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold transition"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. MODAL : SÉLECTIONNER / GÉRER LES UTILISATEURS */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full overflow-hidden shadow-xl"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Gestion des Utilisateurs 👥</h3>
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sous-onglets de sélection/paramètres */}
              <div className="px-4 pt-3 flex gap-1 border-b border-slate-100">
                <button
                  onClick={() => setUserModalTab("select")}
                  className={`flex-1 pb-2 text-xs font-bold border-b-2 transition ${
                    userModalTab === "select"
                      ? "border-emerald-600 text-emerald-700"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  👤 Choisir Profil
                </button>
                <button
                  onClick={() => setUserModalTab("parameters")}
                  className={`flex-1 pb-2 text-xs font-bold border-b-2 transition ${
                    userModalTab === "parameters"
                      ? "border-emerald-600 text-emerald-700"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ⚙️ Paramètres
                </button>
              </div>

              <div className="p-4">
                {userModalTab === "select" ? (
                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-500">
                      Sélectionnez qui vous êtes pour enregistrer vos actions sous votre nom.
                    </p>

                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                      {users.map((user) => {
                        const color = getUserColor(user);
                        return (
                          <button
                            key={user}
                            onClick={() => {
                              setCurrentUser(user);
                              setIsUserModalOpen(false);
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
                              currentUser === user
                                ? `${color} border-slate-900 shadow-md`
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">
                              {user.substring(0, 2).toUpperCase()}
                            </span>
                            <span className="truncate">{user}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Ou connectez-vous sous un autre Prénom :
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ex: David"
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) {
                                handleAddUser(val).then(() => {
                                  setCurrentUser(val);
                                  setIsUserModalOpen(false);
                                });
                              }
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.currentTarget.previousSibling as HTMLInputElement;
                            const val = input.value.trim();
                            if (val) {
                              handleAddUser(val).then(() => {
                                setCurrentUser(val);
                                setIsUserModalOpen(false);
                              });
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                        >
                          Se connecter
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-500">
                      Ajoutez de nouveaux membres ou supprimez les comptes obsolètes de la liste collaborative.
                    </p>

                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {users.map((user) => {
                        const color = getUserColor(user);
                        return (
                          <div
                            key={user}
                            className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${color}`}>
                                {user.substring(0, 2).toUpperCase()}
                              </span>
                              <span className="text-xs font-bold text-slate-800 truncate">{user}</span>
                              {currentUser === user && (
                                <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold shrink-0">Moi</span>
                              )}
                            </div>
                            {userToDeleteConfirm === user ? (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] px-2 py-1 rounded-lg font-bold transition shrink-0 animate-pulse"
                                title="Cliquer pour confirmer la suppression"
                              >
                                Confirmer ?
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                disabled={users.length <= 1}
                                className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 disabled:opacity-30 transition shrink-0"
                                title="Supprimer cet utilisateur"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Nouveau Membre :
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nom (ex: Nicolas)"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddUser(newUserName);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddUser(newUserName)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MODAL D'INSTALLATION DE L'APPLICATION (PWA)
          ========================================== */}
      <AnimatePresence>
        {isPwaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Installer l'application Mobile 📲</h3>
                  <p className="text-[10px] text-slate-500">PantryPal - Gestion de Stock & Courses</p>
                </div>
                <button
                  onClick={() => setIsPwaModalOpen(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div className="text-center">
                  <span className="text-4xl">🍳</span>
                  <p className="text-xs text-slate-600 mt-2">
                    Ajoutez PantryPal à l'écran d'accueil de votre téléphone pour l'utiliser comme une vraie application : plein écran, sans barre d'adresse, et plus rapide !
                  </p>
                </div>

                {/* Bouton d'installation native (si supporté par Chrome/Android) */}
                {deferredPrompt ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                    <p className="text-xs font-semibold text-emerald-800 mb-2">Votre navigateur supporte l'installation directe !</p>
                    <button
                      onClick={async () => {
                        if (deferredPrompt) {
                          deferredPrompt.prompt();
                          const { outcome } = await deferredPrompt.userChoice;
                          if (outcome === "accepted") {
                            setDeferredPrompt(null);
                            setIsPwaModalOpen(false);
                          }
                        }
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span>Installer PantryPal maintenant</span>
                    </button>
                  </div>
                ) : (
                  <div className="border border-slate-150 rounded-2xl overflow-hidden">
                    {/* Instructions Manuelles par OS */}
                    <div className="bg-slate-50 border-b border-slate-100 p-2 flex gap-1">
                      <div className="flex-1 text-center font-bold text-xs text-slate-700 py-1 border-r border-slate-200 flex items-center justify-center gap-1.5">
                        🍎 iPhone / iPad (Safari)
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3 text-xs text-slate-700">
                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                        <p>Ouvrez cette page dans le navigateur <strong className="font-semibold text-slate-800">Safari</strong> sur votre iPhone.</p>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                        <p>Appuyez sur le bouton de <strong className="font-semibold text-slate-800">Partage</strong> en bas de l'écran (le carré avec une flèche vers le haut <span className="bg-slate-100 px-1 rounded">⎋</span>).</p>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                        <p>Faites défiler vers le bas et appuyez sur <strong className="font-semibold text-slate-800">Sur l'écran d'accueil</strong> (<span className="bg-slate-100 px-1 rounded">⊕</span>).</p>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                        <p>Validez en haut à droite avec le bouton <strong className="font-semibold text-emerald-700">Ajouter</strong>.</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border-t border-b border-slate-100 p-2 flex gap-1">
                      <div className="flex-1 text-center font-bold text-xs text-slate-700 py-1 flex items-center justify-center gap-1.5">
                        🤖 Android (Chrome)
                      </div>
                    </div>

                    <div className="p-4 space-y-3 text-xs text-slate-700">
                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                        <p>Ouvrez cette page dans <strong className="font-semibold text-slate-800">Google Chrome</strong> sur votre appareil Android.</p>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                        <p>Appuyez sur les <strong className="font-semibold text-slate-800">trois points verticaux</strong> en haut à droite de l'écran.</p>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                        <p>Sélectionnez <strong className="font-semibold text-slate-800">Installer l'application</strong> ou <strong className="font-semibold text-slate-800">Ajouter à l'écran d'accueil</strong>.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Copier le lien pour l'ouvrir facilement sur mobile */}
                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Adresse de l'application (à ouvrir sur mobile) :
                  </label>
                  <div className="flex gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 items-center">
                    <input
                      type="text"
                      readOnly
                      value={window.location.href.split("#")[0]}
                      className="bg-transparent border-none text-[10px] font-mono text-slate-600 flex-1 focus:outline-none focus:ring-0 select-all"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href.split("#")[0]);
                        alert("Lien copié ! Vous pouvez maintenant vous l'envoyer pour l'ouvrir sur votre mobile.");
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition shrink-0"
                    >
                      Copier
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => setIsPwaModalOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-bold transition text-center"
                >
                  J'ai compris
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MODAL : APPAREIL CAMERA / SCANNER TICKET & LISTE IA */}
      <AnimatePresence>
        {isScannerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-xl"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    {scannerType === "receipt" 
                      ? "Scanner de Ticket de Caisse par IA 📷" 
                      : "Photo de Liste de Courses par IA 📝"}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Alimenté par l'IA Gemini 3.5 Flash
                  </p>
                </div>
                <button
                  onClick={() => {
                    stopCamera();
                    setIsScannerOpen(false);
                    setScannedImageBase64(null);
                  }}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                
                {/* Zone d'affichage Camera ou Prévisualisation de la Photo Capturée */}
                <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-700 shadow-inner">
                  
                  {isCameraActive && (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                    />
                  )}

                  {!isCameraActive && scannedImageBase64 && (
                    <img
                      src={scannedImageBase64}
                      alt="Captured receipt"
                      className="w-full h-full object-contain"
                    />
                  )}

                  {!isCameraActive && !scannedImageBase64 && (
                    <div className="text-center p-6 text-slate-400 space-y-2">
                      <span className="text-4xl block">📸</span>
                      <p className="text-xs font-semibold">Prenez une photo ou importez une image</p>
                      <p className="text-[10px] text-slate-500">Pour extraire magiquement les produits en un clic.</p>
                    </div>
                  )}

                  {/* Boutons d'action superposés à la caméra */}
                  {isCameraActive && (
                    <button
                      onClick={capturePhoto}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white hover:bg-slate-100 text-slate-950 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-emerald-500 transition scale-110 active:scale-95"
                    >
                      📸
                    </button>
                  )}
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {/* Boutons de sélection de photo */}
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  {!isCameraActive && (
                    <button
                      onClick={startCamera}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      📹 Activer la Caméra
                    </button>
                  )}
                  {isCameraActive && (
                    <button
                      onClick={stopCamera}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition"
                    >
                      Désactiver la Caméra
                    </button>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-2 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    📁 Importer depuis ma galerie
                  </button>
                </div>

                {/* Exécution de l'IA */}
                {scannedImageBase64 && (
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={handleProcessImageWithIA}
                      disabled={isProcessingAI}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                    >
                      {isProcessingAI ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Analyse par l'IA Gemini en cours (environ 3s)...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
                          <span>
                            {scannerType === "receipt" 
                              ? "Extraire les produits du ticket de caisse" 
                              : "Extraire les produits de cette liste"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MODAL : APERÇU ET CONFIRMATION DES PRODUITS EXTRAITS PAR L'IA */}
      <AnimatePresence>
        {showAiPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-xl"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm">
                    {scannerType === "receipt" 
                      ? "Ticket de Caisse analysé avec succès ! 🧾" 
                      : "Liste de courses décodée ! 📝"}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {aiPreviewProducts.length} articles trouvés. Vérifiez et modifiez les quantités avant de les valider.
                  </p>
                </div>
                <button
                  onClick={() => setShowAiPreviewModal(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {aiPreviewProducts.map((p, idx) => {
                    const matchedCat = categories.find((c) => c.id === p.category);
                    
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-50 border border-slate-200 rounded-2xl gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Emoji */}
                          <input
                            type="text"
                            value={p.emoji ?? ""}
                            onChange={(e) => {
                              const updated = [...aiPreviewProducts];
                              updated[idx].emoji = e.target.value;
                              setAiPreviewProducts(updated);
                            }}
                            className="w-8 h-8 text-center text-lg bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none"
                          />
                          <div className="min-w-0">
                            {/* Nom du produit */}
                            <input
                              type="text"
                              value={p.name ?? ""}
                              onChange={(e) => {
                                const updated = [...aiPreviewProducts];
                                updated[idx].name = e.target.value;
                                setAiPreviewProducts(updated);
                              }}
                              className="font-semibold text-xs text-slate-800 bg-white border border-slate-100 rounded px-1 w-44 sm:w-56"
                            />
                            {/* Catégorie */}
                            <select
                              value={p.category ?? ""}
                              onChange={(e) => {
                                const updated = [...aiPreviewProducts];
                                updated[idx].category = e.target.value;
                                setAiPreviewProducts(updated);
                              }}
                              className="text-[10px] text-slate-500 bg-transparent focus:outline-none cursor-pointer"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.emoji} {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          {/* Quantité d'achat */}
                          <div className="flex items-center gap-1 shrink-0 bg-white border border-slate-200 rounded-lg px-2 py-0.5">
                            <span className="text-[10px] text-slate-400">Qté:</span>
                            <input
                              type="number"
                              value={p.quantity ?? 1}
                              onChange={(e) => {
                                const updated = [...aiPreviewProducts];
                                updated[idx].quantity = Number(e.target.value);
                                setAiPreviewProducts(updated);
                              }}
                              className="w-8 text-center text-xs font-extrabold text-slate-800 focus:outline-none"
                            />
                          </div>

                          {/* Prix */}
                          {scannerType === "receipt" && (
                            <div className="flex items-center gap-1 shrink-0 bg-white border border-slate-200 rounded-lg px-2 py-0.5">
                              <span className="text-[10px] text-slate-400">€:</span>
                              <input
                                type="number"
                                step="any"
                                value={p.price ?? 0}
                                onChange={(e) => {
                                  const updated = [...aiPreviewProducts];
                                  updated[idx].price = Number(e.target.value);
                                  setAiPreviewProducts(updated);
                                }}
                                className="w-12 text-center text-xs font-bold text-slate-800 focus:outline-none"
                              />
                            </div>
                          )}

                          {/* Retirer */}
                          <button
                            onClick={() => {
                              const updated = aiPreviewProducts.filter((_, i) => i !== idx);
                              setAiPreviewProducts(updated);
                            }}
                            className="p-1 hover:bg-rose-100 text-rose-500 rounded"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-[11px] text-emerald-800 flex items-start gap-1.5">
                  <span className="text-sm">⚡</span>
                  <p>
                    {scannerType === "receipt" 
                      ? "En validant, ces produits seront DIRECTEMENT ajoutés à votre stock actuel en quantité spécifiée." 
                      : "En validant, ces produits seront CONFIGURÉS pour s'ajouter automatiquement à votre liste de courses."}
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setShowAiPreviewModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmAIIntegration}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-md"
                  >
                    Confirmer l'importation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. MODAL : GESTION DES LISTES & WORKSPACES */}
      <AnimatePresence>
        {isWorkspaceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-md w-full overflow-hidden shadow-xl"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">📁 Mes Stocks & Listes Collaboratives</h3>
                <button
                  onClick={() => setIsWorkspaceModalOpen(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-[11px] text-slate-500">
                  Basculez entre différents stocks (ex: maison principal, chalet, bureau) ou créez-en un nouveau instantanément.
                </p>

                {/* Liste existante */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {allLists.map((lst) => {
                    const isActive = lst.id === listId;
                    return (
                      <div 
                        key={lst.id}
                        onClick={() => {
                          window.location.hash = lst.id;
                          setListId(lst.id);
                          setIsWorkspaceModalOpen(false);
                        }}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                          isActive 
                            ? "bg-emerald-50 border-emerald-500 shadow-sm" 
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">📂</span>
                            <span className="font-bold text-xs truncate text-slate-800">{lst.name || lst.id}</span>
                            <span className="font-mono text-[9px] text-slate-400 bg-slate-100 px-1 rounded">#{lst.id}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 truncate">
                            Dernière modif : {lst.lastModifiedBy} le {new Date(lst.lastModifiedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] bg-slate-200/80 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                            {lst.itemsCount} art.
                          </span>
                          {isActive && (
                            <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                              Actif
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Formulaire nouveau workspace */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700">🆕 Créer un nouveau Stock / Liste</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">ID (Ex: chalet-smith)</label>
                      <input
                        type="text"
                        required
                        placeholder="chalet-smith"
                        value={newWorkspaceId}
                        onChange={(e) => setNewWorkspaceId(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Nom (Ex: Mon Chalet)</label>
                      <input
                        type="text"
                        required
                        placeholder="Mon Chalet 🏔️"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newWorkspaceId.trim()) return;
                      const cleanId = newWorkspaceId.trim().toLowerCase().replace(/\s+/g, "-");
                      window.location.hash = cleanId;
                      setListId(cleanId);
                      
                      const newName = newWorkspaceName.trim() || `Liste : ${cleanId}`;
                      
                      fetch(`/api/lists/${cleanId}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: cleanId,
                          name: newName,
                          products: CLIENT_DEFAULT_PRODUCTS,
                          categories: CLIENT_DEFAULT_CATEGORIES,
                          stockLocations: CLIENT_DEFAULT_STOCK_LOCATIONS,
                          history: [],
                          logs: [{
                            user: currentUser,
                            date: new Date().toISOString(),
                            details: `Création du nouveau stock collaboratif : ${newName}`
                          }],
                          lastModifiedAt: new Date().toISOString(),
                          lastModifiedBy: currentUser
                        })
                      }).then(() => {
                        setListName(newName);
                        fetchList(true);
                        fetchAllLists();
                      });

                      setNewWorkspaceId("");
                      setNewWorkspaceName("");
                      setIsWorkspaceModalOpen(false);
                    }}
                    disabled={!newWorkspaceId.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    Créer et basculer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. MODAL : GESTION DES LIEUX DE STOCKAGE (Plusieurs stocks différents) */}
      <AnimatePresence>
        {isStockLocationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full overflow-hidden shadow-xl"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">⚙️ Gérer les lieux de stockage</h3>
                <button
                  onClick={() => setIsStockLocationModalOpen(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-[11px] text-slate-500">
                  Définissez les différents stocks physiques de cette liste (ex: Frigo, Cave, Congélateur).
                </p>

                {/* Lieux existants */}
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {stockLocations.map((loc) => {
                    const itemsInLoc = products.filter(p => p.stockLocation === loc.id).length;
                    return (
                      <div 
                        key={loc.id}
                        className="flex items-center justify-between p-2 rounded-xl border border-slate-100 bg-slate-50 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{loc.emoji}</span>
                          <span className="font-semibold text-slate-800">{loc.name}</span>
                          <span className="text-[10px] text-slate-400">({itemsInLoc} art.)</span>
                        </div>
                        {stockLocations.length > 1 && (
                          <button
                            type="button"
                            onClick={async () => {
                              const updatedLocs = stockLocations.filter(s => s.id !== loc.id);
                              const updatedProducts = products.map(p => {
                                if (p.stockLocation === loc.id) {
                                  return { ...p, stockLocation: updatedLocs[0]?.id || "cuisine" };
                                }
                                return p;
                              });
                              await saveToServer(
                                updatedProducts, 
                                categories, 
                                history, 
                                `Suppression du lieu de stockage : ${loc.name}`,
                                users,
                                updatedLocs
                              );
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 transition"
                            title="Supprimer ce lieu de stockage"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Formulaire ajout lieu de stockage */}
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const emoji = (form.elements.namedItem("emoji") as HTMLInputElement).value || "📦";
                    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
                    if (!name) return;
                    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");

                    if (stockLocations.some(s => s.id === id)) {
                      alert("Ce lieu de stockage existe déjà !");
                      return;
                    }

                    const newLoc: StockLocation = { id, name, emoji };
                    const updatedLocs = [...stockLocations, newLoc];

                    await saveToServer(
                      products,
                      categories,
                      history,
                      `Création du lieu de stockage : ${emoji} ${name}`,
                      users,
                      updatedLocs
                    );
                    form.reset();
                  }}
                  className="pt-3 border-t border-slate-100 space-y-3"
                >
                  <h4 className="text-xs font-bold text-slate-700">➕ Ajouter un lieu de stockage</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Emoji</label>
                      <input
                        name="emoji"
                        type="text"
                        maxLength={2}
                        defaultValue="🧴"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 text-center text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Nom du lieu</label>
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="Salle de Bain, Garage..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-sm"
                  >
                    Ajouter le lieu
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. MODAL : AJOUT EN LOT (BATCH ADD PRODUCTS) */}
      <AnimatePresence>
        {isBulkAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-xl"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                    <span>📦</span> {bulkAddStep === "input" ? "Ajout de produits en lot" : `Détecté : ${bulkAddDrafts.length} produits`}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {bulkAddStep === "input" 
                      ? "Ajoutez rapidement plusieurs articles à votre inventaire." 
                      : "Modifiez directement les détails de chaque produit détecté avant validation."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsBulkAddModalOpen(false);
                    setBulkAddStep("input");
                    setBulkAddDrafts([]);
                  }}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {bulkAddStep === "input" ? (
                  <>
                    {/* Zone de texte de saisie */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Liste des produits (Un par ligne ou séparés par des virgules)
                      </label>
                      <textarea
                        rows={5}
                        value={bulkAddText}
                        onChange={(e) => setBulkAddText(e.target.value)}
                        placeholder="Exemple :&#13;Lait demi-écrémé&#13;Beurre doux&#13;Fromage râpé, Pâtes Coquillettes"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                      />
                      <p className="text-[9px] text-slate-400 mt-1">
                        💡 Astuce : Les emojis correspondants seront détectés automatiquement (ex: Lait 🥛, Beurre 🧈) !
                      </p>
                    </div>

                    {/* Sélections de destination */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">📁 Catégorie</label>
                        <select
                          value={bulkAddCategory}
                          onChange={(e) => setBulkAddCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.emoji} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">🏠 Lieu de stockage</label>
                        <select
                          value={bulkAddStockLocation}
                          onChange={(e) => setBulkAddStockLocation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        >
                          {stockLocations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.emoji} {loc.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Configuration par défaut de quantité et d'unité */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Quantité initiale</label>
                        <input
                          type="number"
                          min={1}
                          value={bulkAddQuantity}
                          onChange={(e) => setBulkAddQuantity(Math.max(1, Number(e.target.value)))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Unité</label>
                        <select
                          value={bulkAddUnit}
                          onChange={(e) => setBulkAddUnit(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="pièces">pièces</option>
                          <option value="paquets">paquets</option>
                          <option value="sachets">sachets</option>
                          <option value="bouteilles">bouteilles</option>
                          <option value="canettes">canettes</option>
                          <option value="briques">briques</option>
                          <option value="boîtes">boîtes (conserve)</option>
                          <option value="bocaux">bocaux</option>
                          <option value="pots">pots</option>
                          <option value="barquettes">barquettes</option>
                          <option value="rouleaux">rouleaux</option>
                          <option value="tranches">tranches</option>
                          <option value="gousses">gousses</option>
                          <option value="L">Litres (L)</option>
                          <option value="ml">Millilitres (ml)</option>
                          <option value="kg">kilogrammes (kg)</option>
                          <option value="g">grammes (g)</option>
                        </select>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setBulkAddText("");
                          setIsBulkAddModalOpen(false);
                        }}
                        className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-2.5 rounded-xl text-xs transition"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={handleBulkAdd}
                        disabled={!bulkAddText.trim()}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-emerald-100"
                      >
                        Analyser & Configurer
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Liste des brouillons détectés modifiables directement */}
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {bulkAddDrafts.map((draft, idx) => (
                        <div key={draft.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-left relative">
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              maxLength={2}
                              value={draft.emoji}
                              onChange={(e) => {
                                const updated = bulkAddDrafts.map((d, i) => i === idx ? { ...d, emoji: e.target.value } : d);
                                setBulkAddDrafts(updated);
                              }}
                              className="w-10 text-center bg-white border border-slate-200 rounded-lg py-1 text-sm font-bold focus:ring-1 focus:ring-emerald-500"
                              placeholder="Emoji"
                            />
                            <input
                              type="text"
                              value={draft.name}
                              onChange={(e) => {
                                const updated = bulkAddDrafts.map((d, i) => i === idx ? { ...d, name: e.target.value } : d);
                                setBulkAddDrafts(updated);
                              }}
                              className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:ring-1 focus:ring-emerald-500"
                              placeholder="Nom"
                            />
                            <button
                              onClick={() => {
                                const updated = bulkAddDrafts.filter((_, i) => i !== idx);
                                setBulkAddDrafts(updated);
                              }}
                              className="p-1 hover:bg-slate-200 rounded text-rose-500 transition shrink-0"
                              title="Supprimer ce produit"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-400 uppercase">📁 Catégorie</label>
                              <select
                                value={draft.category}
                                onChange={(e) => {
                                  const updated = bulkAddDrafts.map((d, i) => i === idx ? { ...d, category: e.target.value } : d);
                                  setBulkAddDrafts(updated);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg px-1.5 py-1 text-[11px] font-semibold focus:ring-1 focus:ring-emerald-500"
                              >
                                {categories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-slate-400 uppercase">🏠 Stockage</label>
                              <select
                                value={draft.stockLocation}
                                onChange={(e) => {
                                  const updated = bulkAddDrafts.map((d, i) => i === idx ? { ...d, stockLocation: e.target.value } : d);
                                  setBulkAddDrafts(updated);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg px-1.5 py-1 text-[11px] font-semibold focus:ring-1 focus:ring-emerald-500"
                              >
                                {stockLocations.map((loc) => (
                                  <option key={loc.id} value={loc.id}>{loc.emoji} {loc.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-400 uppercase">Qté</label>
                              <input
                                type="number"
                                min={1}
                                value={draft.quantity}
                                onChange={(e) => {
                                  const val = Math.max(1, Number(e.target.value));
                                  const updated = bulkAddDrafts.map((d, i) => i === idx ? { ...d, quantity: val } : d);
                                  setBulkAddDrafts(updated);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg px-1.5 py-1 text-[11px] font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-slate-400 uppercase">Unité</label>
                              <select
                                value={draft.unit}
                                onChange={(e) => {
                                  const updated = bulkAddDrafts.map((d, i) => i === idx ? { ...d, unit: e.target.value } : d);
                                  setBulkAddDrafts(updated);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg px-1.5 py-1 text-[11px] font-semibold focus:ring-1 focus:ring-emerald-500"
                              >
                                <option value="pièces">pièces</option>
                                <option value="paquets">paquets</option>
                                <option value="bouteilles">bouteilles</option>
                                <option value="canettes">canettes</option>
                                <option value="L">L</option>
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                              </select>
                            </div>

                            <div className="relative">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase">Image</label>
                              <div className="flex gap-1">
                                <input
                                  type="text"
                                  value={draft.imageUrl || ""}
                                  onChange={(e) => {
                                    const updated = bulkAddDrafts.map((d, i) => i === idx ? { ...d, imageUrl: e.target.value } : d);
                                    setBulkAddDrafts(updated);
                                  }}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-1 py-1 text-[9px] focus:ring-1 focus:ring-emerald-500"
                                  placeholder="URL ou..."
                                />
                                <label className="cursor-pointer bg-slate-200 hover:bg-slate-300 rounded px-1.5 py-1 text-[9px] font-bold text-slate-600 shrink-0 transition flex items-center justify-center">
                                  📁
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleUploadBase64(file, (base64) => {
                                          const updated = bulkAddDrafts.map((d, i) => i === idx ? { ...d, imageUrl: base64 } : d);
                                          setBulkAddDrafts(updated);
                                        });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions de l'étape de brouillon */}
                    <div className="flex gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setBulkAddStep("input")}
                        className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-2.5 rounded-xl text-xs transition"
                      >
                        Retour à la saisie
                      </button>
                      <button
                        type="button"
                        onClick={handleBulkAdd}
                        disabled={bulkAddDrafts.length === 0}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-emerald-100"
                      >
                        Confirmer et Enregistrer ({bulkAddDrafts.length})
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
