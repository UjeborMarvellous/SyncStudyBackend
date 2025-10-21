import { Request, Response } from 'express';
export declare const submitSuggestion: (req: Request, res: Response) => Promise<void>;
export declare const getAllSuggestions: (req: Request, res: Response) => Promise<void>;
export declare const deleteSuggestion: (req: Request, res: Response) => Promise<void>;
export declare const updateSuggestionStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=suggestionController.d.ts.map