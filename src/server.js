
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});
const connectDB = require('./config/db');
const app = require('./app');

const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

// testit server melowel ye5dem walé b get request fi postman
app.get('/test', (req, res) => {
    res.json({ message: 'server ye5dem jawou a7la jaw' });
});

startServer();