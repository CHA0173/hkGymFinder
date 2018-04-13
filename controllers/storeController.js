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

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', {
    title: 'Stores',
    stores,
  });
};

exports.editStore = async (req, res) => {
  // 1. Find the store given id
  const store = await Store.findOne({ _id: req.params.id });
  // 2. Confirm user is owner of store
  // 3. Render out edit form so user can update
  res.render('editStore', {
    title: `Edit ${store.name}`,
    store,
  });
};

exports.updateStore = async (req, res) => {
  // 1. Find store
  const store = await Store.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).exec();
  req.flash('success', `Successfully updated ${store.name}. <a href="/stores/${store.slug}">View store -> </a>`);
  res.redirect(`/stores/${store._id}/edit`);
  // 2. Redirect to store & flash success
};
