/**
 * Campus Resilience Backend Server
 * Provides API endpoints for shared status, resource requests, and data synchronization
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory data stores (in production, use a database like MongoDB, PostgreSQL, etc.)
let userStatuses = new Map(); // userId -> { status, timestamp, location }
let resourceRequests = []; // Array of resource requests
let checklists = new Map(); // userId -> checklist state

// Helper function to generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to get user ID from request (in production, use authentication)
function getUserId(req) {
    // For now, use a simple header or generate one
    // In production, extract from JWT token or session
    return req.headers['x-user-id'] || req.body.userId || generateId();
}

// ==================== API Endpoints ====================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Campus Resilience API'
    });
});

/**
 * POST /api/status
 * Update or set user status
 * Body: { status: 'safe' | 'need-help' | 'can-help', location?: { lat, lng } }
 */
app.post('/api/status', (req, res) => {
    try {
        const userId = getUserId(req);
        const { status, location } = req.body;

        if (!status || !['safe', 'need-help', 'can-help'].includes(status)) {
            return res.status(400).json({ 
                error: 'Invalid status. Must be: safe, need-help, or can-help' 
            });
        }

        userStatuses.set(userId, {
            status,
            location: location || null,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            userId,
            status,
            timestamp: userStatuses.get(userId).timestamp
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/status
 * Get current user's status
 */
app.get('/api/status', (req, res) => {
    try {
        const userId = getUserId(req);
        const userStatus = userStatuses.get(userId);

        if (!userStatus) {
            return res.json({ status: null, message: 'No status set' });
        }

        res.json(userStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/status/all
 * Get all users' statuses (for community view)
 * Query params: ?limit=50 (optional)
 */
app.get('/api/status/all', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const statusArray = Array.from(userStatuses.entries())
            .map(([userId, data]) => ({
                userId,
                ...data
            }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);

        res.json({
            count: statusArray.length,
            statuses: statusArray
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/requests
 * Create a resource request
 * Body: { type: string, description: string, location?: { lat, lng }, urgent?: boolean }
 */
app.post('/api/requests', (req, res) => {
    try {
        const userId = getUserId(req);
        const { type, description, location, urgent } = req.body;

        if (!type || !description) {
            return res.status(400).json({ 
                error: 'Type and description are required' 
            });
        }

        const request = {
            id: generateId(),
            userId,
            type,
            description,
            location: location || null,
            urgent: urgent || false,
            status: 'open',
            createdAt: new Date().toISOString(),
            responses: []
        };

        resourceRequests.push(request);

        res.status(201).json({
            success: true,
            request
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/requests
 * Get all resource requests
 * Query params: ?status=open|closed&limit=50
 */
app.get('/api/requests', (req, res) => {
    try {
        const status = req.query.status || 'all';
        const limit = parseInt(req.query.limit) || 50;

        let requests = [...resourceRequests];

        if (status !== 'all') {
            requests = requests.filter(r => r.status === status);
        }

        requests = requests
            .sort((a, b) => {
                // Urgent requests first
                if (a.urgent !== b.urgent) return b.urgent - a.urgent;
                // Then by date
                return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .slice(0, limit);

        res.json({
            count: requests.length,
            requests
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/requests/:id/respond
 * Respond to a resource request
 * Body: { message: string, canHelp: boolean }
 */
app.post('/api/requests/:id/respond', (req, res) => {
    try {
        const userId = getUserId(req);
        const requestId = req.params.id;
        const { message, canHelp } = req.body;

        const request = resourceRequests.find(r => r.id === requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        request.responses.push({
            userId,
            message: message || '',
            canHelp: canHelp || false,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            request
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/checklist
 * Sync checklist state
 * Body: { checklistState: object }
 */
app.post('/api/checklist', (req, res) => {
    try {
        const userId = getUserId(req);
        const { checklistState } = req.body;

        checklists.set(userId, {
            checklistState,
            updatedAt: new Date().toISOString()
        });

        res.json({
            success: true,
            updatedAt: checklists.get(userId).updatedAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/checklist
 * Get user's checklist state
 */
app.get('/api/checklist', (req, res) => {
    try {
        const userId = getUserId(req);
        const checklist = checklists.get(userId);

        if (!checklist) {
            return res.json({ checklistState: null });
        }

        res.json(checklist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/status
 * Clear user status
 */
app.delete('/api/status', (req, res) => {
    try {
        const userId = getUserId(req);
        userStatuses.delete(userId);
        res.json({ success: true, message: 'Status cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Campus Resilience API running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`\n💡 To use with frontend, set CONFIG.API_BASE_URL to http://localhost:${PORT}`);
});

module.exports = app;

