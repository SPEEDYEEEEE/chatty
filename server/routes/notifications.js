import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).send(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Server error');
  }
});

export default router;
