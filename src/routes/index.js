'use strict';
const express = require('express');
const router = express.Router();

// router.get('', (req, res) => {
//   const strCompress =
//     'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nunc eget ultricies ultricies, nisl nunc ultricies elit, nec ultricies nisl elit';
//   res.status(200).json({
//     message: 'Hello AE',
//     metadata: strCompress.repeat(1000),
//   });
// });

router.use('/v1/api', require('./access'));

module.exports = router;
