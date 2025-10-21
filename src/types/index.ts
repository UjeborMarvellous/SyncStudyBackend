export interface WaitlistEntry {
  id?: string;
  email: string;
  name: string;
  university: string;
  interests: string[];
  language: 'en' | 'it';
  timestamp: Date;
  status: 'pending' | 'contacted' | 'converted';
}

export interface SuggestionEntry {
  id?: string;
  suggestion: string;
  email: string;
  language: 'en' | 'it';
  timestamp: Date;
  status: 'new' | 'reviewed' | 'implemented';
}

export interface AdminUser {
  id?: string;
  email: string;
  password: string;
  role: 'admin' | 'super-admin';
  createdAt: Date;
  lastLogin?: Date;
}

export interface LanguagePreference {
  id?: string;
  userAgent: string;
  detectedLanguage: 'en' | 'it';
  selectedLanguage: 'en' | 'it';
  timestamp: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface LanguageValidationResult {
  isValid: boolean;
  detectedLanguage?: 'en' | 'it';
  error?: string;
}
