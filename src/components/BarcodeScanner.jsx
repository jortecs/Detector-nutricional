import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onScan, onClose }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

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
    setDebugInfo('');
    
    try {
      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a la cámara');
      }

      // Inicializar Quagga con configuración universal
      await new Promise((resolve, reject) => {
        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 },
              facingMode: "environment"
            },
          },
          decoder: {
            readers: [
              "ean_reader",
              "ean_8_reader", 
              "code_128_reader",
              "code_39_reader",
              "upc_reader",
              "upc_e_reader",
              "codabar_reader"
            ]
          },
          locate: true,
          frequency: 10
        }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // Configurar eventos después de inicializar
      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        const format = result.codeResult.format;
        console.log('Código detectado:', code, 'Formato:', format);
        setDebugInfo(`Detectado: ${code} (${format})`);
        
        // Validar que el código tenga al menos 8 dígitos
        if (code && code.length >= 8) {
          // Aceptar cualquier código válido de cualquier país
          onScan(code);
          stopScanner();
        }
      });

      Quagga.onProcessed((result) => {
        if (result) {
          try {
            const drawingCanvas = Quagga.canvas.dom.image;
            if (drawingCanvas) {
              const context = drawingCanvas.getContext('2d');
              
              if (result.boxes) {
                result.boxes.filter((box) => box !== result.box).forEach((box) => {
                  Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, context, { color: 'green', lineWidth: 2 });
                });
              }
              if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, context, { color: 'blue', lineWidth: 2 });
              }
              if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, context, { color: 'red', lineWidth: 3 });
              }
            }
          } catch (err) {
            console.log('Error en procesamiento visual:', err);
          }
        }
      });

      // Iniciar el escáner
      Quagga.start();
      setIsInitializing(false);
      setDebugInfo('Escáner activo - Buscando códigos...');
      
    } catch (err) {
      console.error('Error al iniciar el escáner:', err);
      setIsInitializing(false);
      
      if (err.name === 'NotAllowedError') {
        setError('Permisos de cámara denegados. Por favor, permite el acceso a la cámara y vuelve a intentar.');
      } else if (err.name === 'NotFoundError') {
        setError('No se encontró ninguna cámara en tu dispositivo.');
      } else if (err.name === 'NotSupportedError') {
        setError('Tu navegador no soporta esta funcionalidad. Prueba con Chrome o Firefox.');
      } else {
        setError('Error al acceder a la cámara: ' + err.message);
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
    setDebugInfo('');
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
              Haz clic para activar la cámara y escanear automáticamente
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
                    {error ? 'Error al iniciar cámara' : 'Activando cámara...'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Información de debug */}
            {debugInfo && (
              <div style={{
                background: '#dbeafe',
                border: '1px solid #93c5fd',
                borderRadius: '8px',
                padding: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.75rem',
                color: '#1e40af'
              }}>
                {debugInfo}
              </div>
            )}
            
            {!error && (
              <div style={{
                background: '#fef3c7',
                borderRadius: '16px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                  💡 Consejos universales:
                </h4>
                <ul style={{ color: '#92400e', fontSize: '0.75rem', textAlign: 'left', lineHeight: '1.4' }}>
                  <li>• Compatible con códigos de todo el mundo</li>
                  <li>• Mantén el código estable y bien iluminado</li>
                  <li>• Distancia recomendada: 10-20 cm</li>
                  <li>• Asegúrate de que el código esté completo</li>
                  <li>• Mueve lentamente si no detecta</li>
                </ul>
              </div>
            )}
            
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
