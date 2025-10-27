import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { WaitlistEntry, ApiResponse } from '../types';
import { emailService } from '../services/emailService';

export const submitWaitlistEntry = async (req: Request, res: Response) => {
  try {
    const { email, name, university, interests, language } = req.body;

    // Validate required fields
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Check if email already exists (with optimized query)
    const existingEntry = await db.collection('waitlist')
      .where('email', '==', email.toLowerCase().trim())
      .limit(1)
      .get();

    if (!existingEntry.empty) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered for waitlist'
      });
    }

    // Create new waitlist entry with validated data
    const newEntry: Omit<WaitlistEntry, 'id'> = {
      email: email.toLowerCase().trim(),
      name: name?.trim() || '',
      university: university?.trim() || '',
      interests: Array.isArray(interests) ? interests : [],
      language: language || 'en',
      timestamp: new Date(),
      status: 'pending'
    };

    const docRef = await db.collection('waitlist').add(newEntry);

    console.log(`✅ New waitlist entry added: ${docRef.id} - ${email}`);

    // Send confirmation email (don't wait for it to complete)
    emailService.sendWaitlistConfirmation(email, name).catch(err => {
      console.error('Failed to send waitlist confirmation email:', err);
    });

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: docRef.id },
      message: 'Successfully added to waitlist'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('❌ Error submitting waitlist entry:', error);
    console.error('Request body:', req.body);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production'
        ? 'Failed to submit waitlist entry'
        : `Server error: ${errorMessage}`
    });
  }
};

export const getAllWaitlistEntries = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('waitlist')
      .orderBy('timestamp', 'desc')
      .get();

    const entries: WaitlistEntry[] = [];
    snapshot.forEach(doc => {
      entries.push({
        id: doc.id,
        ...doc.data()
      } as WaitlistEntry);
    });

    const response: ApiResponse<WaitlistEntry[]> = {
      success: true,
      data: entries
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching waitlist entries:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteWaitlistEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.collection('waitlist').doc(id).delete();

    const response: ApiResponse = {
      success: true,
      message: 'Waitlist entry deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting waitlist entry:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getWaitlistStats = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('waitlist').get();
    const totalEntries = snapshot.size;

    // Count by language
    const languageStats: { en: number; it: number } = { en: 0, it: 0 };
    snapshot.forEach(doc => {
      const data = doc.data();
      const lang = data.language as 'en' | 'it';
      if (lang === 'en' || lang === 'it') {
        languageStats[lang]++;
      }
    });

    // Count by status
    const statusStats: { pending: number; contacted: number; converted: number } = { pending: 0, contacted: 0, converted: 0 };
    snapshot.forEach(doc => {
      const data = doc.data();
      const status = data.status as 'pending' | 'contacted' | 'converted';
      if (status === 'pending' || status === 'contacted' || status === 'converted') {
        statusStats[status]++;
      }
    });

    const response: ApiResponse = {
      success: true,
      data: {
        totalEntries,
        languageStats,
        statusStats
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching waitlist stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
