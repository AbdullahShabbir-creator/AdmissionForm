const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./Database/Db');
connectDB();
app.use(express.json());
app.use(cors())
 //Routes
const admissionR = require('./Routes/AdmissionRoute');
app.use('/api', admissionR); 
const formRoutes = require('./routes/formRoutes'); 
app.use('/api', formRoutes);

//Simple request 
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
