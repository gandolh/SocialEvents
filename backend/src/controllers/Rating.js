const Ratings = require('../models/Rating');

exports.getRating = async (req, res) => {
	try {
		const rating = await Ratings.findOne({
			ratingID: req.query.ratingId
		}).exec();
		res.status(200).json({
			status: 'OK',
			rating: rating
		});
	} catch (err) {
		res.status(500).json({
			status: 'ERR',
			message: err.message
		});
	}
};


exports.doRating = async (req, res) => {
	try {
		const existing = await Ratings.findOne({
			ratingID: req.body.ratingId,
		}).exec();
		if (existing) {
			const index = existing.ratings.findIndex((rating) => rating.email === req.body.email);
			if(index === -1){
				existing.ratings.push({
					email: req.body.email,
					rating: req.body.rating
				});
			}else{
				existing.ratings[index].rating = req.body.rating;
			}

			await existing.updateOne(existing);

			res.status(200).json({
				status: 'OK',
				rating: existing
			});
			return;
		} else {
			const newRating = new Ratings({
				ratingID: req.body.ratingId,
				ratings: [{
					email: req.body.email,
					rating: req.body.rating
				}],
			});
			await newRating.save();

			res.status(200).json({
				status: 'OK',
				rating: newRating
			});
			return;
		}
	} catch (err) {
		console.log(err)
		res.status(500).json({
			status: 'ERR',
			message: err.message
		});
	}
};

exports.deleteRating = async (req, res) => {
	try {
		const existing = await Ratings.findOne({
			ratingID: req.body.ratingId,
		}).exec();
		const newRatings = existing.ratings.filter((rating) => rating.email !== req.body.email);
		await existing.updateOne({ ratings: newRatings });
		res.status(200).json({
			status: 'OK'
		});
	} catch (err) {
		console.log(err)
		res.status(500).json({
			status: 'ERR',
			message: err.message
		});
	}
};


exports.createRating = async (req, res) => {
	try {
		const newRating = new Ratings({
			ratingID: req.body.ratingId,
			ratings: [],
		});
		await newRating.save();

		res.status(200).json({
			status: 'OK',
			rating: newRating
		});
	} catch (err) {
		console.log(err)
		res.status(500).json({
			status: 'ERR',
			message: err.message
		});
	}
}