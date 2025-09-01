import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onScan, onClose }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);

  useEffect(() => {
    // Verificar permisos de cámara al montar el componente
    checkCameraPermission();
    
    return () => {
      if (Quagga) {
        Quagga.stop();
      }
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Tu navegador no soporta acceso a la cámara');
        return;
      }

      // Solicitar permisos de cámara
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      // Si llegamos aquí, tenemos permisos
      setCameraPermission('granted');
      
      // Detener el stream inmediatamente (solo queríamos verificar permisos)
      stream.getTracks().forEach(track => track.stop());
      
    } catch (err) {
      console.error('Error al verificar permisos de cámara:', err);
      if (err.name === 'NotAllowedError') {
        setError('Permisos de cámara denegados. Por favor, permite el acceso a la cámara.');
      } else if (err.name === 'NotFoundError') {
        setError('No se encontró ninguna cámara en tu dispositivo.');
      } else {
        setError('Error al acceder a la cámara: ' + err.message);
      }
      setCameraPermission('denied');
    }
  };

  const startScanner = async () => {
    if (cameraPermission !== 'granted') {
      await checkCameraPermission();
      if (cameraPermission !== 'granted') {
        return;
      }
    }

    setError(null);
    
    try {
      await Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: { min: 640, ideal: 640, max: 640 },
            height: { min: 480, ideal: 480, max: 480 },
            facingMode: "environment",
            aspectRatio: { min: 1, max: 2 }
          },
        },
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "code_128_reader",
            "code_39_reader",
            "upc_reader",
            "upc_e_reader"
          ],
          multiple: false,
          debug: {
            showCanvas: true,
            showPatches: true,
            showFoundPatches: true,
            showSkeleton: true,
            showLabels: true,
            showPatchLabels: true,
            showRemainingPatchLabels: true,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true
            }
          }
        },
        locate: true,
        frequency: 10
      });

      Quagga.start();
      
      // Configurar eventos
      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        console.log('Código detectado:', code);
        
        // Validar que el código tenga al menos 8 dígitos
        if (code && code.length >= 8) {
          onScan(code);
          stopScanner();
        }
      });

      Quagga.onProcessed((result) => {
        if (result) {
          const drawingCanvas = Quagga.canvas.dom.image;
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
      });

      Quagga.onStarted(() => {
        console.log('Escáner iniciado correctamente');
      });

    } catch (err) {
      console.error('Error al iniciar el escáner:', err);
      setError('Error al iniciar el escáner: ' + err.message);
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    try {
      if (Quagga) {
        Quagga.stop();
      }
    } catch (err) {
      console.error('Error al detener el escáner:', err);
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

  const handleRetryPermission = async () => {
    setError(null);
    await checkCameraPermission();
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
              onClick={handleRetryPermission}
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
              Usa tu cámara para escanear automáticamente
            </p>
            <button
              onClick={handleStartScan}
              className="btn-primary"
              style={{ width: '100%' }}
              disabled={cameraPermission === 'denied'}
            >
              {cameraPermission === 'denied' ? 'Cámara no disponible' : 'Iniciar escáner'}
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
                overflow: 'hidden'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '2px solid #fef3c7',
                  borderTop: '2px solid #d97706',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 0.5rem'
                }}></div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Activando cámara...</p>
              </div>
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
                <li>• Distancia recomendada: 10-20 cm</li>
                <li>• El escáner se activará automáticamente</li>
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
