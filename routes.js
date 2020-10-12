'use sctrict';

const express = require('express');
const router = express.Router();

const StartFlow = require('./startFlow');
const RenderVideo = require('./renderVideo');

router.get('/version', (req, res) => res.status(200).send({ version: "0.0.1" }));
router.get('/startflow', StartFlow.start);
router.get('/render', RenderVideo.start);

module.exports = router;

/* 4017CDA458157214E44C2A5B4D67B560 Nome do domínio: jogoserio*/