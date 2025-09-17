const mongoose = require('mongoose');
const dotenv = require('dotenv-flow');

dotenv.config({ node_env: 'test' });

before(function () {
  this.timeout(10000);
});

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

beforeEach(async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});