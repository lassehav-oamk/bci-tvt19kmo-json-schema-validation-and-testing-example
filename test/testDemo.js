const server = require('../server');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'));
const apiAddress = 'http://localhost:3000';

const getSensorsSchema = require('./schemas/getSensorsSchema.json');

var assert = require('assert');
describe('Demonstration of tests', function() {

  // aluksi
  // starttaa palvelin
  before(() => server.start());

  // testien jälkeen
  // sulje palvelin
  after(() => server.close());

  const windSpeedTestValue = 10;
  const temperatureTestValue = 20;
  const feelsLikeTestValue = "Cool";
  const dateTimeTestValue = "2015-06-20T12:00:00";

  describe('Write sensor data', function() {
    it('should accept correct sensor data structure', async function() {
      await chai.request(apiAddress)
        .post('/sensors/15')
        .send({
          "windSpeed": windSpeedTestValue,
          "temperature": temperatureTestValue,
          "feelsLike": feelsLikeTestValue,
          "dateTime": dateTimeTestValue
        })
        .then(response => {
          expect(response).to.have.status(201);
        })
        .catch(err => { throw err });
    })
  })

  describe('Read sensor values', function() {
    it('should return an array of sensor values', async function() {
      // lähetetään http pyyntö
      await chai.request(apiAddress)
        .get('/sensors')
        .then(response => {
           // tarkistaa vastauksen rakenne json schema validoinnilla
           console.log(response.body);
           expect(response).to.have.status(200);
           expect(response.body).to.be.jsonSchema(getSensorsSchema);
           expect(response.body.sensorData[0].windSpeed).to.equal(windSpeedTestValue);
           expect(response.body.sensorData[0].temperature).to.equal(temperatureTestValue);
           expect(response.body.sensorData[0].feelsLike).to.equal(feelsLikeTestValue);
           expect(response.body.sensorData[0].dateTime).to.equal(dateTimeTestValue);

        })
        .catch(error => {
          throw error;
        })
    })
  })
});