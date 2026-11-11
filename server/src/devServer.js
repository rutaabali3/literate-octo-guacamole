const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const seedData = require('./utils/seedDatabase');

async function main() {
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'pulseforge_fitness'
    }
  });
  const uri = mongod.getUri();
  logger.info(`In-memory MongoDB started at: ${uri}`);
  await mongoose.connect(uri);
  logger.info('Seeding database with demo data...');
  await seedData();

  app.listen(env.PORT, () => {
    logger.info(`PulseForge API Dev Server running on port ${env.PORT}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
