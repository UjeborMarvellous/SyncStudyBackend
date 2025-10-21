import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/firebase';
import { AdminUser, ApiResponse } from '../types';

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // This endpoint is now deprecated since we use Firebase Auth directly
    // Keep for backward compatibility but redirect to Firebase Auth
    return res.status(400).json({
      success: false,
      error: 'Please use Firebase Authentication directly from the frontend'
    });
  } catch (error: any) {
    console.error('Error during admin login:', error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'internal server error' : error.message,
      code: error.code,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

export const adminSignup = async (req: Request, res: Response) => {
  try {
    const { email, password, role = 'admin' } = req.body;

    // Check if admin already exists
    const existingAdmin = await db.collection('adminUsers')
      .where('email', '==', email)
      .get();

    if (!existingAdmin.empty) {
      return res.status(400).json({
        success: false,
        error: 'Admin user already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const newAdmin: Omit<AdminUser, 'id'> = {
      email,
      password: hashedPassword,
      role: role as 'admin' | 'super-admin',
      createdAt: new Date()
    };

    const docRef = await db.collection('adminUsers').add(newAdmin);

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: docRef.id },
      message: 'Admin user created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AdminUser;

    const response: ApiResponse<Omit<AdminUser, 'password'>> = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get waitlist stats
    const waitlistSnapshot = await db.collection('waitlist').get();
    const waitlistCount = waitlistSnapshot.size;

    // Get suggestions stats
    const suggestionsSnapshot = await db.collection('suggestions').get();
    const suggestionsCount = suggestionsSnapshot.size;

    // Get language preferences stats
    const languageSnapshot = await db.collection('languagePreferences').get();
    const languageCount = languageSnapshot.size;

    // Count by language
    const languageStats: { en: number; it: number } = { en: 0, it: 0 };
    waitlistSnapshot.forEach(doc => {
      const data = doc.data();
      const lang = data.language as 'en' | 'it';
      if (lang === 'en' || lang === 'it') {
        languageStats[lang]++;
      }
    });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentWaitlist = waitlistSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.timestamp && data.timestamp.toDate() > sevenDaysAgo;
    }).length;

    const recentSuggestions = suggestionsSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.timestamp && data.timestamp.toDate() > sevenDaysAgo;
    }).length;

    const response: ApiResponse = {
      success: true,
      data: {
        waitlist: {
          total: waitlistCount,
          recent: recentWaitlist,
          byLanguage: languageStats
        },
        suggestions: {
          total: suggestionsCount,
          recent: recentSuggestions
        },
        language: {
          total: languageCount
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
