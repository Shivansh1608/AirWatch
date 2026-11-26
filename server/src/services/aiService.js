import axios from 'axios';
import { getCategoryByAQI } from '../constants/cpcbBreakpoints.js';

const MEDICAL_DISCLAIMER = 'Disclaimer: This guidance is based on Central Pollution Control Board (CPCB) standards and is for informational purposes only. It does not constitute medical advice. Consult a healthcare provider for medical symptoms.';

/**
 * AI Health Assistant: Generates personalized, grounded health guidance
 */
export async function generateHealthAdvice({
  city,
  aqi,
  dominantPollutant = 'PM2.5',
  pollutants = {},
  weather = {},
  userMessage = 'Can I exercise outside today?',
  sensitiveGroup = false
}) {
  const category = getCategoryByAQI(aqi);
  const geminiKey = process.env.GEMINI_API_KEY;

  const systemContext = `You are the AirWatch AI Health Assistant, an expert environmental health advisor for Indian cities calibrated strictly to the Central Pollution Control Board (CPCB) National Air Quality Index (NAQI) standards.
Current City: ${city}
Current CPCB AQI: ${aqi} (${category})
Dominant Pollutant: ${dominantPollutant}
PM2.5: ${pollutants?.pm25?.value || 'N/A'} µg/m³
PM10: ${pollutants?.pm10?.value || 'N/A'} µg/m³
Weather: Temperature ${weather?.temperature || '24'}°C, Humidity ${weather?.humidity || '55'}%, Wind Speed ${weather?.windSpeed || '8'} km/h
User sensitive group profile: ${sensitiveGroup ? 'Yes (asthma/cardiac/elderly/child)' : 'Standard adult'}.

User Query: "${userMessage}"

Instructions:
1. Provide a direct, empathetic, and evidence-grounded answer based on the real CPCB AQI number (${aqi}) and dominant pollutant (${dominantPollutant}).
2. Provide 3 concrete behavioral recommendations (e.g. N95 mask usage, ventilation timing, workout alternatives).
3. Conclude with the exact disclaimer: "${MEDICAL_DISCLAIMER}". Keep total length concise and structured.`;

  if (geminiKey && geminiKey.trim().length > 10) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          contents: [{ parts: [{ text: systemContext }] }]
        },
        { timeout: 8000 }
      );

      const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        return {
          reply: aiText,
          city,
          aqi,
          category,
          source: 'Gemini 1.5 Flash (Grounded in CPCB Telemetry)',
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to grounded rule engine:', err.message);
    }
  }

  // High-fidelity grounded rule-based synthesis
  return generateGroundedRuleAdvice(city, aqi, category, dominantPollutant, userMessage, sensitiveGroup);
}

/**
 * Smart Pollution Insights: Explains meteorological causes of high/low AQI
 */
export async function generatePollutionInsights({ city, aqi, dominantPollutant, weather }) {
  const wind = weather?.windSpeed || 8;
  const humidity = weather?.humidity || 55;
  const temp = weather?.temperature || 24;
  const isHigh = aqi > 200;

  let explanation = '';
  if (isHigh) {
    if (wind < 8) {
      explanation = `Poor ventilation and low surface wind speeds (${wind} km/h) are preventing horizontal dispersion, creating a calm stagnation layer that traps ${dominantPollutant} close to ground level in ${city}.`;
    } else if (humidity > 65) {
      explanation = `Elevated relative humidity (${humidity}%) combined with particulate emissions is promoting secondary aerosol formation and moisture-bound hygroscopic growth, causing hazy and high AQI conditions.`;
    } else {
      explanation = `High localized emission density from vehicular and industrial sources combined with atmospheric boundary layer contraction is causing elevated concentrations of ${dominantPollutant}.`;
    }
  } else {
    explanation = `Favorable atmospheric dispersion conditions with moderate surface ventilation (${wind} km/h) are effectively clearing particulates, maintaining ${city}'s AQI in acceptable CPCB tiers.`;
  }

  return {
    city,
    aqi,
    dominantPollutant,
    explanation,
    meteorologicalFactors: {
      dispersionStatus: wind < 8 ? 'Stagnant / Poor' : 'Active / Good',
      humidityImpact: humidity > 60 ? 'Moisture trapping' : 'Favorable dry air',
      primaryDriver: dominantPollutant
    },
    timestamp: new Date().toISOString()
  };
}

