import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { SuggestionEntry, ApiResponse } from '../types';
import { emailService } from '../services/emailService';

export const submitSuggestion = async (req: Request, res: Response) => {
  try {
    const { suggestion, email } = req.body;

    // Validate required fields
    if (!suggestion || !suggestion.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Suggestion text is required'
      });
    }

    // Validate suggestion length
    if (suggestion.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Suggestion must be at least 10 characters long'
      });
    }

    if (suggestion.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Suggestion must be less than 1000 characters'
      });
    }

    // Validate email if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }
    }

    // Create new suggestion entry with validated data
    const newSuggestion: Omit<SuggestionEntry, 'id'> = {
      suggestion: suggestion.trim(),
      email: email?.toLowerCase().trim() || '',
      language: req.body.language || 'en',
      timestamp: new Date(),
      status: 'new'
    };

    const docRef = await db.collection('suggestions').add(newSuggestion);

    console.log(`✅ New suggestion added: ${docRef.id}`);

    // Send confirmation email if email was provided (don't wait for it to complete)
    if (email && email.trim() && email !== 'anonymous@example.com') {
      emailService.sendSuggestionConfirmation(email).catch(err => {
        console.error('Failed to send suggestion confirmation email:', err);
      });
    }

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: docRef.id },
      message: 'Suggestion submitted successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('❌ Error submitting suggestion:', error);
    console.error('Request body:', req.body);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production'
        ? 'Failed to submit suggestion'
        : `Server error: ${errorMessage}`
    });
  }
};

export const getAllSuggestions = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('suggestions')
      .orderBy('timestamp', 'desc')
      .get();

    const suggestions: SuggestionEntry[] = [];
    snapshot.forEach(doc => {
      suggestions.push({
        id: doc.id,
        ...doc.data()
      } as SuggestionEntry);
    });

    const response: ApiResponse<SuggestionEntry[]> = {
      success: true,
      data: suggestions
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteSuggestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.collection('suggestions').doc(id).delete();

    const response: ApiResponse = {
      success: true,
      message: 'Suggestion deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateSuggestionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'reviewed', 'implemented'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: new, reviewed, or implemented'
      });
    }

    await db.collection('suggestions').doc(id).update({
      status,
      updatedAt: new Date()
    });

    const response: ApiResponse = {
      success: true,
      message: 'Suggestion status updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating suggestion status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
