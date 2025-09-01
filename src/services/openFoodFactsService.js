import axios from 'axios';

const OPENFOODFACTS_API_BASE = 'https://world.openfoodfacts.org/api/v0/product';

export const getProductInfo = async (ean) => {
  try {
    const response = await axios.get(`${OPENFOODFACTS_API_BASE}/${ean}.json`);
    
    if (response.data.status === 1) {
      const product = response.data.product;
      return {
        success: true,
        data: {
          name: product.product_name_es || product.product_name || 'Nombre no disponible',
          image: product.image_front_url || product.image_url || null,
          ingredients: product.ingredients_text_es || product.ingredients_text || 'Ingredientes no disponibles',
          nutriments: product.nutriments || {},
          nutriScore: product.nutrition_grade_fr || null,
          ecoScore: product.ecoscore_grade || null,
          brands: product.brands || 'Marca no disponible',
          quantity: product.quantity || 'Cantidad no disponible',
          allergens: product.allergens_tags || [],
          additives: product.additives_tags || []
        }
      };
    } else {
      return {
        success: false,
        error: 'Producto no encontrado'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Error al obtener información del producto'
    };
  }
};
