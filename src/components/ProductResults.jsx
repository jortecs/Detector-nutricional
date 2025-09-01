import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const ProductResults = ({ product, analysis, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <LoadingSpinner message="Analizando producto..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
        <div className="flex items-center">
          <div className="text-red-500 text-xl mr-2">⚠️</div>
          <div>
            <h3 className="text-red-800 font-semibold">Error</h3>
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
      'b': 'bg-light-green-500',
      'c': 'bg-yellow-500',
      'd': 'bg-orange-500',
      'e': 'bg-red-500'
    };
    return colors[score?.toLowerCase()] || 'bg-gray-300';
  };

  const getEcoScoreColor = (score) => {
    const colors = {
      'a': 'bg-green-500',
      'b': 'bg-light-green-500',
      'c': 'bg-yellow-500',
      'd': 'bg-orange-500',
      'e': 'bg-red-500'
    };
    return colors[score?.toLowerCase()] || 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Información del producto */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h2>
          
          {product.image && (
            <div className="mb-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full max-w-xs h-auto rounded-lg shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-700">Marca:</span>
              <span className="ml-2 text-gray-600">{product.brands}</span>
            </div>
            
            <div>
              <span className="font-semibold text-gray-700">Cantidad:</span>
              <span className="ml-2 text-gray-600">{product.quantity}</span>
            </div>

            {/* Scores */}
            <div className="flex space-x-4">
              {product.nutriScore && (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">Nutri-Score:</span>
                  <div className={`w-8 h-8 rounded-full ${getNutriScoreColor(product.nutriScore)} flex items-center justify-center text-white font-bold`}>
                    {product.nutriScore.toUpperCase()}
                  </div>
                </div>
              )}
              
              {product.ecoScore && (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">Eco-Score:</span>
                  <div className={`w-8 h-8 rounded-full ${getEcoScoreColor(product.ecoScore)} flex items-center justify-center text-white font-bold`}>
                    {product.ecoScore.toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nutrientes y análisis */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Información Nutricional</h3>
          
          {/* Nutrientes principales */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Nutrientes (por 100g):</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(product.nutriments)
                .filter(([key, value]) => 
                  ['energy-kcal_100g', 'fat_100g', 'carbohydrates_100g', 'proteins_100g', 'salt_100g', 'sugars_100g']
                  .includes(key) && value !== undefined
                )
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">
                      {key.replace('_100g', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                    </span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Ingredientes */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Ingredientes:</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.ingredients}
            </p>
          </div>

          {/* Análisis de IA */}
          {analysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Análisis Nutricional</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                {analysis}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductResults;
