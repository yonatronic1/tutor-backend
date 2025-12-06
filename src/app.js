const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const tutorRoutes = require('./routes/tutorRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load('./swagger/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/tutors', tutorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/', (req, res) => {
  res.send('Tutor API is running');
});