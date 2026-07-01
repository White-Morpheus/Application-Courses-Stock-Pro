import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enlarge request size limit to handle base64 images
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Data store path
const DATA_STORE_PATH = path.join(process.cwd(), "data_store.json");

// Default categories with pre-assigned orders and emojis
const DEFAULT_CATEGORIES = [
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

// Default stock locations
const DEFAULT_STOCK_LOCATIONS = [
  { id: "cuisine", name: "Cuisine (Général)", emoji: "🍳" },
  { id: "frigo", name: "Réfrigérateur", emoji: "🥛" },
  { id: "congelo", name: "Congélateur", emoji: "❄️" },
  { id: "placard", name: "Placard / Épicerie", emoji: "🥫" },
  { id: "cave", name: "Cave / Cellier", emoji: "🍾" }
];

// Default sample products
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Lait Demi-écrémé",
    emoji: "🥛",
    category: "produits-laitiers",
    stockLocation: "frigo",
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
    stockLocation: "cuisine",
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
    stockLocation: "placard",
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
    stockLocation: "frigo",
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
    stockLocation: "frigo",
    quantity: 0,
    minQuantity: 1,
    unit: "paquets",
    price: 2.89,
    expiryDates: [],
    lastBoughtTimes: 5,
    totalExpenses: 14.45
  }
];

// Helper to read data
function readDataStore() {
  try {
    if (fs.existsSync(DATA_STORE_PATH)) {
      const content = fs.readFileSync(DATA_STORE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading data store:", err);
  }
  return {};
}

// Helper to write data
function writeDataStore(data: any) {
  try {
    fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to data store:", err);
  }
}

// Initialize default store if empty
const store = readDataStore();
if (!store.lists) {
  store.lists = {};
  writeDataStore(store);
}

// Lazy init for Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not set in environment secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
    });
  }
  return aiClient;
}

// API Routes

// 0. Get list of all lists summaries (List of existing lists)
app.get("/api/lists", (req, res) => {
  const currentStore = readDataStore();
  if (!currentStore.lists) {
    currentStore.lists = {};
  }
  
  // Return list of available lists with basic metadata
  const listSummaries = Object.values(currentStore.lists).map((list: any) => ({
    id: list.id,
    name: list.name || `Liste : ${list.id}`,
    lastModifiedAt: list.lastModifiedAt || new Date().toISOString(),
    lastModifiedBy: list.lastModifiedBy || "Système",
    itemsCount: list.products ? list.products.length : 0
  }));
  
  res.json(listSummaries);
});

// 1. Get List (with auto initialization)
app.get("/api/lists/:listId", (req, res) => {
  const { listId } = req.params;
  const currentStore = readDataStore();
  
  if (!currentStore.lists) {
    currentStore.lists = {};
  }

  // If list doesn't exist, bootstrap it with defaults
  if (!currentStore.lists[listId]) {
    currentStore.lists[listId] = {
      id: listId,
      name: listId === "default" ? "Ma Liste de Courses & Stock" : `Liste : ${listId}`,
      products: [...DEFAULT_PRODUCTS],
      categories: [...DEFAULT_CATEGORIES],
      stockLocations: [...DEFAULT_STOCK_LOCATIONS],
      history: [
        {
          id: "hist-1",
          date: "2026-06-25T14:30:00Z",
          user: "Lucas",
          totalPrice: 24.35,
          itemsCount: 6,
          items: [
            { name: "Pommes Gala", emoji: "🍎", quantity: 5, price: 0.40 },
            { name: "Lait Demi-écrémé", emoji: "🥛", quantity: 2, price: 1.15 },
            { name: "Yaourts Nature x4", emoji: "🥣", quantity: 3, price: 1.45 },
            { name: "Jambon Cuit sans Couenne", emoji: "🥩", quantity: 2, price: 2.89 },
            { name: "Pâtes Penne Rigate", emoji: "🍝", quantity: 1, price: 1.80 },
            { name: "Eau Minérale Pack", emoji: "🥤", quantity: 2, price: 3.50 }
          ]
        }
      ],
      logs: [{
        user: "Système",
        date: new Date().toISOString(),
        details: "Création de la liste partagée."
      }],
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: "Système",
      users: ["Lucas", "Marie", "Sophie", "Thomas", "Emma"]
    };
    writeDataStore(currentStore);
  } else {
    // If it exists but doesn't have stockLocations yet, add them
    if (!currentStore.lists[listId].stockLocations) {
      currentStore.lists[listId].stockLocations = [...DEFAULT_STOCK_LOCATIONS];
      writeDataStore(currentStore);
    }
  }

  res.json(currentStore.lists[listId]);
});

