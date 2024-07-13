const express = require('express');
const countryRouter = express.Router();
const {CountryModel} = require('../models/countryModel'); 
const axios = require('axios'); 
const { auth } = require('../middleware/auth');


countryRouter.get('/:currencyCode',auth, async (req, res) => {
  try {
    const currencyCode = req.params.currencyCode.toUpperCase(); 
    const countries = await CountryModel.find({ currency: currencyCode });

    if (countries.length === 0) {

      const apiUrl = `https://restcountries.com/v3.1/currency/${currencyCode}`;
      const apiResponse = await axios.get(apiUrl);
      const apiData = apiResponse.data;

      if (apiData.length > 0) {
        const countryCode = req.params.currencyCode.toUpperCase().substring(0, 2); 

        const newCountry = new CountryModel({
          name: apiData[0].name.common,
          capital: apiData[0].capital[0],
          currency: currencyCode,
          languages: Object.values(apiData[0].languages),
          flag: `https://flagsapi.com/${countryCode}/shiny/64.png`,
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

    res.status(500).json({ error:error, message: 'Failed to retrieve countries' });
  }
});


module.exports = {countryRouter};