interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
declare class EmailService {
    private transporter;
    constructor();
    private initializeTransporter;
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendWaitlistConfirmation(email: string, name: string): Promise<boolean>;
    sendSuggestionConfirmation(email: string): Promise<boolean>;
    private stripHtml;
    verifyConnection(): Promise<boolean>;
}
export declare const emailService: EmailService;
export default emailService;
//# sourceMappingURL=emailService.d.ts.map