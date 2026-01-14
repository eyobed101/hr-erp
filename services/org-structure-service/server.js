const express = require('express');
const app = express();
const orgStructureRoutes = require('./src/routes/orgStructureRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/orgStructure', orgStructureRoutes);

app.get('/', (req, res) => {
  res.send('org-structure-service is running');
});

app.listen(PORT, () => {
  console.log(`org-structure-service running on port ${PORT}`);
});
