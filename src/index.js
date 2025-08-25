require('dotenv').config();
const express = require('express');
const cors = require('cors');

const technologyRoutes = require('./routes/technologyRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/technology', technologyRoutes);
app.use('/api/certificates', certificateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
