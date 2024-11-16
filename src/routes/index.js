const express = require('express');
const router = express.Router();
const estudianteRepository = require('../repositories/EstudianteRepository');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn,  async (request,response) => {
    response.render('home/home');
    
});

module.exports = router;