import React from 'react';

const ProductResults = ({ product, analysis, loading, error }) => {
  if (loading) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Analizando producto...</h3>
          <p className="text-gray-600 text-sm">Obteniendo información nutricional</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-red-600 text-lg">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error</h3>
            <p className="text-red-600 text-sm">{error}</p>
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
    <div className="mt-8 space-y-6">
      {/* Product Information */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{product.name}</h2>
        
        {product.image && (
          <div className="mb-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full max-w-xs h-auto rounded-xl mx-auto shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-16">Marca:</span>
            <span className="text-gray-800 font-medium">{product.brands}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-16">Cantidad:</span>
            <span className="text-gray-800 font-medium">{product.quantity}</span>
          </div>

          {/* Scores */}
          <div className="flex items-center space-x-6 pt-2">
            {product.nutriScore && (
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-2">Nutri-Score:</span>
                <div className={`w-8 h-8 rounded-full ${getNutriScoreColor(product.nutriScore)} flex items-center justify-center text-white font-bold text-sm`}>
                  {product.nutriScore.toUpperCase()}
                </div>
              </div>
            )}
            
            {product.ecoScore && (
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-2">Eco-Score:</span>
                <div className={`w-8 h-8 rounded-full ${getEcoScoreColor(product.ecoScore)} flex items-center justify-center text-white font-bold text-sm`}>
                  {product.ecoScore.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nutritional Information */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Nutricional</h3>
        
        {/* Nutrients */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Nutrientes (por 100g):</h4>
          <div className="space-y-2">
            {Object.entries(product.nutriments)
              .filter(([key, value]) => 
                ['energy-kcal_100g', 'fat_100g', 'carbohydrates_100g', 'proteins_100g', 'salt_100g', 'sugars_100g']
                .includes(key) && value !== undefined
              )
              .map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600">
                    {key.replace('_100g', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="text-sm font-semibold text-amber-600">{value}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Ingredientes:</h4>
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              {product.ingredients}
            </p>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      {analysis && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
          <h4 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
            <span className="mr-2">🤖</span>
            Análisis Nutricional con IA
          </h4>
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              {analysis}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductResults;
