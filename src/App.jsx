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
    <div className="app-container">
      <div className="main-card">
        {/* Logo y nombre de la app */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-container">
            <img 
              src={logo} 
              alt="NutriScan Logo" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              display: 'none',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              NS
            </div>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            NutriScan
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Donde haya nutrición, hay salud
          </p>
        </div>

        {/* Botones principales */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setShowScanner(true)}
            className="btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            📷 Escanear código de barras
          </button>
          
          <div className="separator">
            <span>o</span>
          </div>

          <form onSubmit={handleManualSubmit} style={{ marginTop: '1rem' }}>
            <input
              type="text"
              value={ean}
              onChange={(e) => setEan(e.target.value)}
              placeholder="Introduce código EAN manualmente"
              className="input-field"
              style={{ marginBottom: '1rem' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              {loading ? 'Analizando...' : 'Buscar producto'}
            </button>
          </form>
        </div>

        {/* Sección de instrucciones */}
        <div className="instructions">
          <h3>¿Cómo funciona?</h3>
          <div className="instruction-item">
            <div className="instruction-number">1</div>
            <div className="instruction-text">
              Haz clic en <strong>Escanear código de barras</strong> para usar la cámara o introduce el código manualmente.
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">2</div>
            <div className="instruction-text">
              La app obtendrá información nutricional detallada usando <strong>OpenFoodFacts</strong> (servicio gratuito).
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">3</div>
            <div className="instruction-text">
              Recibe análisis personalizado con <strong>IA nutricional</strong> y consejos saludables.
            </div>
          </div>
        </div>

        {/* Resultados */}
        <ProductResults 
          product={product}
          analysis={analysis}
          loading={loading}
          error={error}
        />
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
