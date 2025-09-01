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
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-blue-600 mr-2">📷</span>
            Escáner de Códigos
          </h3>
          <button
            onClick={handleStopScan}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-2">⚠️</span>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {!isScanning ? (
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-blue-600 text-3xl">📷</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              Escanea un código de barras
            </h4>
            <p className="text-gray-600 mb-6">
              Presiona el botón para activar la cámara y escanear automáticamente
            </p>
            <button
              onClick={handleStartScan}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Iniciar Escáner
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div 
              ref={scannerRef}
              className="w-full h-64 bg-gray-100 rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-gray-300"
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-500">Activando cámara...</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Consejos para escanear:</h4>
              <ul className="text-blue-700 text-sm space-y-1 text-left">
                <li>• Mantén el código de barras estable</li>
                <li>• Asegúrate de que esté bien iluminado</li>
                <li>• Mantén una distancia de 10-20 cm</li>
                <li>• El escáner se activará automáticamente</li>
              </ul>
            </div>
            <button
              onClick={handleStopScan}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
