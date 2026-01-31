import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, AnalysisResult, Source } from "../types";
import { getDemographicStats } from "../data/atoData";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchIncomeAnalysis = async (input: UserInput): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  // 1. Retrieve local "downloaded" data
  const stats = getDemographicStats(input.location, input.ageGroup);

  const prompt = `
    Act as an expert Australian demographic statistician.
    
    Context:
    A user in Australia has the following details:
    - Annual Gross Income: $${input.income} AUD
    - Location: ${input.location}
    - Age Group: ${input.ageGroup}

    Reference Data (Source: ATO Taxation Statistics 2021-22):
    - Demographic Median Income: $${stats.median}
    - Demographic Top 10% Threshold: $${stats.p90}
    - Demographic Top 1% Threshold: $${stats.p99}

    Task:
    1. CALCULATE PERCENTILE: Based strictly on the Reference Data provided above, calculate the user's specific income percentile (0-100). Interpolate logically using a log-normal distribution assumption between the data points.
    2. GENERATE DISTRIBUTION: Generate points for a probability density curve. X-axis is Income, Y-axis is Density. 
       - The curve must peak near the median ($${stats.median}).
       - It must have a long tail to the right.
       - The range should cover $0 to at least $${stats.p99}.
    3. INSIGHT: Provide a short, friendly, 1-sentence insight.

    Output must be valid JSON matching the schema.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      // No tools needed, we are providing the data
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          medianIncome: { type: Type.NUMBER, description: "Return the median provided in reference data" },
          userPercentile: { type: Type.NUMBER, description: "The calculated percentile (0-100)" },
          top10PercentThreshold: { type: Type.NUMBER, description: "Return the Top 10% threshold provided in reference data" },
          top1PercentThreshold: { type: Type.NUMBER, description: "Return the Top 1% threshold provided in reference data" },
          insight: { type: Type.STRING, description: "A friendly insight sentence" },
          distribution: {
            type: Type.ARRAY,
            description: "Data points for the distribution curve",
            items: {
              type: Type.OBJECT,
              properties: {
                income: { type: Type.NUMBER },
                density: { type: Type.NUMBER },
              },
            },
          },
        },
        required: ["medianIncome", "userPercentile", "distribution", "insight", "top10PercentThreshold", "top1PercentThreshold"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  let data = JSON.parse(text) as AnalysisResult;

  // Static source for the local dataset
  const staticSources: Source[] = [{
    title: "ATO Taxation Statistics 2021-22 (Tables 1-3)",
    uri: "https://www.ato.gov.au/about-ato/research-and-statistics/in-detail/taxation-statistics/taxation-statistics-2021-22"
  }];
  
  return { ...data, sources: staticSources };
};
