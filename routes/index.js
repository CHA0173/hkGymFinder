const express = require('express');

const router = express.Router();
const gymController = require('../controllers/gymController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const { catchErrors } = require('../handlers/errorHandlers');
// Do work here
router.get('/', catchErrors(gymController.getGyms));
router.get('/gyms', catchErrors(gymController.getGyms));
router.get('/gyms/page/:page', catchErrors(gymController.getGyms));

router.get('/reverse/:name', gymController.reverse);

router.get('/add', authController.isLoggedIn, gymController.addGym);
router.post(
  '/add',
  gymController.upload,
  catchErrors(gymController.resize),
  catchErrors(gymController.createGym)
);
router.post(
  '/add/:id',
  gymController.upload,
  catchErrors(gymController.resize),
  catchErrors(gymController.updateGym)
);

router.get('/gyms/:id/edit', catchErrors(gymController.editGym));
router.get('/gym/:slug', catchErrors(gymController.getGymBySlug));

router.get('/tags', catchErrors(gymController.getGymsByTag));
router.get('/tags/:tag', catchErrors(gymController.getGymsByTag));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);
router.post('/register', userController.validateRegister, userController.register, authController.login);
router.get('/logout', authController.logout);
router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', authController.confirmedPasswords, catchErrors(authController.update));
router.get('/map', gymController.mapPage);
router.get('/hearts', catchErrors(gymController.getHearts));
router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));
router.get('/top', catchErrors(gymController.getTopGyms));

// API endpoints
router.get('/api/search', catchErrors(gymController.searchGyms));
router.get('/api/gyms/near', catchErrors(gymController.mapGyms));
router.post('/api/gyms/:id/heart', authController.isLoggedIn, catchErrors(gymController.heartGym));

module.exports = router;