function generateGroundedRuleAdvice(city, aqi, category, dominantPollutant, userMessage, sensitiveGroup) {
  let mainAdvice = '';
  let precautions = [];

  if (aqi <= 50) {
    mainAdvice = `Air quality in ${city} is currently Good (AQI: ${aqi}). It is an excellent day for outdoor sports, running, and fresh-air ventilation.`;
    precautions = [
      'Feel free to exercise or jog outside without respiratory precautions.',
      'Open windows for natural home ventilation.',
      'No masks required for general or sensitive populations.'
    ];
  } else if (aqi <= 100) {
    mainAdvice = `Air quality in ${city} is Satisfactory (AQI: ${aqi}). Outdoor activities are safe for most individuals.`;
    precautions = [
      'Ideal for normal outdoor activities.',
      sensitiveGroup ? 'Sensitive individuals should take occasional breaks during intense workouts.' : 'Safe for general workouts.',
      'Natural cross-ventilation is recommended.'
    ];
  } else if (aqi <= 200) {
    mainAdvice = `Air quality in ${city} is Moderate (AQI: ${aqi}) with ${dominantPollutant} as the primary pollutant. Moderate exposure poses minor discomfort to sensitive groups.`;
    precautions = [
      'Shift strenuous cardiovascular workouts to early afternoon when mixing is higher.',
      sensitiveGroup ? 'Sensitive groups (asthma/cardiac) should limit prolonged outdoor exposure.' : 'Healthy individuals can perform normal outdoor routines.',
      'Consider running an indoor air purifier if you experience irritation.'
    ];
  } else if (aqi <= 300) {
    mainAdvice = `Air quality in ${city} is Poor (AQI: ${aqi}). High concentration of ${dominantPollutant} will cause respiratory discomfort on prolonged exposure.`;
    precautions = [
      'Avoid high-intensity outdoor running or cycling; substitute with indoor gym workouts.',
      'Wear a well-fitted N95/FFP2 mask if commuting or spending over 30 minutes outdoors.',
      'Keep residential windows and doors closed, particularly during morning and evening rush hours.'
    ];
  } else if (aqi <= 400) {
    mainAdvice = `Air quality in ${city} is Very Poor (AQI: ${aqi}). Breathing this air for prolonged periods causes acute respiratory symptoms.`;
    precautions = [
      'Do not exercise outdoors. Strictly move all physical workouts indoors.',
      'N95 particulate respirator mask is mandatory whenever stepping outside.',
      'Run indoor HEPA air purifiers and avoid lighting incense or burning waste.'
    ];
  } else {
    mainAdvice = `EMERGENCY ADVISORY: Air quality in ${city} is Severe (AQI: ${aqi}). Extremely high levels of ${dominantPollutant} seriously impact healthy individuals and severely affect vulnerable groups.`;
    precautions = [
      'Avoid all unnecessary outdoor exposure. Remain indoors with air filtration.',
      'Wear sealed N95 masks even for short transit periods.',
      'Keep inhalers and prescribed respiratory medication readily accessible if diagnosed with asthma or COPD.'
    ];
  }

  const reply = `${mainAdvice}\n\nKey Recommendations:\n• ${precautions[0]}\n• ${precautions[1]}\n• ${precautions[2]}\n\n${MEDICAL_DISCLAIMER}`;

  return {
    reply,
    city,
    aqi,
    category,
    source: 'CPCB Health Intelligence Engine (Rule-Based Grounded)',
    timestamp: new Date().toISOString()
  };
}
