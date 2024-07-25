const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({path:'./.env'});
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const voteRoutes = require('./routes/voteRoutes');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
app.use(limiter);
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SENVOTE API using SSL' });
});
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/votes', voteRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server 🚀 running on port ${PORT}`);
});

