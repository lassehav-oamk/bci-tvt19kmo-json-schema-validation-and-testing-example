const express = require('express');
const bodyParser = require('body-parser');
const Ajv = require("ajv").default;
const app = express();
const port = 3000;
const exampleJsonSchema = require('./schemas/weatherSensorReport.json');
const { request } = require('chai');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

/* BODY RAKENNE
{
  "windSpeed": 4.5,
  "temperature": 23.5,
  "feelsLike": "Chilly",
  "dateTime": "2015-06-20T12:00:00"
}
*/

let sensorData = [];

app.post('/sensors/:id', (req, res) => {
  const ajv = new Ajv();
  const validate = ajv.compile(exampleJsonSchema);
  const valid = validate(req.body);
  if (!valid) {
    console.log(validate.errors);
    res.status(400);
    res.json(validate.errors);
    return;
  }

  sensorData.push({
    id: sensorData.length,
    sensorId: parseInt(req.params.id),
    windSpeed: req.body.windSpeed,
    temperature: req.body.temperature,
    feelsLike: req.body.feelsLike,
    dateTime: req.body.dateTime,
  });

  res.status(201).send("OK!");
});

/* GET /sensors
  Vastauksen rakenne
  {
    "sensorData": [
      {
        "id": 2346436,
        "sensorId": 2345667,
        "windSpeed": 4.5,
        "temperature": 23.5,
        "feelsLike": "Chilly",
        "dateTime": "2015-06-20T12:00:00"
      }
    ]
  }
*/
app.get('/sensors', (req, res) => {
  res.json({
    "sensorData": sensorData
  });
})


let serverInstance = null;

module.exports = {
  start: () => {
    serverInstance = app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  },
  close: () => {
    serverInstance.close();
  }
}