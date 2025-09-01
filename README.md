# 🥗 Detector Nutricional

Una aplicación web para escanear códigos de barras de productos alimenticios y obtener información nutricional detallada con análisis personalizado por IA.

## ✨ Características

- **Escáner de códigos de barras**: Usa la cámara del dispositivo para escanear códigos EAN
- **Búsqueda manual**: Introduce códigos de barras manualmente
- **Información nutricional**: Obtiene datos de OpenFoodFacts (nutrientes, ingredientes, Nutri-Score, Eco-Score)
- **Análisis con IA**: Genera análisis personalizado usando OpenAI
- **Interfaz responsive**: Diseño moderno y adaptable a todos los dispositivos
- **Datos en español**: Información localizada para usuarios hispanohablantes

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- API Key de OpenAI (opcional, para análisis con IA)

### Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/detector-nutricional.git
   cd detector-nutricional
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_OPENAI_API_KEY=tu_api_key_de_openai_aqui
   ```
   
   > **Nota**: La API Key de OpenAI es opcional. Si no la configuras, la aplicación funcionará sin el análisis de IA.

4. **Ejecuta la aplicación en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador en:**
   ```
   http://localhost:5173
   ```

## 📱 Cómo usar la aplicación

1. **Escaneo con cámara:**
   - Haz clic en "📷 Escanear con Cámara"
   - Permite el acceso a la cámara
   - Apunta hacia el código de barras del producto
   - El escáner detectará automáticamente el código

2. **Búsqueda manual:**
   - Introduce el código de barras en el campo de texto
   - Haz clic en "Buscar"

3. **Revisa los resultados:**
   - Información del producto (nombre, marca, imagen)
   - Nutrientes principales por 100g
   - Nutri-Score y Eco-Score
   - Lista de ingredientes
   - Análisis nutricional generado por IA

## 🛠️ Tecnologías utilizadas

- **Frontend**: React 19 + Vite
- **Estilos**: TailwindCSS
- **Escáner de códigos**: QuaggaJS
- **APIs**: 
  - OpenFoodFacts (datos nutricionales)
  - OpenAI (análisis con IA)
- **HTTP Client**: Axios
- **Despliegue**: GitHub Pages

## 📦 Scripts disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción

# Despliegue
npm run deploy       # Construye y despliega en GitHub Pages
```

## 🌐 Despliegue en GitHub Pages

### Configuración automática

1. **Prepara el repositorio:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Despliega automáticamente:**
   ```bash
   npm run deploy
   ```

3. **Configura GitHub Pages:**
   - Ve a Settings > Pages en tu repositorio
   - Selecciona la rama `gh-pages` como fuente
   - Tu aplicación estará disponible en: `https://tu-usuario.github.io/detector-nutricional/`

### Configuración manual

Si prefieres configurar manualmente:

1. **Construye la aplicación:**
   ```bash
   npm run build
   ```

2. **Sube la carpeta `dist` a GitHub Pages**

## 🔧 Configuración de APIs

### OpenFoodFacts
- **URL**: `https://world.openfoodfacts.org/api/v0/product/{EAN}.json`
- **Costo**: Gratuito
- **Límites**: Sin límites conocidos

### OpenAI
- **URL**: `https://api.openai.com/v1/chat/completions`
- **Costo**: Según uso (aproximadamente $0.002 por 1K tokens)
- **Configuración**: Necesitas una API Key válida

## 📊 Estructura del proyecto

```
detector-nutricional/
├── src/
│   ├── components/
│   │   ├── BarcodeScanner.jsx    # Componente del escáner
│   │   └── ProductResults.jsx    # Componente de resultados
│   ├── services/
│   │   ├── openFoodFactsService.js  # Servicio OpenFoodFacts
│   │   └── openAIService.js         # Servicio OpenAI
│   ├── App.jsx                     # Componente principal
│   └── index.css                   # Estilos globales
├── public/                         # Archivos estáticos
├── .env.example                    # Ejemplo de variables de entorno
├── vite.config.js                  # Configuración de Vite
├── tailwind.config.js              # Configuración de TailwindCSS
└── package.json                    # Dependencias y scripts
```

## 🐛 Solución de problemas

### Error de cámara
- Asegúrate de que el navegador tenga permisos de cámara
- Usa HTTPS en producción (requerido para acceso a cámara)

### Producto no encontrado
- Verifica que el código de barras sea correcto
- Algunos productos pueden no estar en la base de datos de OpenFoodFacts

### Error de API de OpenAI
- Verifica que la API Key sea válida
- Revisa los límites de uso de tu cuenta

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [OpenFoodFacts](https://world.openfoodfacts.org/) por proporcionar la base de datos de productos
- [OpenAI](https://openai.com/) por la API de análisis de texto
- [QuaggaJS](https://github.com/serratus/quaggaJS) por la librería de escaneo de códigos de barras

---

**Desarrollado con ❤️ para ayudar a tomar decisiones alimentarias más informadas**
