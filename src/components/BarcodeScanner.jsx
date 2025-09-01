import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onScan, onClose }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

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
      }
    }, (err) => {
      if (err) {
        console.error('Error al iniciar el escáner:', err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      onScan(code);
      stopScanner();
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Escanear Código de Barras</h3>
          <button
            onClick={handleStopScan}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {!isScanning ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Presiona el botón para activar la cámara y escanear un código de barras
            </p>
            <button
              onClick={handleStartScan}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Iniciar Escáner
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div 
              ref={scannerRef}
              className="w-full h-64 bg-gray-100 rounded-lg mb-4 flex items-center justify-center"
            >
              <p className="text-gray-500">Activando cámara...</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Apunta la cámara hacia el código de barras del producto
            </p>
            <button
              onClick={handleStopScan}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
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
