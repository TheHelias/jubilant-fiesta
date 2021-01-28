import express from 'express';

var router = express.Router();

router.get('/', function (req, res, next) {
  res.status(200).send({
    message: 'My Rule-Validation API',
    status: 'success',
    data: {
      name: 'Elias Akande',
      github: '@TheHelias',
      email: 'akandetoluwalase@gmail.com',
      mobile: '08166746401',
      twitter: '@_ThElias'
    }
  });
});

export default router;
