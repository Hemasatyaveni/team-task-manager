const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding.');

    const adminEmail = 'admin@company.com';
    const memberEmail = 'member@company.com';

    const adminPassword = await bcrypt.hash('admin123', 12);
    const memberPassword = await bcrypt.hash('member123', 12);

    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      { name: 'Admin User', email: adminEmail, password: adminPassword, role: 'admin' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const member = await User.findOneAndUpdate(
      { email: memberEmail },
      { name: 'Team Member', email: memberEmail, password: memberPassword, role: 'member' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const project = await Project.findOneAndUpdate(
      { name: 'Product Launch' },
      {
        name: 'Product Launch',
        description: 'Launch the new product with a coordinated team effort.',
        members: [member._id],
        createdBy: admin._id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Task.findOneAndUpdate(
      { title: 'Design product landing page' },
      {
        title: 'Design product landing page',
        description: 'Create the landing page visuals and copy for the new product release.',
        priority: 'High',
        status: 'Pending',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedTo: member._id,
        project: project._id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('Seed data created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
