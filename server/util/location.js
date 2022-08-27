import axios from 'axios';

import HttpError from '../models/http-error.js';

const API_KEY = process.env.API_KEY;
async function getCoordsForAddress(address) {
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516
  // };
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for the specified address.',
      422
    );
    throw error;
  }
  console.log("ssd");
  console.log(API_KEY);
  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

export default getCoordsForAddress;
