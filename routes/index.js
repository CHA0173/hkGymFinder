const express = require('express');

const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  // const nate = { name: 'Nate', age: 34, cool: true };
  // res.send('Hey! It works!');
  // res.json(nate);
  // res.send(req.query);
  res.render('hello', {
    title: 'I love dogs',
    name: 'wes',
    dog: req.query.dog,
  });
});

router.get('/reverse/:name', (req, res) => {
  // res.send(req.params.name);
  // const reverse = [req.params.name];
  const reverse = [...req.params.name].reverse().join('');
  res.json(reverse);
});

module.exports = router;
