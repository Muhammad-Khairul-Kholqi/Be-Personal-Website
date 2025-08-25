require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const technologyRoutes = require('./routes/technologyRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const serviceRoute = require('./routes/serviceRoute');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/technology', technologyRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/services', serviceRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});