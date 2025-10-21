import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { LanguagePreference, ApiResponse } from '../types';

export const detectLanguage = async (req: Request, res: Response) => {
  try {
    const { userAgent } = req.headers;
    const { preferredLanguage } = req.body;

    // Detect language from browser
    const browserLang = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
    const detectedLanguage = ['en', 'it'].includes(browserLang) ? browserLang as 'en' | 'it' : 'en';

    // Use preferred language if provided and valid
    const finalLanguage = preferredLanguage && ['en', 'it'].includes(preferredLanguage) 
      ? preferredLanguage as 'en' | 'it' 
      : detectedLanguage;

    // Store language preference
    const languagePreference: Omit<LanguagePreference, 'id'> = {
      userAgent: (Array.isArray(userAgent) ? userAgent[0] : userAgent) || 'unknown',
      detectedLanguage,
      selectedLanguage: finalLanguage,
      timestamp: new Date()
    };

    await db.collection('languagePreferences').add(languagePreference);

    const response: ApiResponse<{ language: 'en' | 'it' }> = {
      success: true,
      data: { language: finalLanguage }
    };

    res.json(response);
  } catch (error) {
    console.error('Error detecting language:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getTranslations = async (req: Request, res: Response) => {
  try {
    const { lang } = req.params;

    if (!['en', 'it'].includes(lang)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid language. Supported languages: en, it'
      });
    }

    // Import translations based on language
    const translations = await import(`../locales/${lang}.json`);

    const response: ApiResponse = {
      success: true,
      data: translations.default || translations
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching translations:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getLanguageStats = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('languagePreferences').get();
    
    const stats = {
      total: snapshot.size,
      english: 0,
      italian: 0,
      detected: { en: 0, it: 0 },
      selected: { en: 0, it: 0 }
    };

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.detectedLanguage === 'en') stats.detected.en++;
      if (data.detectedLanguage === 'it') stats.detected.it++;
      if (data.selectedLanguage === 'en') stats.selected.en++;
      if (data.selectedLanguage === 'it') stats.selected.it++;
    });

    stats.english = stats.selected.en;
    stats.italian = stats.selected.it;

    const response: ApiResponse = {
      success: true,
      data: stats
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching language stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
