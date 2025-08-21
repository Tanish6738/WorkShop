// Seed script for PromptVault MVP
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
const Prompt = require('./src/models/Prompt');
const Collection = require('./src/models/Collection');
const fs = require('fs');

(async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing (CAUTION in prod)
    await Promise.all([
      User.deleteMany({}),
      Prompt.deleteMany({}),
      Collection.deleteMany({})
    ]);

    const passwordHash = await bcrypt.hash('123456', 12);

  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', passwordHash, bio: 'Platform admin', role: 'admin' });
  const alice = await User.create({ name: 'Alice', email: 'alice@example.com', passwordHash, bio: 'Growth marketer', avatarUrl: '' });
  const bob = await User.create({ name: 'Bob', email: 'bob@example.com', passwordHash, bio: 'Prompt tinkerer', avatarUrl: '' });

    const p1 = await Prompt.create({
      title: 'Marketing Angle Generator',
      description: 'Generates 5 fresh angles for a product based on features.',
      content: 'You are a creative marketing strategist...',
      category: 'marketing',
      tags: ['copywriting','ideas'],
      visibility: 'public',
      createdBy: alice._id,
      versions: [{ versionNumber: 1, content: 'You are a creative marketing strategist...', updatedBy: alice._id }]
    });

    const p2 = await Prompt.create({
      title: 'Internal Brainstorm Helper',
      description: 'Private brainstorming scaffold',
      content: 'Act as a brainstorming partner...',
      category: 'productivity',
      tags: ['ideas'],
      visibility: 'private',
      createdBy: alice._id,
      versions: [{ versionNumber: 1, content: 'Act as a brainstorming partner...', updatedBy: alice._id }]
    });

    const remix = await Prompt.create({
      title: 'Marketing Angle Generator (SaaS Focus)',
      description: 'Tailored for SaaS feature benefits.',
      content: 'You are a creative marketing strategist for SaaS...',
      category: 'marketing',
      tags: ['copywriting','ideas','saas'],
      visibility: 'public',
      createdBy: bob._id,
      originalPromptId: p1._id,
      versions: [{ versionNumber: 1, content: 'You are a creative marketing strategist for SaaS...', updatedBy: bob._id }]
    });

    await Prompt.findByIdAndUpdate(p1._id, { $inc: { 'stats.remixes': 1 } });

    const coll = await Collection.create({
      name: 'Alice Favorites',
      description: 'Collection of useful public prompts',
      visibility: 'public',
      createdBy: alice._id,
      promptIds: [p1._id, remix._id]
    });

    const output = { 
      credentials: {
        admin: { email: 'admin@example.com', password: '123456' },
        alice: { email: 'alice@example.com', password: '123456' },
        bob: { email: 'bob@example.com', password: '123456' }
      },
      ids: { admin: admin._id, alice: alice._id, bob: bob._id, promptMain: p1._id, promptPrivate: p2._id, promptRemix: remix._id, collection: coll._id }
    };
    fs.writeFileSync('./seed-output.json', JSON.stringify(output, null, 2));
    console.log('Seed complete');
    console.log(output);
  } catch (e) {
    console.error('Seed error:', e);
  } finally {
    await mongoose.disconnect();
  }
})();
