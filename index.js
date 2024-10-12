const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

app.get('/api/users/delete', async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ message: 'All users have been deleted!', result });
  } catch (error) {
    res.status(500).json({ message: 'Deleting all users failed!', error });
  }
});

app.get('/api/exercises/delete', async (req, res) => {
  try {
    const result = await Exercise.deleteMany({});
    res.json({ message: 'All exercises have been deleted!', result });
  } catch (error) {
    res.status(500).json({ message: 'Deleting all exercises failed!', error });
  }
});

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
  await User.syncIndexes();
  await Exercise.syncIndexes();
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.json({ message: 'There are no users in the database!' });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Getting all users failed!', error });
  }
});

app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  try {
    const newUser = new User({ username });
    const user = await newUser.save();
    res.json({ username: user.username, _id: user._id });
  } catch (error) {
    res.status(500).json({ message: 'User creation failed!', error });
  }
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const { _id } = req.params;
  let { description, duration, date } = req.body;

  if (!date) {
    date = new Date().toISOString().substring(0, 10);
  }

  try {
    const userInDb = await User.findById(_id);
    if (!userInDb) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const newExercise = new Exercise({
      userId: userInDb._id,
      username: userInDb.username,
      description,
      duration: parseInt(duration),
      date,
    });

    const exercise = await newExercise.save();
    res.json({
      username: userInDb.username,
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString(),
      _id: userInDb._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Exercise creation failed!', error });
  }
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  const from = req.query.from || new Date(0).toISOString().substring(0, 10);
  const to = req.query.to || new Date(Date.now()).toISOString().substring(0, 10);
  const limit = Number(req.query.limit) || 0;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const exercises = await Exercise.find({
      userId: _id,
      date: { $gte: from, $lte: to },
    })
      .select('description duration date')
      .limit(limit)
      .exec();

    const parsedDatesLog = exercises.map((exercise) => ({
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString(),
    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: parsedDatesLog.length,
      log: parsedDatesLog,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get exercise logs!', error });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
