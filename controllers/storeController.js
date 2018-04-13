const mongoose = require('mongoose');

const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index', {
    title: 'I love dogs',
    name: 'wes',
    dog: 'snickers',
  });
};

exports.reverse = (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.json(reverse);
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add Store',
  });
};

exports.createStore = async (req, res) => {
  const store = await new Store(req.body).save();
  req.flash('success', `Successfully created ${store.name}.  Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};
