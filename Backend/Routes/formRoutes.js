// routes/formRoutes.js
const express = require('express');
const router = express.Router();
const Name = require('../Models/nameModel'); // Adjusted path

// Route to get name suggestions based on input
router.get('/suggestions', async (req, res) => {
  const { name } = req.query;

  console.log('Name query:', name); // Log incoming name query

  if (!name) {
    return res.json({ suggestions: [] });
  }

  try {
    // Query the database for names starting with the entered name
    const filteredNames = await Name.find({
      fullName: { $regex: `^${name}`, $options: 'i' },
    }).limit(10); // Limit the number of suggestions

    console.log('Filtered names:', filteredNames); // Log the results

    // Return the matching names
    res.json({ suggestions: filteredNames.map(n => n.fullName) });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ suggestions: [] });
  }
});

module.exports = router;
