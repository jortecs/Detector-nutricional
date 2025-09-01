import React from 'react';

const ProductResults = ({ product, analysis, loading, error }) => {
  if (loading) {
    return (
      <div className="results-container">
        <div className="result-card">
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div className="loading-spinner"></div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              Analizando producto...
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Obteniendo información nutricional
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="error-card">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="error-icon">
              <span style={{ color: '#dc2626', fontSize: '1.25rem' }}>⚠️</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.25rem' }}>
                Error
              </h3>
              <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const getNutriScoreColor = (score) => {
    const colors = {
      'a': '#10b981',
      'b': '#84cc16',
      'c': '#eab308',
      'd': '#f97316',
      'e': '#ef4444'
    };
    return colors[score?.toLowerCase()] || '#9ca3af';
  };

  const getEcoScoreColor = (score) => {
    const colors = {
      'a': '#10b981',
      'b': '#84cc16',
      'c': '#eab308',
      'd': '#f97316',
      'e': '#ef4444'
    };
    return colors[score?.toLowerCase()] || '#9ca3af';
  };

  return (
    <div className="results-container">
      {/* Información del producto */}
      <div className="result-card">
        <h2>{product.name}</h2>
        
        {product.image && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <img 
              src={product.image} 
              alt={product.name}
              style={{
                maxWidth: '200px',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <div className="nutrient-item">
            <span className="nutrient-label">Marca:</span>
            <span style={{ color: '#111827', fontSize: '0.875rem', fontWeight: '500' }}>
              {product.brands}
            </span>
          </div>
          
          <div className="nutrient-item">
            <span className="nutrient-label">Cantidad:</span>
            <span style={{ color: '#111827', fontSize: '0.875rem', fontWeight: '500' }}>
              {product.quantity}
            </span>
          </div>

          {product.type && (
            <div className="nutrient-item">
              <span className="nutrient-label">Tipo:</span>
              <span style={{ color: '#111827', fontSize: '0.875rem', fontWeight: '500' }}>
                {product.type}
              </span>
            </div>
          )}

          {/* Scores */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            {product.nutriScore && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="nutrient-label">Nutri-Score:</span>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: getNutriScoreColor(product.nutriScore),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>
                  {product.nutriScore.toUpperCase()}
                </div>
              </div>
            )}
            
            {product.ecoScore && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="nutrient-label">Eco-Score:</span>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: getEcoScoreColor(product.ecoScore),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>
                  {product.ecoScore.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información nutricional */}
      <div className="result-card">
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
          Información Nutricional
        </h3>
        
        {/* Nutrientes */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
            Nutrientes (por 100g):
          </h4>
          <div>
            {Object.entries(product.nutriments)
              .filter(([key, value]) => 
                ['energy-kcal_100g', 'fat_100g', 'carbohydrates_100g', 'proteins_100g', 'salt_100g', 'sugars_100g', 'fiber_100g']
                .includes(key) && value !== undefined && value !== "No especificado"
              )
              .map(([key, value]) => (
                <div key={key} className="nutrient-item">
                  <span className="nutrient-label">
                    {key.replace('_100g', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="nutrient-value">{value}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Ingredientes */}
        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
            Descripción:
          </h4>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid #f3f4f6'
          }}>
            <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {product.ingredients}
            </p>
          </div>
        </div>
      </div>

      {/* Beneficios y riesgos para alimentos detectados por IA */}
      {product.healthBenefits && product.healthRisks && (
        <div className="result-card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            Análisis de Salud
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            {/* Beneficios */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
                ✅ Beneficios:
              </h4>
              <ul style={{ color: '#166534', fontSize: '0.75rem', lineHeight: '1.4' }}>
                {product.healthBenefits.map((benefit, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem' }}>• {benefit}</li>
                ))}
              </ul>
            </div>

            {/* Riesgos */}
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
                ⚠️ Consideraciones:
              </h4>
              <ul style={{ color: '#dc2626', fontSize: '0.75rem', lineHeight: '1.4' }}>
                {product.healthRisks.map((risk, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem' }}>• {risk}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recomendaciones */}
          {product.recommendations && (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
                💡 Recomendaciones:
              </h4>
              <p style={{ color: '#92400e', fontSize: '0.75rem', lineHeight: '1.4' }}>
                {product.recommendations}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Análisis de IA */}
      {analysis && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '16px',
          padding: '1.5rem',
          marginTop: '1rem'
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#92400e',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🤖</span>
            Análisis Nutricional con IA
          </h4>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid #f3f4f6'
          }}>
            <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {analysis}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductResults;
