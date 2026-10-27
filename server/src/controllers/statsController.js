const Ticket = require('../models/Ticket');

// @desc Get overview statistics
// @route GET /api/stats
const getStats = async (req, res) => {
  try {
    let scopeQuery = {};
    if (req.user.role === 'employee') {
      scopeQuery = { createdBy: req.user._id };
    }

    const totalTickets = await Ticket.countDocuments(scopeQuery);
    const openTickets = await Ticket.countDocuments({ ...scopeQuery, status: 'Open' });
    const inProgressTickets = await Ticket.countDocuments({ ...scopeQuery, status: 'In Progress' });
    const resolvedTickets = await Ticket.countDocuments({ ...scopeQuery, status: 'Resolved' });
    const closedTickets = await Ticket.countDocuments({ ...scopeQuery, status: 'Closed' });
    const criticalTickets = await Ticket.countDocuments({ ...scopeQuery, priority: 'Critical' });

    let myAssignedTickets = 0;
    let unassignedTickets = 0;

    if (req.user.role !== 'employee') {
      myAssignedTickets = await Ticket.countDocuments({ assignedTo: req.user._id, status: { $nin: ['Closed', 'Resolved'] } });
      unassignedTickets = await Ticket.countDocuments({ assignedTo: null, status: 'Open' });
    }

    // Category breakdown
    const categoryStats = await Ticket.aggregate([
      { $match: scopeQuery },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Priority breakdown
    const priorityStats = await Ticket.aggregate([
      { $match: scopeQuery },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
        critical: criticalTickets,
        myAssigned: myAssignedTickets,
        unassigned: unassignedTickets,
        categoryStats,
        priorityStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats };
