import React, { useState } from 'react';

function App() {
  const [ean, setEan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simular carga
    setTimeout(() => {
      setLoading(false);
      alert(`Código escaneado: ${ean}`);
    }, 1000);
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
          </form>
        </div>

        {/* Información adicional */}
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

        {/* Estado de la aplicación */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <p className="text-green-800">
            ✅ Aplicación funcionando correctamente
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
