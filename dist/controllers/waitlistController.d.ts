import { Request, Response } from 'express';
export declare const submitWaitlistEntry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllWaitlistEntries: (req: Request, res: Response) => Promise<void>;
export declare const deleteWaitlistEntry: (req: Request, res: Response) => Promise<void>;
export declare const getWaitlistStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=waitlistController.d.ts.map