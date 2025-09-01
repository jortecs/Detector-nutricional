import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onScan, onClose }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isScanning]);

  const startScanner = () => {
    setError(null);
    
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
        readers: [
          "ean_reader",
          "ean_8_reader",
          "code_128_reader",
          "code_39_reader",
          "upc_reader",
          "upc_e_reader"
        ]
      },
      locate: true
    }, (err) => {
      if (err) {
        console.error('Error al iniciar el escáner:', err);
        setError('No se pudo acceder a la cámara. Verifica los permisos.');
        setIsScanning(false);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      console.log('Código detectado:', code);
      onScan(code);
      stopScanner();
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
  };

  const stopScanner = () => {
    if (Quagga) {
      Quagga.stop();
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
  };

  const handleStopScan = () => {
    setIsScanning(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Escanear código</h3>
          <button
            onClick={handleStopScan}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ✕
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-500 text-lg mr-3">⚠️</span>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {!isScanning ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-amber-600 text-2xl">📷</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Escanea un código de barras
            </h4>
            <p className="text-gray-600 text-sm mb-6">
              Usa tu cámara para escanear automáticamente
            </p>
            <button
              onClick={handleStartScan}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Iniciar escáner
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div 
              ref={scannerRef}
              className="w-full h-48 bg-gray-100 rounded-2xl mb-6 flex items-center justify-center border-2 border-dashed border-gray-300"
            >
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Activando cámara...</p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 mb-6">
              <h4 className="font-semibold text-amber-800 mb-3 text-sm">💡 Consejos:</h4>
              <ul className="text-amber-700 text-xs space-y-1 text-left">
                <li>• Mantén el código estable y bien iluminado</li>
                <li>• Distancia recomendada: 10-20 cm</li>
                <li>• El escáner se activará automáticamente</li>
              </ul>
            </div>
            <button
              onClick={handleStopScan}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold transition-all duration-200"
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
