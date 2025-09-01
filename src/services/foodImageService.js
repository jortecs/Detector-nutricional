import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const analyzeFoodImage = async (imageBase64) => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('API Key de OpenAI no configurada');
    }

    const response = await axios.post(OPENAI_API_URL, {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analiza esta imagen de un alimento y proporciona la siguiente información en formato JSON:

{
  "name": "Nombre del alimento",
  "type": "Tipo (fruta, verdura, bebida, snack, plato, etc.)",
  "estimatedWeight": "Peso estimado en gramos",
  "estimatedCalories": "Calorías estimadas por 100g",
  "nutritionalInfo": {
    "proteins": "Proteínas en g por 100g",
    "carbs": "Carbohidratos en g por 100g", 
    "fats": "Grasas en g por 100g",
    "fiber": "Fibra en g por 100g",
    "sugar": "Azúcares en g por 100g"
  },
  "healthBenefits": ["Beneficio 1", "Beneficio 2"],
  "healthRisks": ["Riesgo 1", "Riesgo 2"],
  "recommendations": "Recomendaciones de consumo",
  "description": "Descripción detallada del alimento"
}

Sé preciso con las estimaciones de peso y calorías basándote en el tamaño visible en la imagen.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    
    // Intentar parsear el JSON de la respuesta
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return {
          success: true,
          data: JSON.parse(jsonMatch[0])
        };
      } else {
        // Si no hay JSON, crear un objeto con la información disponible
        return {
          success: true,
          data: {
            name: "Alimento detectado",
            type: "No especificado",
            estimatedWeight: "No especificado",
            estimatedCalories: "No especificado",
            nutritionalInfo: {
              proteins: "No especificado",
              carbs: "No especificado",
              fats: "No especificado",
              fiber: "No especificado",
              sugar: "No especificado"
            },
            healthBenefits: ["Información no disponible"],
            healthRisks: ["Información no disponible"],
            recommendations: "Consulta con un nutricionista",
            description: content
          }
        };
      }
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError);
      return {
        success: true,
        data: {
          name: "Alimento detectado",
          type: "No especificado",
          estimatedWeight: "No especificado",
          estimatedCalories: "No especificado",
          nutritionalInfo: {
            proteins: "No especificado",
            carbs: "No especificado",
            fats: "No especificado",
            fiber: "No especificado",
            sugar: "No especificado"
          },
          healthBenefits: ["Información no disponible"],
          healthRisks: ["Información no disponible"],
          recommendations: "Consulta con un nutricionista",
          description: content
        }
      };
    }

  } catch (error) {
    console.error('Error en análisis de imagen:', error);
    return {
      success: false,
      error: error.message || 'Error al analizar la imagen'
    };
  }
};
