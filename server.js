const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({path:'./.env'});
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const voteRoutes = require('./routes/voteRoutes');


const app = express();
const corsOptions ={
  //allow from all
    origin: '*',
    credentials:true,            
    //access-control-allow-credentials:true
    optionSuccessStatus:200,
    //allow everything
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

}
app.use(cors(corsOptions));
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
