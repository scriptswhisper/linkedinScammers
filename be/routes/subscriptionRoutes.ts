import express from 'express';

const router = express.Router();

// Auth middleware (to be implemented)
// import { auth } from '../middleware/auth';

// Get current user subscription
router.get('/me', (req, res) => {
  // Will require auth middleware
  res.json({ message: 'User subscription retrieved' });
});

// Create new subscription
router.post('/', (req, res) => {
  // Will require auth middleware
  res.status(201).json({ message: 'Subscription created successfully' });
});

// Update subscription (change plan)
router.put('/me', (req, res) => {
  // Will require auth middleware
  res.json({ message: 'Subscription updated' });
});

// Cancel subscription
router.delete('/me', (req, res) => {
  // Will require auth middleware
  res.json({ message: 'Subscription cancelled' });
});

// Payment webhook (for payment processor callbacks)
router.post('/webhook', (req, res) => {
  res.status(200).send();
});

export default router;