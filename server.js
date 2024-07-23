const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({path:'./.env'});
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const voteRoutes = require('./routes/voteRoutes');
const NodeRSA = require('node-rsa');
const https = require('https');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

resDecrypt = (text, key) => {
  const rsa = new NodeRSA(key);
  return rsa.decrypt(text, 'utf8');
}

// rsaKeys = () => {
//   const rsa = new NodeRSA({b: 1024});
//   const publicKey = rsa.exportKey('public');
//   const privateKey = rsa.exportKey('private');
//   return {publicKey, privateKey};
// }

// console.log(rsaKeys());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SENVOTE API using SSL' });
});
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/votes', voteRoutes);


const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Secure server 🚀🔑 running on port https://localhost:${PORT}`);
});