// 2. Save / Update List State
app.post("/api/lists/:listId", (req, res) => {
  const { listId } = req.params;
  const updatedData = req.body; // Expect complete structure
  const currentStore = readDataStore();

  if (!currentStore.lists) {
    currentStore.lists = {};
  }

  const user = updatedData.lastModifiedBy || "Anonyme";
  const timestamp = new Date().toISOString();

  currentStore.lists[listId] = {
    id: listId,
    name: updatedData.name || currentStore.lists[listId]?.name || `Liste : ${listId}`,
    products: updatedData.products || [],
    categories: updatedData.categories || DEFAULT_CATEGORIES,
    stockLocations: updatedData.stockLocations || currentStore.lists[listId]?.stockLocations || DEFAULT_STOCK_LOCATIONS,
    history: updatedData.history || [],
    logs: updatedData.logs || [],
    lastModifiedAt: timestamp,
    lastModifiedBy: user,
    users: updatedData.users || currentStore.lists[listId]?.users || ["Lucas", "Marie", "Sophie", "Thomas", "Emma"]
  };

  writeDataStore(currentStore);
  res.json(currentStore.lists[listId]);
});

// 3. Scan Receipt API (IA)
app.post("/api/scan-receipt", async (req, res) => {
  try {
    const { imageBase64, mimeType, categories } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: "Une image sous forme de base64 est requise." });
    }

    const ai = getGeminiClient();
    const categoriesString = categories && categories.length > 0
      ? categories.map((c: any) => `"${c.name}" (id: "${c.id}")`).join(", ")
      : "Produits Laitiers, Fruits & Légumes, Épicerie Salée, Épicerie Sucrée, Boissons, Viandes & Poissons, Entretien & Maison, Hygiène & Beauté, Autre";

    const prompt = `Tu es un assistant IA spécialisé dans l'analyse de tickets de caisse de courses de supermarché. 
Analyse l'image du ticket de caisse de courses fournie et extrait tous les articles achetés sous forme de données JSON structurées.
Pour chaque produit du ticket de caisse, extrait précisément :
1. "name" : Le nom exact nettoyé en français (par exemple 'Lait Demi-Écrémé' et non 'LAIT D.ECR 1L' ou 'PANZANI MACAR 500G' en 'Pâtes Macaroni').
2. "quantity" : La quantité achetée (un nombre entier, par défaut 1).
3. "price" : Le prix de l'article ou le prix unitaire estimé en euros (un nombre décimal, par défaut 0).
4. "category" : L'id de la catégorie correspondante parmi les id suivantes : ${categoriesString}. Assigne à l'id de la catégorie la plus logique. Si aucune ne convient, utilise 'autre'.
5. "emoji" : Un seul emoji unique adapté au produit.

Renvoie STRICTEMENT un tableau d'objets JSON sous la clé "products", sans texte explicatif ni démarqueurs markdown additionnels. Respecte le schéma JSON requis.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, prompt],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            products: {
              type: Type.ARRAY,
              description: "Liste des produits extraits du ticket de caisse",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.INTEGER },
                  price: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                  emoji: { type: Type.STRING }
                },
                required: ["name", "quantity", "price", "category", "emoji"]
              }
            }
          },
          required: ["products"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("L'IA n'a pas pu générer de texte pour l'image donnée.");
    }

    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err: any) {
    console.error("Error scanning receipt with Gemini:", err);
    res.status(500).json({ error: "Erreur lors de l'analyse du ticket par l'IA : " + err.message });
  }
});

// 4. Extract Grocery List Photo API (IA)
app.post("/api/extract-list", async (req, res) => {
  try {
    const { imageBase64, mimeType, categories } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Une image de liste sous forme de base64 est requise." });
    }

    const ai = getGeminiClient();
    const categoriesString = categories && categories.length > 0
      ? categories.map((c: any) => `"${c.name}" (id: "${c.id}")`).join(", ")
      : "Produits Laitiers, Fruits & Légumes, Épicerie Salée, Épicerie Sucrée, Boissons, Viandes & Poissons, Entretien & Maison, Hygiène & Beauté, Autre";

    const prompt = `Tu es un assistant IA spécialisé dans la lecture de listes de courses manuscrites ou imprimées en photo.
Analyse la photo de la liste de courses fournie et extrait tous les articles listés sous forme de données JSON structurées.
Pour chaque produit mentionné, extrait :
1. "name" : Le nom de l'article écrit en français (ex: 'Lait de soja', 'Tomates cerises').
2. "quantity" : La quantité écrite ou implicite (un nombre décimal ou entier, par défaut 1).
3. "unit" : L'unité correspondante si spécifiée, par exemple : 'pièces', 'kg', 'l', 'paquets', 'g'. Par défaut 'pièces'.
4. "category" : L'id de la catégorie correspondante parmi les id suivantes : ${categoriesString}. Associe chaque produit à l'id le plus logique. Si aucun ne convient, utilise 'autre'.
5. "emoji" : Un emoji adapté au produit.

Renvoie STRICTEMENT un tableau d'objets JSON sous la clé "products" sans texte additionnel. Respecte le schéma JSON requis.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, prompt],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            products: {
              type: Type.ARRAY,
              description: "Liste des produits extraits de la photo",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  category: { type: Type.STRING },
                  emoji: { type: Type.STRING }
                },
                required: ["name", "quantity", "unit", "category", "emoji"]
              }
            }
          },
          required: ["products"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("L'IA n'a pas pu lire l'image de la liste de courses.");
    }

    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err: any) {
    console.error("Error extracting list with Gemini:", err);
    res.status(500).json({ error: "Erreur lors de l'extraction de la liste par l'IA : " + err.message });
  }
});


// Serve React build outputs in production, and configure Vite dev middleware in development
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK] Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
