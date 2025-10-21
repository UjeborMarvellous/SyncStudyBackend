"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSuggestionStatus = exports.deleteSuggestion = exports.getAllSuggestions = exports.submitSuggestion = void 0;
const firebase_1 = require("../config/firebase");
const submitSuggestion = async (req, res) => {
    try {
        const suggestionData = req.body;
        // Create new suggestion entry
        const newSuggestion = {
            ...suggestionData,
            timestamp: new Date(),
            status: 'new'
        };
        const docRef = await firebase_1.db.collection('suggestions').add(newSuggestion);
        const response = {
            success: true,
            data: { id: docRef.id },
            message: 'Suggestion submitted successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Error submitting suggestion:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.submitSuggestion = submitSuggestion;
const getAllSuggestions = async (req, res) => {
    try {
        const snapshot = await firebase_1.db.collection('suggestions')
            .orderBy('timestamp', 'desc')
            .get();
        const suggestions = [];
        snapshot.forEach(doc => {
            suggestions.push({
                id: doc.id,
                ...doc.data()
            });
        });
        const response = {
            success: true,
            data: suggestions
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getAllSuggestions = getAllSuggestions;
const deleteSuggestion = async (req, res) => {
    try {
        const { id } = req.params;
        await firebase_1.db.collection('suggestions').doc(id).delete();
        const response = {
            success: true,
            message: 'Suggestion deleted successfully'
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error deleting suggestion:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.deleteSuggestion = deleteSuggestion;
const updateSuggestionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['new', 'reviewed', 'implemented'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status. Must be: new, reviewed, or implemented'
            });
        }
        await firebase_1.db.collection('suggestions').doc(id).update({
            status,
            updatedAt: new Date()
        });
        const response = {
            success: true,
            message: 'Suggestion status updated successfully'
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error updating suggestion status:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.updateSuggestionStatus = updateSuggestionStatus;
//# sourceMappingURL=suggestionController.js.map