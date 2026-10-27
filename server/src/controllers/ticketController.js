const Ticket = require('../models/Ticket');
const User = require('../models/User');

// @desc Create a new ticket (Employees & Admins)
// @route POST /api/tickets
const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority, deviceInfo } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required.',
      });
    }

    const ticket = new Ticket({
      title,
      description,
      category,
      priority: priority || 'Medium',
      deviceInfo: deviceInfo || '',
      department: req.user.department || 'General',
      createdBy: req.user._id,
      activityLog: [
        {
          action: 'Ticket Created',
          performedBy: req.user._id,
          performedByName: req.user.name,
          details: `Ticket submitted by ${req.user.name} (${req.user.role})`,
        },
      ],
    });

    const savedTicket = await ticket.save();
    const populated = await Ticket.findById(savedTicket._id)
      .populate('createdBy', 'name email department role')
      .populate('assignedTo', 'name email role');

    res.status(201).json({ success: true, ticket: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get tickets with role-based filtering & query parameters
// @route GET /api/tickets
const getTickets = async (req, res) => {
  try {
    const { status, priority, category, filter, search } = req.query;
    let query = {};

    // Role-based scoping:
    // If employee: view only own tickets
    if (req.user.role === 'employee') {
      query.createdBy = req.user._id;
    } else {
      // Engineer or Admin
      if (filter === 'assigned_to_me') {
        query.assignedTo = req.user._id;
      } else if (filter === 'unassigned') {
        query.assignedTo = null;
      }
    }

    // Additional filters
    if (status && status !== 'All') {
      query.status = status;
    }
    if (priority && priority !== 'All') {
      query.priority = priority;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email department role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });

    // Filter out internal comments for employees
    const sanitizedTickets = tickets.map((t) => {
      const ticketObj = t.toObject();
      if (req.user.role === 'employee') {
        ticketObj.comments = ticketObj.comments.filter((c) => !c.isInternal);
      }
      return ticketObj;
    });

    res.json({ success: true, count: sanitizedTickets.length, tickets: sanitizedTickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single ticket details
// @route GET /api/tickets/:id
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email department role')
      .populate('assignedTo', 'name email role')
      .populate('comments.user', 'name role');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check permission: employees can only view their own tickets
    if (
      req.user.role === 'employee' &&
      ticket.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const ticketObj = ticket.toObject();
    if (req.user.role === 'employee') {
      ticketObj.comments = ticketObj.comments.filter((c) => !c.isInternal);
    }

    res.json({ success: true, ticket: ticketObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Accept ticket (Support Engineer assigns to self and starts progress)
// @route PATCH /api/tickets/:id/accept
const acceptTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.assignedTo = req.user._id;
    if (ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    ticket.activityLog.push({
      action: 'Ticket Accepted',
      performedBy: req.user._id,
      performedByName: req.user.name,
      details: `Accepted and assigned to engineer ${req.user.name}`,
    });

    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email department role')
      .populate('assignedTo', 'name email role');

    res.json({ success: true, message: 'Ticket accepted successfully', ticket: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Assign ticket to specific engineer (Engineer/Admin)
// @route PATCH /api/tickets/:id/assign
const assignTicket = async (req, res) => {
  try {
    const { engineerId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const engineer = await User.findById(engineerId);
    if (!engineer || (engineer.role !== 'engineer' && engineer.role !== 'admin')) {
      return res.status(400).json({ success: false, message: 'Valid support engineer required' });
    }

    ticket.assignedTo = engineer._id;
    if (ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    ticket.activityLog.push({
      action: 'Ticket Assigned',
      performedBy: req.user._id,
      performedByName: req.user.name,
      details: `Assigned to ${engineer.name} by ${req.user.name}`,
    });

    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email department role')
      .populate('assignedTo', 'name email role');

    res.json({ success: true, message: `Assigned to ${engineer.name}`, ticket: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update ticket status
// @route PATCH /api/tickets/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status, resolutionSummary } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Role checks:
    // Employees can close, mark resolved, or reopen their own tickets
    if (req.user.role === 'employee') {
      if (ticket.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (status !== 'Closed' && status !== 'Open' && status !== 'Resolved') {
        return res.status(403).json({
          success: false,
          message: 'Employees can only set status to Resolved, Closed, or Reopen (Open).',
        });
      }
    }

    const oldStatus = ticket.status;
    ticket.status = status;

    if (status === 'Resolved') {
      if (resolutionSummary) {
        ticket.resolutionSummary = resolutionSummary;
      }
    }
    if (status === 'Closed') {
      ticket.closedAt = new Date();
    }

    ticket.activityLog.push({
      action: 'Status Changed',
      performedBy: req.user._id,
      performedByName: req.user.name,
      details: `Status changed from ${oldStatus} to ${status}${
        resolutionSummary ? ` - Note: ${resolutionSummary}` : ''
      }`,
    });

    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email department role')
      .populate('assignedTo', 'name email role');

    res.json({ success: true, message: `Status updated to ${status}`, ticket: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update ticket priority (Engineers & Admins)
// @route PATCH /api/tickets/:id/priority
const updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const oldPriority = ticket.priority;
    ticket.priority = priority;

    ticket.activityLog.push({
      action: 'Priority Changed',
      performedBy: req.user._id,
      performedByName: req.user.name,
      details: `Priority updated from ${oldPriority} to ${priority} by ${req.user.name}`,
    });

    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email department role')
      .populate('assignedTo', 'name email role');

    res.json({ success: true, message: `Priority updated to ${priority}`, ticket: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add comment / note to ticket
// @route POST /api/tickets/:id/comments
const addComment = async (req, res) => {
  try {
    const { text, isInternal } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Role check: Only engineers and admins can post internal notes
    const willBeInternal = Boolean(isInternal) && (req.user.role === 'engineer' || req.user.role === 'admin');

    ticket.comments.push({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      text: text.trim(),
      isInternal: willBeInternal,
      createdAt: new Date(),
    });

    ticket.activityLog.push({
      action: willBeInternal ? 'Internal Note Added' : 'Comment Added',
      performedBy: req.user._id,
      performedByName: req.user.name,
      details: `${willBeInternal ? 'Internal note' : 'Reply'} added by ${req.user.name}`,
    });

    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email department role')
      .populate('assignedTo', 'name email role');

    const ticketObj = updated.toObject();
    if (req.user.role === 'employee') {
      ticketObj.comments = ticketObj.comments.filter((c) => !c.isInternal);
    }

    res.json({ success: true, message: 'Comment added', ticket: ticketObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  acceptTicket,
  assignTicket,
  updateStatus,
  updatePriority,
  addComment,
};
