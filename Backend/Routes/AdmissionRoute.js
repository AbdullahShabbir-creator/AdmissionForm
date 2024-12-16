const express = require('express');
const router = express.Router();
const Admission = require('../Models/AdmissionModel');
const Name = require('../Models/nameModel');


router.post('/submit-form', async (req, res) => {
  const { fullName, email, phone, dob, address, course } = req.body;

  try {
    const existingEmail = await Admission.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }
    const existingPhone = await Admission.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number is already registered.' });
    }


    const newAdmission = new Admission({
      fullName,
      email,
      phone,
      dob,
      address,
      course,
    });

    await newAdmission.save();

    // Save the fullName to the Name model to make it available for suggestions
    const newName = new Name({
      fullName, // Store only the fullName in the Name collection
    });

    // Save to MongoDB Name model
    await newName.save();

    res.status(201).json({ message: 'Form submitted and saved successfully!' });
  } catch (error) {
    console.error('Error saving form data:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/suggestions', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.json({ suggestions: [] });
  }

  try {
    console.log('Searching for name starting with:', name);

    const filteredNames = await Name.find({
      fullName: { $regex: `^${name}`, $options: 'i' },
    }).limit(10);
 
    res.json({ suggestions: filteredNames.map(n => n.fullName) });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ suggestions: [] });
  }
});


module.exports = router;
