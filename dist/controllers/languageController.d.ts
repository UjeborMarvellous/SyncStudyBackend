import { Request, Response } from 'express';
export declare const detectLanguage: (req: Request, res: Response) => Promise<void>;
export declare const getTranslations: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLanguageStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=languageController.d.ts.map