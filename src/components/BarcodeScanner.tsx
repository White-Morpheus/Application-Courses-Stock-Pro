import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, Loader2 } from "lucide-react";

interface BarcodeScannerProps {
  onResult: (result: {
    barcode?: string;
    name?: string;
    quantity?: string;
    unit?: string;
    imageUrl?: string;
    category?: string;
  }) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onResult, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let isComponentMounted = true;
    const containerElement = document.getElementById("reader-container");
    if (!containerElement) return;

    // Generate a unique ID for this effect execution
    const currentScannerId = `reader-${Math.random().toString(36).substring(2, 9)}`;
    const scannerDiv = document.createElement("div");
    scannerDiv.id = currentScannerId;
    scannerDiv.style.width = "100%";
    scannerDiv.style.height = "100%";
    
    // Clear any previous stray divs (important for StrictMode)
    containerElement.innerHTML = '';
    containerElement.appendChild(scannerDiv);

    const html5QrCode = new Html5Qrcode(currentScannerId);
    html5QrCodeRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            if (!isComponentMounted) return;
            
            // Empêcher les scans multiples
            if (html5QrCode.getState() !== 2) return; // 2 = SCANNING
            try {
              html5QrCode.pause(true);
            } catch (e) {
              console.error(e);
            }
            
            setIsLoading(true);
            setError(null);
            setScannedBarcode(decodedText);
            
            try {
              let product = null;
              
              // Liste des APIs à tester
              const openFactsApis = [
                `https://world.openfoodfacts.org/api/v0/product/${decodedText}.json`,
                `https://world.openbeautyfacts.org/api/v0/product/${decodedText}.json`,
                `https://world.openproductsfacts.org/api/v0/product/${decodedText}.json`
              ];

              // Tester les bases de données "Open Facts"
              for (const api of openFactsApis) {
                try {
                  const response = await fetch(api);
                  if (response.ok) {
                    const data = await response.json();
                    if (data.status === 1 && data.product) {
                      product = data.product;
                      break;
                    }
                  }
                } catch (e) {
                  console.warn(`Erreur API ${api}`, e);
                }
              }

              // Fallback vers UPCItemDB si non trouvé
              if (!product) {
                try {
                  const upcRes = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${decodedText}`);
                  if (upcRes.ok) {
                    const data = await upcRes.json();
                    if (data.code === 'OK' && data.items && data.items.length > 0) {
                      product = {
                        product_name: data.items[0].title,
                        image_url: data.items[0].images && data.items[0].images.length > 0 ? data.items[0].images[0] : "",
                        generic_name: data.items[0].description || ""
                      };
                    }
                  }
                } catch (e) {
                  console.warn("Erreur UPCItemDB", e);
                }
              }
              
              if (product) {
                let unit = "pièces";
                let quantity = "1";
                
                // Essayer d'extraire la quantité et l'unité de "quantity" (ex: "500 g", "1.5 l")
                if (product.quantity) {
                   const qtyStr = product.quantity.toLowerCase();
                   if (qtyStr.includes("kg")) { unit = "kg"; quantity = qtyStr.replace(/[^\d.]/g, ''); }
                   else if (qtyStr.includes("g")) { unit = "g"; quantity = qtyStr.replace(/[^\d.]/g, ''); }
                   else if (qtyStr.includes("l")) { unit = "L"; quantity = qtyStr.replace(/[^\d.]/g, ''); }
                   else if (qtyStr.includes("ml")) { unit = "ml"; quantity = qtyStr.replace(/[^\d.]/g, ''); }
                   else if (qtyStr.includes("cl")) { unit = "ml"; quantity = String(Number(qtyStr.replace(/[^\d.]/g, '')) * 10); }
                }
                
                onResult({
                  barcode: decodedText,
                  name: product.product_name || product.generic_name || "",
                  imageUrl: product.image_url || product.image_front_small_url || "",
                  unit: unit,
                  quantity: quantity,
                  category: "autre",
                });
              } else {
                setError("Produit introuvable dans la base de données. Code: " + decodedText);
                if (html5QrCode.getState() === 3 && isComponentMounted) { // 3 = PAUSED
                  try { html5QrCode.resume(); } catch (e) {}
                }
              }
            } catch (err) {
              setError("Erreur lors de la recherche du produit.");
              if (html5QrCode.getState() === 3 && isComponentMounted) { // 3 = PAUSED
                try { html5QrCode.resume(); } catch (e) {}
              }
            } finally {
              if (isComponentMounted) {
                setIsLoading(false);
              }
            }
          },
          (errorMessage) => {
             // onScanFailure - ignorer
          }
        );
      } catch (err: any) {
        if (isComponentMounted) {
          setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
        }
      }
    };

    startScanner();

    return () => {
      isComponentMounted = false;
      const cleanup = async () => {
        try {
          if (html5QrCode.isScanning) {
            await html5QrCode.stop();
          }
          html5QrCode.clear();
        } catch (error) {
          console.error("Cleanup error:", error);
        } finally {
          if (containerElement && containerElement.contains(scannerDiv)) {
             containerElement.removeChild(scannerDiv);
          }
        }
      };
      cleanup();
    };
  }, [onResult]);

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <Camera className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Scanner un produit</h2>
            <p className="text-xs text-slate-500 font-medium">Placez le code-barres dans le cadre</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-2 border border-slate-200 mb-4 overflow-hidden relative min-h-[250px] flex items-center justify-center">
          <div id="reader-container" className="w-full h-full rounded-xl overflow-hidden [&_video]:rounded-xl [&_video]:object-cover" />
          {!error && !isLoading && (
            <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-xl pointer-events-none" />
          )}
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl font-semibold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Recherche des informations...
          </div>
        )}

        {error && !isLoading && (
          <div className="text-sm font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl flex flex-col gap-3">
            <span>{error}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setError(null);
                  if (html5QrCodeRef.current?.getState() === 3) { // 3 = PAUSED
                    try { html5QrCodeRef.current.resume(); } catch (e) {}
                  }
                }}
                className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold"
              >
                Réessayer
              </button>
              {scannedBarcode && (
                <button
                  onClick={() => {
                    onResult({ barcode: scannedBarcode });
                  }}
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold"
                >
                  Ajouter manuellement
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
