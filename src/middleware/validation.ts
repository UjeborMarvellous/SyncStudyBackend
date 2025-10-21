import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { LanguageValidationResult } from '../types';

// Language validation regex for English and Italian
const ENGLISH_ITALIAN_REGEX = /^[a-zA-ZÀ-ÿ\s.,!?;:'"()-]+$/;

export const validateLanguage = (text: string): LanguageValidationResult => {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: 'Text cannot be empty' };
  }

  if (!ENGLISH_ITALIAN_REGEX.test(text)) {
    return { 
      isValid: false, 
      error: 'Only English and Italian languages are supported' 
    };
  }

  // Simple language detection based on common Italian characters
  const hasItalianChars = /[À-ÿ]/.test(text);
  const detectedLanguage = hasItalianChars ? 'it' : 'en';

  return { 
    isValid: true, 
    detectedLanguage 
  };
};

// Validation schemas
export const waitlistSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).required(),
  university: Joi.string().min(2).max(100).required(),
  interests: Joi.array().items(Joi.string().min(1).max(50)).min(1).required(),
  language: Joi.string().valid('en', 'it').required()
});

export const suggestionSchema = Joi.object({
  suggestion: Joi.string().min(10).max(1000).required(),
  email: Joi.string().email().required(),
  language: Joi.string().valid('en', 'it').required()
});

export const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Middleware for validating request body
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    next();
  };
};

// Middleware for language validation
export const validateLanguageMiddleware = (field: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const text = req.body[field];
    if (text) {
      const validation = validateLanguage(text);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: validation.error
        });
      }
      // Add detected language to request body
      req.body.detectedLanguage = validation.detectedLanguage;
    }
    next();
  };
};
