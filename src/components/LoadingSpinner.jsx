import React from 'react';

const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-4 text-gray-600 text-center">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
