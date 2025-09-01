import React, { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import ProductResults from './components/ProductResults';
import { getProductInfo } from './services/openFoodFactsService';
import { getNutritionalAnalysis } from './services/openAIService';

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header con diseño mejorado */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-white rounded-full p-4 shadow-lg mr-4">
                <span className="text-4xl">🥗</span>
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">
                  NutriScan
                </h1>
                <p className="text-green-100 text-lg">
                  Tu compañero inteligente para una alimentación saludable
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tarjeta principal con diseño atractivo */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-green-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Descubre el poder de la nutrición
              </h2>
              <p className="text-gray-600 text-lg">
                Escanea cualquier producto y obtén información nutricional detallada
              </p>
            </div>

            {/* Formulario mejorado */}
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <label htmlFor="ean" className="block text-sm font-semibold text-gray-700 mb-3">
                  <span className="text-green-600 mr-2">📊</span>
                  Código de Barras (EAN)
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    id="ean"
                    value={ean}
                    onChange={(e) => setEan(e.target.value)}
                    placeholder="Ej: 3017620422003"
                    className="flex-1 px-6 py-4 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 text-lg transition-all duration-200"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Analizando...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🔍</span>
                        Buscar
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="px-4 text-gray-500 font-medium">o</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center mx-auto"
                >
                  <span className="mr-2">📷</span>
                  Escanear con Cámara
                </button>
              </div>
            </form>
          </div>

          {/* Resultados */}
          <ProductResults 
            product={product}
            analysis={analysis}
            loading={loading}
            error={error}
          />

          {/* Información adicional con diseño mejorado */}
          {!product && !loading && !error && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-8 mt-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-800 mb-4">
                  ¿Cómo funciona NutriScan?
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-3 mt-1">
                        <span className="text-green-600">📱</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Escaneo Inteligente</h4>
                        <p className="text-gray-600">Usa tu cámara para escanear códigos de barras automáticamente</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                        <span className="text-blue-600">🔍</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Búsqueda Manual</h4>
                        <p className="text-gray-600">Introduce códigos EAN manualmente para obtener información</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purple-100 rounded-full p-2 mr-3 mt-1">
                        <span className="text-purple-600">📊</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Análisis Detallado</h4>
                        <p className="text-gray-600">Obtén nutrientes, Nutri-Score y Eco-Score del producto</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-2 mr-3 mt-1">
                        <span className="text-orange-600">🤖</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">IA Nutricional</h4>
                        <p className="text-gray-600">Recibe consejos personalizados de un nutricionista virtual</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer con información adicional */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 border border-green-100">
            <div className="text-center">
              <div className="flex justify-center space-x-6 mb-4">
                <div className="flex items-center text-green-600">
                  <span className="text-2xl mr-2">🌱</span>
                  <span className="font-semibold">Saludable</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <span className="text-2xl mr-2">⚡</span>
                  <span className="font-semibold">Rápido</span>
                </div>
                <div className="flex items-center text-purple-600">
                  <span className="text-2xl mr-2">🔒</span>
                  <span className="font-semibold">Seguro</span>
                </div>
              </div>
              <p className="text-gray-600">
                NutriScan te ayuda a tomar decisiones alimentarias más informadas y saludables
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal del escáner */}
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
