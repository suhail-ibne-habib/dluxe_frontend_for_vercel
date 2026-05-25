const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect('mongodb+srv://sohanbindu72_db_user:s21yR0HuPpcYQ49c@skyvip.vkuea5h.mongodb.net/test?appName=skyvip');
    await mongoose.connection.db.dropDatabase();
    console.log('Successfully dropped the "test" database.');
    process.exit(0);
  } catch (err) {
    console.error('Error dropping test DB:', err);
    process.exit(1);
  }
})();
