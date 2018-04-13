const express = require('express');

const router = express.Router();
const storeController = require('../controllers/storeController');

// Do work here
router.get('/', storeController.homePage);
router.get('/reverse/:name', storeController.reverse);
router.get('/add', storeController.addStore);
router.post('/add', storeController.createStore);

module.exports = router;
