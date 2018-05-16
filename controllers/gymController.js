const mongoose = require('mongoose');

const Gym = mongoose.model('Gym');
const User = mongoose.model('User');

const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  function(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: `That file type isn't allowed!` }, false);
    }
  },
};

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

exports.addGym = (req, res) => {
  res.render('editGym', {
    title: 'Add Gym',
  });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    return next();
  }
  // console.log(req.file);
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // resizing
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written photo to file system, keep going
  next();
};

exports.createGym = async (req, res) => {
  req.body.author = req.user._id;
  const gym = await new Gym(req.body).save();
  req.flash('success', `Successfully created ${gym.name}.  Care to leave a review?`);
  res.redirect(`/gym/${gym.slug}`);
};

exports.getGyms = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 6;
  const skip = page * limit - limit;
  const gymsPromise = Gym.find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' });

  const countPromise = Gym.count();
  const [gyms, count] = await Promise.all([gymsPromise, countPromise]);
  const pages = Math.ceil(count / limit);
  if (!gyms.length && skip) {
    req.flash('info', `Page ${page} does not exist, redirecting to page ${pages}`);
    res.redirect(`/gyms/page/${pages}`);
    return;
  }
  res.render('gyms', {
    title: `Gyms`,
    gyms,
    page,
    pages,
    count,
  });
};

const confirmOwner = (gym, user) => {
  if (!gym.author.equals(user._id)) {
    throw Error('You must own the gym in order to edit it!');
  }
};

exports.editGym = async (req, res) => {
  // 1. Find the gym given id
  const gym = await Gym.findOne({ _id: req.params.id });
  // 2. Confirm user is owner of gym
  confirmOwner(gym, req.user);
  // 3. Render out edit form so user can update
  res.render('editGym', {
    title: `Edit ${gym.name}`,
    gym,
  });
};

exports.updateGym = async (req, res) => {
  // set location body to be a point
  req.body.location.type = 'Point';
  // 1. Find gym
  const gym = await Gym.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).exec();
  req.flash('success', `Successfully updated ${gym.name}. <a href="/gyms/${gym.slug}">View gym -> </a>`);
  res.redirect(`/gyms/${gym._id}/edit`);
  // 2. Redirect to gym & flash success
};

exports.getGymBySlug = async (req, res, next) => {
  const gym = await Gym.findOne({ slug: req.params.slug }).populate('author reviews');
  if (!gym) {
    return next();
  }
  res.render('gym', {
    title: `${gym.name}`,
    gym,
  });
};

exports.getGymsByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };
  const tagsPromise = Gym.getTagsList();
  const gymsPromise = Gym.find({ tags: tagQuery });
  const [tags, gyms] = await Promise.all([tagsPromise, gymsPromise]);
  res.render('tags', {
    title: `tags`,
    tags,
    tag,
    gyms,
  });
};

exports.searchGyms = async (req, res) => {
  const gyms = await Gym.find(
    {
      $text: {
        $search: req.query.q,
      },
    },
    {
      score: { $meta: 'textScore' },
    }
  )
    .sort({
      score: { $meta: 'textScore' },
    })
    .limit(5);
  res.json(gyms);
};

exports.mapGyms = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const q = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates,
        },
        $maxDistance: 10000, // 10km
      },
    },
  };
  const gyms = await Gym.find(q)
    .select('slug name description location')
    .limit(10);
  res.json(gyms);
};

exports.mapPage = (req, res) => {
  res.render('map', { title: 'Map' });
};

exports.heartGym = async (req, res) => {
  const hearts = req.user.hearts.map(obj => obj.toString());
  const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
  const user = await User.findByIdAndUpdate(req.user._id, {
    [operator]: { hearts: req.params.id },
    new: true,
  });
  res.json(user);
};

exports.getHearts = async (req, res) => {
  const gyms = await Gym.find({
    _id: { $in: req.user.hearts },
  });
  res.render('gyms', { title: 'Hearted Gyms', gyms });
};

exports.getTopGyms = async (req, res) => {
  const gyms = await Gym.getTopGyms();
  res.render('topGyms', { gyms, title: 'Top Gyms!' });
};
