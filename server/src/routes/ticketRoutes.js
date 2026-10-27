const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  acceptTicket,
  assignTicket,
  updateStatus,
  updatePriority,
  addComment,
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getTickets)
  .post(createTicket);

router.route('/:id')
  .get(getTicketById);

router.patch('/:id/accept', authorize('engineer', 'admin'), acceptTicket);
router.patch('/:id/assign', authorize('engineer', 'admin'), assignTicket);
router.patch('/:id/priority', authorize('engineer', 'admin'), updatePriority);
router.patch('/:id/status', updateStatus);
router.post('/:id/comments', addComment);

module.exports = router;
