import React from 'react';

const ProductResults = ({ product, analysis, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border border-green-100">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Analizando producto...</h3>
          <p className="text-gray-600">Obteniendo información nutricional detallada</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 mt-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 rounded-full p-4 mr-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-800">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const getNutriScoreColor = (score) => {
    const colors = {
      'a': 'bg-green-500',
      'b': 'bg-lime-500',
      'c': 'bg-yellow-500',
      'd': 'bg-orange-500',
      'e': 'bg-red-500'
    };
    return colors[score?.toLowerCase()] || 'bg-gray-300';
  };

  const getEcoScoreColor = (score) => {
    const colors = {
      'a': 'bg-green-500',
      'b': 'bg-lime-500',
      'c': 'bg-yellow-500',
      'd': 'bg-orange-500',
      'e': 'bg-red-500'
    };
    return colors[score?.toLowerCase()] || 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border border-green-100">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Información del producto */}
        <div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
            
            {product.image && (
              <div className="mb-6">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full max-w-sm h-auto rounded-xl shadow-lg mx-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">🏷️</span>
                <span className="font-semibold text-gray-700">Marca:</span>
                <span className="ml-2 text-gray-600">{product.brands}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-green-600 mr-2">📦</span>
                <span className="font-semibold text-gray-700">Cantidad:</span>
                <span className="ml-2 text-gray-600">{product.quantity}</span>
              </div>

              {/* Scores */}
              <div className="flex space-x-6">
                {product.nutriScore && (
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">📊</span>
                    <span className="font-semibold text-gray-700 mr-2">Nutri-Score:</span>
                    <div className={`w-10 h-10 rounded-full ${getNutriScoreColor(product.nutriScore)} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {product.nutriScore.toUpperCase()}
                    </div>
                  </div>
                )}
                
                {product.ecoScore && (
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">🌱</span>
                    <span className="font-semibold text-gray-700 mr-2">Eco-Score:</span>
                    <div className={`w-10 h-10 rounded-full ${getEcoScoreColor(product.ecoScore)} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {product.ecoScore.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nutrientes y análisis */}
        <div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="text-blue-600 mr-2">📊</span>
              Información Nutricional
            </h3>
            
            {/* Nutrientes principales */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                <span className="text-blue-600 mr-2">⚡</span>
                Nutrientes (por 100g):
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(product.nutriments)
                  .filter(([key, value]) => 
                    ['energy-kcal_100g', 'fat_100g', 'carbohydrates_100g', 'proteins_100g', 'salt_100g', 'sugars_100g']
                    .includes(key) && value !== undefined
                  )
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center bg-white rounded-lg px-4 py-3 shadow-sm">
                      <span className="text-gray-700 font-medium">
                        {key.replace('_100g', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="font-bold text-green-600">{value}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Ingredientes */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                <span className="text-blue-600 mr-2">🥘</span>
                Ingredientes:
              </h4>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            </div>
          </div>

          {/* Análisis de IA */}
          {analysis && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
                <span className="text-purple-600 mr-2">🤖</span>
                Análisis Nutricional con IA
              </h4>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  {analysis}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductResults;
