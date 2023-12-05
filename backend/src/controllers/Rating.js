const Ratings = require('../models/Rating');
const calcRating = require('../functions/calculateRating');

exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Ratings.find(
      {}
    );
    res.status(200).json({
      status: 'OK',
      ratings
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERR',
      message: err.message
    });
  }
};

exports.getRating = async (req, res) => {
  try {
    const rating = await Ratings.findOne({
      ratingID: req.body.id
    }).exec();

    if(rating) {
      res.status(200).json({
        status: 'OK',
        rating
      });
    } else {
      res.status(404).json({ status: 'ERR' });
    }
  } catch (err) {
    res.status(500).json({
      status: 'ERR',
      message: err.message 
    });
  }
};

exports.addRating = async (req, res) => {
    try {

        const uniqueRating = Object.values(req.body.ratingDict)[0];
        const rating = new Ratings({
          ratingID: req.body.id,
          ratingDict: req.body.ratingDict,
          rating: uniqueRating,
        });

        const existing = await Ratings.findOne({ 
            ratingID: req.body.id 
        });

        if(existing) {
            res.status(409).json({
                status: 'ERR',
            });
            return;
        }

        const newRating = await rating.save();
        res.status(201).json({status: 'OK'});

    } catch (err) {
        res.status(500).json({
          status: 'ERR',
          message: err.message
        });
    }
}

exports.deleteRating = async (req, res) => {
  try {
    const rating = await Ratings.findOneAndDelete({
      ratingID: req.body.id
    }).exec();

    if(rating) {
      res.status(200).json( { status: 'OK' } );
    } else {
      res.status(404).json({ status: 'ERR' }); 
    }
  } catch (err) {
    res.status(500).json({
      message: 'ERR',
      status: err.message,
    });
  }
}


exports.updateRating = async (req, res) => {
  try {
    const rating = await Ratings.findOneAndUpdate({
        ratingID: req.body.id,
    }, {
        $set: { ratingDict: req.body.ratingDict }
    }).exec();

    if(rating) {
        await calcRating.calculateRating(req.body.id);

        res.status(200).json({ status: 'OK' });
    }
    else {
        res.status(404).json({ status: 'ERR' });
    }
    } catch (err) {
        res.status(500).json({
            status: 'ERR',
            message: err.message
        });
    }
}