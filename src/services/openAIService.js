import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const getNutritionalAnalysis = async (productInfo) => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return {
        success: false,
        error: 'API Key de OpenAI no configurada'
      };
    }

    const prompt = `
      Analiza este producto alimenticio de manera amigable y cercana, como un nutricionista que aconseja a un amigo:
      
      Nombre: ${productInfo.name}
      Marca: ${productInfo.brands}
      Cantidad: ${productInfo.quantity}
      Ingredientes: ${productInfo.ingredients}
      Nutri-Score: ${productInfo.nutriScore || 'No disponible'}
      Eco-Score: ${productInfo.ecoScore || 'No disponible'}
      
      Nutrientes principales:
      ${Object.entries(productInfo.nutriments)
        .filter(([key, value]) => 
          ['energy-kcal_100g', 'fat_100g', 'carbohydrates_100g', 'proteins_100g', 'salt_100g', 'sugars_100g']
          .includes(key) && value !== undefined
        )
        .map(([key, value]) => `${key.replace('_100g', '').replace('-', ' ')}: ${value}`)
        .join(', ')}
      
      Proporciona un análisis en español que incluya:
      1. Evaluación general del producto
      2. Puntos positivos y negativos
      3. Recomendaciones de consumo
      4. Alternativas más saludables si aplica
      
      Mantén un tono cercano y comprensible, máximo 200 palabras.
    `;

    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un nutricionista amigable y cercano que da consejos prácticos sobre alimentación.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      data: response.data.choices[0].message.content
    };

  } catch (error) {
    console.error('Error en OpenAI:', error);
    return {
      success: false,
      error: 'Error al generar análisis nutricional'
    };
  }
};
