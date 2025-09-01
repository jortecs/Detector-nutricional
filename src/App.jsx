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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🥗 Detector Nutricional
          </h1>
          <p className="text-gray-600">
            Escanea códigos de barras para obtener información nutricional detallada
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label htmlFor="ean" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Barras (EAN)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="ean"
                  value={ean}
                  onChange={(e) => setEan(e.target.value)}
                  placeholder="Ej: 3017620422003"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <span className="text-gray-500">o</span>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                📷 Escanear con Cámara
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

        {/* Información adicional */}
        {!product && !loading && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              💡 Cómo usar la aplicación
            </h3>
            <ul className="text-blue-700 space-y-1">
              <li>• Introduce manualmente el código de barras del producto</li>
              <li>• O usa la cámara para escanear el código automáticamente</li>
              <li>• Obtén información nutricional detallada y análisis personalizado</li>
              <li>• Revisa el Nutri-Score y Eco-Score del producto</li>
            </ul>
          </div>
        )}
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
