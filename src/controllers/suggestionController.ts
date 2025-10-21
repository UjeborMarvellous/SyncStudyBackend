import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { SuggestionEntry, ApiResponse } from '../types';

export const submitSuggestion = async (req: Request, res: Response) => {
  try {
    const suggestionData: Omit<SuggestionEntry, 'id' | 'timestamp' | 'status'> = req.body;

    // Create new suggestion entry
    const newSuggestion: Omit<SuggestionEntry, 'id'> = {
      ...suggestionData,
      timestamp: new Date(),
      status: 'new'
    };

    const docRef = await db.collection('suggestions').add(newSuggestion);

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: docRef.id },
      message: 'Suggestion submitted successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error submitting suggestion:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
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
