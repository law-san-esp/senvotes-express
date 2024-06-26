const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({path:'./.env'});
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const voteRoutes = require('./routes/voteRoutes');


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SENVOTE API' });
});
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/votes', voteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
