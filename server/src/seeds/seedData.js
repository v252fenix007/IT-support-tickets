const User = require('../models/User');
const Ticket = require('../models/Ticket');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already populated, skipping seed.');
      return;
    }

    console.log('🌱 Seeding initial users and tickets...');

    // Clear just in case
    await User.deleteMany({});
    await Ticket.deleteMany({});

    // Create demo users
    const alice = await User.create({
      name: 'Alice Smith',
      email: 'alice.smith@company.com',
      password: 'password123',
      role: 'employee',
      department: 'Marketing & Design',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    });

    const david = await User.create({
      name: 'David Lee',
      email: 'david.lee@company.com',
      password: 'password123',
      role: 'employee',
      department: 'Financial Analysis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    const marcus = await User.create({
      name: 'Marcus Vance',
      email: 'marcus.tech@company.com',
      password: 'password123',
      role: 'engineer',
      department: 'IT Support & Systems',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    });

    const elena = await User.create({
      name: 'Elena Rostova',
      email: 'elena.rostova@company.com',
      password: 'password123',
      role: 'engineer',
      department: 'Cloud & Network Ops',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    const sarah = await User.create({
      name: 'Sarah Jenkins',
      email: 'admin.sarah@company.com',
      password: 'password123',
      role: 'admin',
      department: 'IT Infrastructure & Security',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    });

    // Create demo tickets
    await Ticket.create([
      {
        ticketNumber: 'IT-1001',
        title: 'Corporate VPN dropping connection every 15 minutes',
        description: 'Whenever I connect to the GlobalProtect VPN from home, the session automatically disconnects after 15 minutes of inactivity or during video calls. Error code: SEC_TLS_TIMEOUT_09.',
        category: 'Network',
        priority: 'High',
        status: 'Open',
        createdBy: alice._id,
        assignedTo: null,
        department: alice.department,
        deviceInfo: 'MacBook Air M2, macOS Sonoma 14.4',
        activityLog: [
          {
            action: 'Ticket Created',
            performedBy: alice._id,
            performedByName: alice.name,
            details: 'Initial ticket filed by Alice Smith',
            timestamp: new Date(Date.now() - 3600000 * 3),
          },
        ],
        comments: [
          {
            user: alice._id,
            userName: alice.name,
            userRole: alice.role,
            text: 'I already tried reinstalling the VPN certificate and restarting the gateway, but the issue persists.',
            isInternal: false,
            createdAt: new Date(Date.now() - 3600000 * 2),
          },
        ],
      },
      {
        ticketNumber: 'IT-1002',
        title: 'MacBook Pro screen flickering and severe thermal throttling',
        description: 'My laptop fan stays at maximum RPM continuously while working in spreadsheets. The primary display displays purple artifacts and flickers intermittently.',
        category: 'Hardware',
        priority: 'Critical',
        status: 'In Progress',
        createdBy: david._id,
        assignedTo: marcus._id,
        department: david.department,
        deviceInfo: 'MacBook Pro 16" 2023, Serial #C02G4120MD6R',
        activityLog: [
          {
            action: 'Ticket Created',
            performedBy: david._id,
            performedByName: david.name,
            details: 'Ticket filed by David Lee',
            timestamp: new Date(Date.now() - 3600000 * 18),
          },
          {
            action: 'Ticket Accepted',
            performedBy: marcus._id,
            performedByName: marcus.name,
            details: 'Accepted and assigned to Marcus Vance',
            timestamp: new Date(Date.now() - 3600000 * 16),
          },
          {
            action: 'Priority Changed',
            performedBy: marcus._id,
            performedByName: marcus.name,
            details: 'Priority escalated to Critical due to potential battery/GPU hardware failure',
            timestamp: new Date(Date.now() - 3600000 * 15),
          },
        ],
        comments: [
          {
            user: marcus._id,
            userName: marcus.name,
            userRole: marcus.role,
            text: 'David, please drop off the machine at IT Desk 3rd Floor when you take your lunch break. I will run Apple Diagnostics on the GPU and logic board.',
            isInternal: false,
            createdAt: new Date(Date.now() - 3600000 * 14),
          },
          {
            user: marcus._id,
            userName: marcus.name,
            userRole: marcus.role,
            text: 'INTERNAL NOTE: Checked warranty portal. Machine is under AppleCare for Enterprise until 2027. If diagnostics fail, we will swap with Loaner Unit #MBP-L14.',
            isInternal: true,
            createdAt: new Date(Date.now() - 3600000 * 12),
          },
          {
            user: david._id,
            userName: david.name,
            userRole: david.role,
            text: 'Thanks Marcus! I will bring it by at 1:00 PM today.',
            isInternal: false,
            createdAt: new Date(Date.now() - 3600000 * 8),
          },
        ],
      },
      {
        ticketNumber: 'IT-1003',
        title: 'Need IAM read permissions for AWS CloudWatch and S3 telemetry bucket',
        description: 'Our team is launching the Q3 marketing analytics pipeline. I need read-only IAM policy for `arn:aws:s3:::company-telemetry-q3` and CloudWatch log groups.',
        category: 'Access & Security',
        priority: 'Medium',
        status: 'In Progress',
        createdBy: alice._id,
        assignedTo: elena._id,
        department: alice.department,
        deviceInfo: 'Cloud Identity: alice.smith@company.com',
        activityLog: [
          {
            action: 'Ticket Created',
            performedBy: alice._id,
            performedByName: alice.name,
            details: 'Access request submitted',
            timestamp: new Date(Date.now() - 3600000 * 24),
          },
          {
            action: 'Ticket Accepted',
            performedBy: elena._id,
            performedByName: elena.name,
            details: 'Assigned to Elena Rostova',
            timestamp: new Date(Date.now() - 3600000 * 20),
          },
        ],
        comments: [
          {
            user: elena._id,
            userName: elena.name,
            userRole: elena.role,
            text: 'Manager approval received from Director of Analytics. Generating temporary role with AWS IAM Identity Center.',
            isInternal: false,
            createdAt: new Date(Date.now() - 3600000 * 19),
          },
        ],
      },
      {
        ticketNumber: 'IT-1004',
        title: 'Figma Enterprise Organization seat license missing after SSO login',
        description: 'Logged into Figma via Okta SAML this morning and received "Viewer Restricted" status instead of Editor seat. Cannot edit the design system components.',
        category: 'Software',
        priority: 'Medium',
        status: 'Resolved',
        createdBy: alice._id,
        assignedTo: marcus._id,
        department: alice.department,
        deviceInfo: 'Web Browser / Figma Desktop v116.15',
        resolutionSummary: 'Synchronized SCIM provisioning group in Okta. Figma Enterprise editor seat license restored and verified.',
        activityLog: [
          {
            action: 'Ticket Created',
            performedBy: alice._id,
            performedByName: alice.name,
            details: 'Created by Alice Smith',
            timestamp: new Date(Date.now() - 3600000 * 48),
          },
          {
            action: 'Status Changed',
            performedBy: marcus._id,
            performedByName: marcus.name,
            details: 'Status changed to Resolved',
            timestamp: new Date(Date.now() - 3600000 * 30),
          },
        ],
        comments: [
          {
            user: marcus._id,
            userName: marcus.name,
            userRole: marcus.role,
            text: 'I updated the Okta group mapping and pushed a manual SCIM synchronization. Please sign out of Figma and log back in.',
            isInternal: false,
            createdAt: new Date(Date.now() - 3600000 * 31),
          },
        ],
      },
      {
        ticketNumber: 'IT-1005',
        title: 'Request dual 4K USB-C monitors & docking station setup at Desk #42',
        description: 'New workstation setup requires dual Dell UltraSharp monitors and a Thunderbolt 4 dock for multi-screen data modeling.',
        category: 'Hardware',
        priority: 'Low',
        status: 'Closed',
        createdBy: david._id,
        assignedTo: elena._id,
        department: david.department,
        deviceInfo: 'Desk 42 - 4th Floor West Wing',
        resolutionSummary: 'Delivered and configured two Dell U2723QE monitors with CalDigit TS4 dock. Cables routed and tested with user laptop.',
        closedAt: new Date(Date.now() - 3600000 * 60),
        activityLog: [
          {
            action: 'Ticket Created',
            performedBy: david._id,
            performedByName: david.name,
            details: 'Hardware request created',
            timestamp: new Date(Date.now() - 3600000 * 96),
          },
          {
            action: 'Status Changed',
            performedBy: elena._id,
            performedByName: elena.name,
            details: 'Status changed to Closed',
            timestamp: new Date(Date.now() - 3600000 * 60),
          },
        ],
      },
      {
        ticketNumber: 'IT-1007',
        title: 'External USB-C monitor not detected after OS update',
        description: 'Screen remains black and USB peripherals plugged into the monitor hub do not register.',
        category: 'Hardware',
        priority: 'Medium',
        status: 'Resolved',
        createdBy: alice._id,
        assignedTo: marcus._id,
        department: alice.department,
        deviceInfo: 'Dell 4K U2723QE / CalDigit Dock',
        resolutionSummary: 'Reinstalled DisplayLink v1.10.1 drivers, power-cycled CalDigit dock, and verified external monitor connectivity and USB peripheral detection.',
        activityLog: [
          {
            action: 'Ticket Created',
            performedBy: alice._id,
            performedByName: alice.name,
            details: 'Ticket submitted by Alice Smith (employee)',
            timestamp: new Date(Date.now() - 3600000 * 2),
          },
          {
            action: 'Comment Added',
            performedBy: alice._id,
            performedByName: alice.name,
            details: 'Reply added by Alice Smith',
            timestamp: new Date(Date.now() - 3600000 * 1.5),
          },
          {
            action: 'Ticket Accepted',
            performedBy: marcus._id,
            performedByName: marcus.name,
            details: 'Accepted and assigned to engineer Marcus Vance',
            timestamp: new Date(Date.now() - 3600000 * 1),
          },
          {
            action: 'Status Changed',
            performedBy: marcus._id,
            performedByName: marcus.name,
            details: 'Status changed from In Progress to Resolved - Note: Reinstalled DisplayLink v1.10.1 drivers, power-cycled CalDigit dock, and verified external monitor connectivity and USB peripheral detection.',
            timestamp: new Date(Date.now() - 3600000 * 0.5),
          },
        ],
        comments: [
          {
            user: alice._id,
            userName: alice.name,
            userRole: alice.role,
            text: 'pls resolve this problem',
            isInternal: false,
            createdAt: new Date(Date.now() - 3600000 * 1.5),
          },
          {
            user: marcus._id,
            userName: marcus.name,
            userRole: marcus.role,
            text: 'Hi Alice, I have resolved the issue. Reinstalled DisplayLink v1.10.1 drivers, power-cycled the CalDigit dock, and verified USB-C external monitor output and USB peripheral detection. Everything is functioning normally.',
            isInternal: false,
            createdAt: new Date(Date.now() - 3600000 * 0.5),
          },
        ],
      },
    ]);

    console.log('✅ Seed data successfully inserted (5 users, 5 tickets)!');
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
  }
};

module.exports = { seedDatabase };

// Allow direct execution: node src/seeds/seedData.js
if (require.main === module) {
  const { connectDB, disconnectDB } = require('../config/db');
  require('dotenv').config();
  (async () => {
    await connectDB();
    await seedDatabase();
    await disconnectDB();
    process.exit(0);
  })();
}
