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
                        description: "Una explicación detallada, paso a paso, y amigable para principiantes, de cómo se realizó la agrupación para llegar a esta expresión. Usa markdown para formato, como `**negrita**`. NO te refieras a los colores de los grupos.",
                    },
                    groups: {
                        type: Type.ARRAY,
                        description: "Detalles de cada grupo de simplificación.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                term: {
                                    type: Type.STRING,
                                    description: "El término booleano simplificado para este grupo. Ej: A'B",
                                },
                                minterms: {
                                    type: Type.ARRAY,
                                    description: "Una lista de los números de mintérminos (y 'no importa') que este grupo cubre.",
                                    items: { type: Type.INTEGER }
                                }
                            },
                            required: ["term", "minterms"]
                        }
                    }
                },
                 required: ["expression", "explanation", "groups"],
            },
        },
    },
    required: ["solutions"],
};

export const solveKMap = async (numVars: number, kmapData: KMapValue[], variableNames: string[]): Promise<{ solutions: Solution[] }> => {
    const prompt = `
        Eres un profesor experto y amigable de diseño de lógica digital. Tu tarea es resolver un mapa de Karnaugh (mapa K) y explicarlo de una manera súper clara para un completo principiante.

        **Detalles del Problema:**
        - **Número de Variables:** ${numVars}
        - **Nombres de Variables:** ${variableNames.join(', ')}
        - **Valores del Mapa K (en orden de mintérminos de 0 a ${kmapData.length - 1}):** [${kmapData.join(', ')}]
        - **Nota:** 'X' es una condición "no importa", úsala para hacer grupos más grandes.

        **Instrucciones:**
        1.  **Encuentra Soluciones:** Identifica TODAS las posibles soluciones mínimas de Suma de Productos (SOP). Puede haber más de una.
        2.  **Para CADA solución, haz lo siguiente:**
            a.  **Identifica los Grupos:** Para cada término en la expresión final (ej: ${variableNames[0]}'${variableNames[1]}), detalla qué grupo de 1s y Xs en el mapa lo forma.
            b.  **Proporciona la Expresión Final:** Escribe la expresión booleana SOP simplificada.
            c.  **Escribe una Explicación para Principiantes:**
                *   Imagina que le explicas esto a alguien que no sabe nada de mapas K. ¡Hazlo simple!
                *   Usa una analogía. Por ejemplo, "agrupar es como encontrar los rectángulos más grandes posibles de 1s en un tablero de juego...".
                *   Explica CÓMO cada grupo se convierte en su término. **NO te refieras a los colores de los grupos en la explicación.** En su lugar, refiérete al grupo por el término que genera. Por ejemplo: "El grupo que produce el término **${variableNames[0]}'${variableNames[1]}** cubre las celdas donde ${variableNames[0]} es '0' y ${variableNames[1]} es '1', por eso se simplifica a ese término".
                *   Usa formato markdown (**para negrita**) para enfatizar partes importantes.

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