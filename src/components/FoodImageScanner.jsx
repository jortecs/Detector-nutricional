import React, { useRef, useState } from 'react';
import { analyzeFoodImage } from '../services/foodImageService';

const FoodImageScanner = ({ onFoodDetected, onClose }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('La imagen es demasiado grande. Máximo 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFoodImageHandler = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeFoodImage(selectedImage);
      
      if (result.success) {
        onFoodDetected(result.data);
      } else {
        setError(result.error || 'Error al analizar la imagen');
      }
      
    } catch (err) {
      console.error('Error:', err);
      setError('Error al analizar la imagen. Intenta de nuevo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const takePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    setSelectedImage(null);
    setError(null);
    onClose();
  };

  return (
    <div className="scanner-modal">
      <div className="scanner-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
            Reconocer alimento
          </h3>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#9ca3af',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="error-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="error-icon">
                <span style={{ color: '#dc2626', fontSize: '1.25rem' }}>⚠️</span>
              </div>
              <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
            </div>
          </div>
        )}

        {!selectedImage ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#fef3c7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <span style={{ color: '#d97706', fontSize: '1.5rem' }}>🍎</span>
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Reconocer alimento por imagen
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Toma una foto o selecciona una imagen de un alimento
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                onClick={takePhoto}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                📷 Tomar foto
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                📁 Galería
              </button>
            </div>

            <div style={{
              background: '#fef3c7',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                💡 ¿Qué puede detectar?
              </h4>
              <ul style={{ color: '#92400e', fontSize: '0.75rem', textAlign: 'left', lineHeight: '1.4' }}>
                <li>• Frutas y verduras</li>
                <li>• Platos preparados</li>
                <li>• Bebidas y líquidos</li>
                <li>• Snacks y dulces</li>
                <li>• Tamaño y proporciones</li>
                <li>• Calorías aproximadas</li>
              </ul>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '100%',
              height: '200px',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '1.5rem',
              border: '2px solid #e5e7eb'
            }}>
              <img
                src={selectedImage}
                alt="Alimento seleccionado"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setSelectedImage(null)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cambiar imagen
              </button>
              <button
                onClick={analyzeFoodImageHandler}
                disabled={isAnalyzing}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                {isAnalyzing ? 'Analizando...' : 'Analizar alimento'}
              </button>
            </div>

            {isAnalyzing && (
              <div style={{
                background: '#dbeafe',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid #93c5fd',
                  borderTop: '2px solid #1e40af',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 0.5rem'
                }}></div>
                <p style={{ color: '#1e40af', fontSize: '0.875rem' }}>
                  Analizando imagen con IA...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodImageScanner;
