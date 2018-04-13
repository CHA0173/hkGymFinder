const mongoose = require('mongoose');

const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index', {
    title: 'I love dogs',
    name: 'wes',
    // dog: req.query.dog,
    dog: 'snickers',
  });
};

exports.reverse = (req, res) => {
  // res.send(req.params.name);
  // const reverse = [req.params.name];
  const reverse = [...req.params.name].reverse().join('');
  res.json(reverse);
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add Store',
  });
};

exports.createStore = (req, res) => {
  res.json(req.body);
};
