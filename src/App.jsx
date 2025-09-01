import React, { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import ProductResults from './components/ProductResults';
import { getProductInfo } from './services/openFoodFactsService';
import { getNutritionalAnalysis } from './services/openAIService';
import logo from './assets/logo.png';

function App() {
  const [ean, setEan] = useState('');
  const [product, setProduct] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleSearch = async (searchEan) => {
    if (!searchEan.trim()) {
      setError('Por favor, introduce un código de barras válido');
      return;
    }

    setLoading(true);
    setError(null);
    setProduct(null);
    setAnalysis(null);

    try {
      // Obtener información del producto
      const productResult = await getProductInfo(searchEan);
      
      if (!productResult.success) {
        setError(productResult.error);
        setLoading(false);
        return;
      }

      setProduct(productResult.data);

      // Obtener análisis de IA
      const analysisResult = await getNutritionalAnalysis(productResult.data);
      
      if (analysisResult.success) {
        setAnalysis(analysisResult.data);
      } else {
        console.warn('Error en análisis de IA:', analysisResult.error);
        // No mostramos error si falla la IA, solo el análisis
      }

    } catch (err) {
      setError('Error al procesar la solicitud');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (scannedEan) => {
    setEan(scannedEan);
    setShowScanner(false);
    handleSearch(scannedEan);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleSearch(ean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Background decorative icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-amber-200 text-8xl opacity-20">🥗</div>
        <div className="absolute top-40 right-20 text-orange-200 text-6xl opacity-20">🍎</div>
        <div className="absolute bottom-40 left-20 text-red-200 text-7xl opacity-20">🥑</div>
        <div className="absolute bottom-20 right-10 text-amber-200 text-6xl opacity-20">🥦</div>
        <div className="absolute top-1/2 left-1/4 text-orange-200 text-5xl opacity-20">🥕</div>
        <div className="absolute top-1/3 right-1/3 text-red-200 text-6xl opacity-20">🍅</div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          {/* Logo and App Name */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 p-2 shadow-lg">
              <img 
                src={logo} 
                alt="NutriScan Logo" 
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{display: 'none'}}>
                NS
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              NutriScan
            </h1>
            <p className="text-gray-600 text-sm">
              Donde haya nutrición, hay salud
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="space-y-4 mb-8">
            <button
              onClick={() => setShowScanner(true)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            >
              <span className="mr-2">📷</span>
              Escanear código de barras
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <input
                type="text"
                value={ean}
                onChange={(e) => setEan(e.target.value)}
                placeholder="Introduce código EAN manualmente"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-amber-400 focus:outline-none transition-colors duration-200"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analizando...' : 'Buscar producto'}
              </button>
            </form>
          </div>

          {/* How it works section */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold text-amber-700 mb-4 text-center">
              ¿Cómo funciona?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="bg-amber-100 text-amber-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                <p>Haz clic en <strong>Escanear código de barras</strong> para usar la cámara o introduce el código manualmente.</p>
              </div>
              <div className="flex items-start">
                <span className="bg-amber-100 text-amber-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                <p>La app obtendrá información nutricional detallada usando <strong>OpenFoodFacts</strong> (servicio gratuito).</p>
              </div>
              <div className="flex items-start">
                <span className="bg-amber-100 text-amber-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                <p>Recibe análisis personalizado con <strong>IA nutricional</strong> y consejos saludables.</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <ProductResults 
            product={product}
            analysis={analysis}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <BarcodeScanner 
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

export default App;
