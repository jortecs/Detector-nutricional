import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onScan, onClose }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    return () => {
      if (Quagga) {
        try {
          Quagga.stop();
        } catch (err) {
          console.log('Error al limpiar escáner:', err);
        }
      }
    };
  }, []);

  const startScanner = async () => {
    setIsInitializing(true);
    setError(null);
    
    try {
      // Configuración mínima y robusta
      await new Promise((resolve, reject) => {
        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment"
            },
          },
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "upc_reader"]
          }
        }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // Eventos simples
      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        console.log('Código detectado:', code);
        
        if (code && code.length >= 8) {
          onScan(code);
          stopScanner();
        }
      });

      Quagga.start();
      setIsInitializing(false);
      
    } catch (err) {
      console.error('Error al iniciar el escáner:', err);
      setIsInitializing(false);
      
      if (err.name === 'NotAllowedError') {
        setError('Permisos de cámara denegados. Permite el acceso a la cámara.');
      } else if (err.name === 'NotFoundError') {
        setError('No se encontró ninguna cámara en tu dispositivo.');
      } else {
        setError('Error al acceder a la cámara. Intenta de nuevo.');
      }
    }
  };

  const stopScanner = () => {
    try {
      if (Quagga) {
        Quagga.stop();
      }
    } catch (err) {
      console.log('Error al detener el escáner:', err);
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    startScanner();
  };

  const handleStopScan = () => {
    setIsScanning(false);
    stopScanner();
    onClose();
  };

  const handleRetry = () => {
    setError(null);
    handleStartScan();
  };

  return (
    <div className="scanner-modal">
      <div className="scanner-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
            Escanear código
          </h3>
          <button
            onClick={handleStopScan}
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
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="error-icon">
                <span style={{ color: '#dc2626', fontSize: '1.25rem' }}>⚠️</span>
              </div>
              <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.875rem', padding: '0.75rem' }}
            >
              Reintentar
            </button>
          </div>
        )}
        
        {!isScanning ? (
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
              <span style={{ color: '#d97706', fontSize: '1.5rem' }}>📷</span>
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Escanea un código de barras
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Haz clic para activar la cámara
            </p>
            <button
              onClick={handleStartScan}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Iniciar escáner
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div 
              ref={scannerRef}
              style={{
                width: '100%',
                height: '192px',
                background: '#f3f4f6',
                borderRadius: '16px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #d1d5db',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {isInitializing && (
                <div style={{ textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '2px solid #fef3c7',
                    borderTop: '2px solid #d97706',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 0.5rem'
                  }}></div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Activando cámara...
                  </p>
                </div>
              )}
            </div>
            
            <div style={{
              background: '#fef3c7',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                💡 Consejos:
              </h4>
              <ul style={{ color: '#92400e', fontSize: '0.75rem', textAlign: 'left', lineHeight: '1.4' }}>
                <li>• Mantén el código estable y bien iluminado</li>
                <li>• Distancia: 10-20 cm</li>
                <li>• Asegúrate de que el código esté completo</li>
              </ul>
            </div>
            
            <button
              onClick={handleStopScan}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
