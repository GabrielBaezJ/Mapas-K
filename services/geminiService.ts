
import { GoogleGenAI, Type } from "@google/genai";
import type { KMapValue, Solution } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const solutionSchema = {
    type: Type.OBJECT,
    properties: {
        solutions: {
            type: Type.ARRAY,
            description: "Una lista de todas las posibles expresiones mínimas de Suma de Productos (SOP).",
            items: {
                type: Type.OBJECT,
                properties: {
                    expression: {
                        type: Type.STRING,
                        description: "La expresión booleana simplificada en forma de Suma de Productos. Por ejemplo: F = A'B + C",
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "Una explicación detallada, paso a paso, de cómo se realizó la agrupación para llegar a esta expresión específica. Usa markdown para el formato, como usar `\n` para nuevas líneas.",
                    },
                },
                 required: ["expression", "explanation"],
            },
        },
    },
    required: ["solutions"],
};

export const solveKMap = async (numVars: number, kmapData: KMapValue[]): Promise<{ solutions: Solution[] }> => {
    const variableNames = ['A', 'B', 'C', 'D'].slice(0, numVars).join(', ');
    const prompt = `
        Eres un experto en diseño de lógica digital. Tu tarea es resolver un mapa de Karnaugh (mapa K) y proporcionar todas las soluciones mínimas posibles de Suma de Productos (SOP).

        **Detalles del Problema:**
        - **Número de Variables:** ${numVars}
        - **Variables:** ${variableNames}
        - **Valores del Mapa K (en orden de mintérminos de 0 a ${kmapData.length - 1}):** [${kmapData.join(', ')}]
        - **Nota:** 'X' representa una condición "no importa" (don't care), que puede incluirse en grupos de 1s para crear grupos más grandes.

        **Instrucciones:**
        1. Analiza los valores del mapa K proporcionados.
        2. Identifica todos los implicantes primos.
        3. Encuentra todas las combinaciones de implicantes primos esenciales y otros implicantes primos que cubran todos los 1s en el mapa. Esto puede resultar en múltiples soluciones mínimas válidas.
        4. Para cada solución mínima distinta, proporciona la expresión booleana SOP simplificada final.
        5. Para cada solución, proporciona también una explicación clara y paso a paso que detalle qué mintérminos (y condiciones "no importa") se agruparon para formar cada término en la expresión final.

        Devuelve tu respuesta en el formato JSON especificado.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: solutionSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        // Basic validation
        if (parsedResponse && Array.isArray(parsedResponse.solutions)) {
            return parsedResponse;
        } else {
            throw new Error("Estructura de respuesta inválida de la API.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("No se pudo analizar o recibir una respuesta válida de la IA.");
    }
};