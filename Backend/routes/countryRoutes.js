const express = require('express');
const countryRouter = express.Router();
const { CountryModel } = require('../models/countryModel');
const axios = require('axios');
const { auth } = require('../middleware/auth');

countryRouter.get('/:currencyCode', auth, async (req, res) => {
  try {
    const currencyCode = req.params.currencyCode.toUpperCase();

    const countries = await CountryModel.find({ currency: currencyCode });

    if (countries.length === 0) {
      const apiUrl = `https://restcountries.com/v3.1/currency/${currencyCode}`;
      const apiResponse = await axios.get(apiUrl);
      const apiData = apiResponse.data;

      if (apiData.length > 0) {
        // Extract first two characters for flag URL
        let cc;
          cc = currencyCode.substring(0, 2);
       

        const flagUrl = `https://flagsapi.com/${cc}/shiny/64.png`; // Construct flag URL based on cc

        const newCountry = new CountryModel({
          name: apiData[0].name.common,
          capital: apiData[0].capital[0],
          currency: currencyCode, // Use full currency code
          languages: Object.values(apiData[0].languages),
          flag: flagUrl,
        });

        await newCountry.save();
        res.status(200).json(newCountry);
      } else {
        res.status(404).json({ message: 'Country not found' });
      }
    } else {
      res.status(200).json(countries);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message, message: 'Failed to retrieve countries' });
  }
});

module.exports = { countryRouter };
