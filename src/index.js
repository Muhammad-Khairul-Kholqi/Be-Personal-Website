require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const technologyRoutes = require('./routes/technologyRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const serviceRoutes = require('./routes/serviceRoute');
const contactRoutes = require('./routes/contactRoutes');
const softSkillRoutes = require('./routes/softSkillRoutes');

const app = express();

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/technology', technologyRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/soft-skills', softSkillRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});