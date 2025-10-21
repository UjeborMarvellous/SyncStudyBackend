import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { LanguageValidationResult } from '../types';
export declare const validateLanguage: (text: string) => LanguageValidationResult;
export declare const waitlistSchema: Joi.ObjectSchema<any>;
export declare const suggestionSchema: Joi.ObjectSchema<any>;
export declare const adminLoginSchema: Joi.ObjectSchema<any>;
export declare const validateRequest: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateLanguageMiddleware: (field: string) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.d.ts.map