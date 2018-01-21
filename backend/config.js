module.exports = {
  mongoUri: process.env.MONGO_URI,
  jwtToken: process.env.JWT_TOKEN || 'tasmanianDevil',
  foursquareClientId: process.env.FOURSQUARE_CLIENT_ID,
  foursquareClientSecret: process.env.FOURSQUARE_CLIENT_SECRET,
};