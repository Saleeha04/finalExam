const express = require('express');
const mongoose = require('mongoose');
const Attraction = require('./models/attraction');
const Visitor = require('./models/visitor');
const Review = require('./models/review');

const router = express.Router();

// Route to add a new attraction
router.post('/attractions', async (req, res) => {
    const { name, location, entryFee, rating } = req.body;
    if (entryFee < 0) return res.status(400).send({ error: 'Entry fee must be non-negative.' });

    try {
        const attraction = new Attraction({ name, location, entryFee, rating });
        await attraction.save();
        res.status(201).send(attraction);
    } catch (err) {
        res.status(400).send(err);
    }
});

// CRUD Routes for Attractions
router.get('/attractions', async (req, res) => {
    try {
        const attractions = await Attraction.find();
        res.status(200).send(attractions);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/attractions/:id', async (req, res) => {
    try {
        const attraction = await Attraction.findById(req.params.id);
        if (!attraction) return res.status(404).send({ error: 'Attraction not found.' });
        res.status(200).send(attraction);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/attractions/:id', async (req, res) => {
    const { entryFee } = req.body;
    if (entryFee < 0) return res.status(400).send({ error: 'Entry fee must be non-negative.' });

    try {
        const attraction = await Attraction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!attraction) return res.status(404).send({ error: 'Attraction not found.' });
        res.status(200).send(attraction);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/attractions/:id', async (req, res) => {
    try {
        const attraction = await Attraction.findByIdAndDelete(req.params.id);
        if (!attraction) return res.status(404).send({ error: 'Attraction not found.' });
        res.status(200).send({ message: 'Attraction deleted successfully.' });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to add a new visitor
router.post('/visitors', async (req, res) => {
    const { name, email } = req.body;

    try {
        const visitor = new Visitor({ name, email });
        await visitor.save();
        res.status(201).send(visitor);
    } catch (err) {
        res.status(400).send(err);
    }
});

// CRUD Routes for Visitors
router.get('/visitors', async (req, res) => {
    try {
        const visitors = await Visitor.find().populate('visitedAttractions');
        res.status(200).send(visitors);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/visitors/:id', async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id).populate('visitedAttractions');
        if (!visitor) return res.status(404).send({ error: 'Visitor not found.' });
        res.status(200).send(visitor);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/visitors/:id', async (req, res) => {
    try {
        const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!visitor) return res.status(404).send({ error: 'Visitor not found.' });
        res.status(200).send(visitor);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/visitors/:id', async (req, res) => {
    try {
        const visitor = await Visitor.findByIdAndDelete(req.params.id);
        if (!visitor) return res.status(404).send({ error: 'Visitor not found.' });
        res.status(200).send({ message: 'Visitor deleted successfully.' });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to post a new review for an attraction by a specific user
router.post('/reviews', async (req, res) => {
    const { attractionId, visitorId, score, comment } = req.body;

    if (score < 1 || score > 5) return res.status(400).send({ error: 'Score must be between 1 and 5.' });

    try {
        const attraction = await Attraction.findById(attractionId);
        const visitor = await Visitor.findById(visitorId).populate('visitedAttractions');

        if (!attraction) return res.status(404).send({ error: 'Attraction not found.' });
        if (!visitor) return res.status(404).send({ error: 'Visitor not found.' });

        const hasVisited = visitor.visitedAttractions.some(attraction => attraction.equals(attractionId));
        if (!hasVisited) return res.status(400).send({ error: 'Visitor must have visited the attraction to post a review.' });

        const existingReview = await Review.findOne({ attraction: attractionId, visitor: visitorId });
        if (existingReview) return res.status(400).send({ error: 'Visitor has already reviewed this attraction.' });

        const review = new Review({ attraction: attractionId, visitor: visitorId, score, comment });
        await review.save();

        // Update the attraction rating
        const reviews = await Review.find({ attraction: attractionId });
        const averageRating = reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length;
        attraction.rating = averageRating;
        await attraction.save();

        res.status(201).send(review);
    } catch (err) {
        res.status(400).send(err);
    }
});

// CRUD Routes for Reviews
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().populate('attraction visitor');
        res.status(200).send(reviews);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/reviews/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('attraction visitor');
        if (!review) return res.status(404).send({ error: 'Review not found.' });
        res.status(200).send(review);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/reviews/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!review) return res.status(404).send({ error: 'Review not found.' });
        res.status(200).send(review);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/reviews/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).send({ error: 'Review not found.' });
        res.status(200).send({ message: 'Review deleted successfully.' });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to get top 5 attractions based on rating
router.get('/attractions/top-rated', async (req, res) => {
    try {
        const topAttractions = await Attraction.find().sort({ rating: -1 }).limit(5);
        res.status(200).send(topAttractions);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to get visitor activity
router.get('/visitors/activity', async (req, res) => {
    try {
        const visitors = await Visitor.find().populate('visitedAttractions');
        const activity = await Promise.all(
            visitors.map(async (visitor) => {
                const reviews = await Review.find({ visitor: visitor._id });
                const averageScore =
                    reviews.length > 0
                        ? reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length
                        : 0;

                return {
                    name: visitor.name,
                    email: visitor.email,
                    attractionsVisited: visitor.visitedAttractions.length,
                    averageReviewScore: averageScore,
                };
            })
        );
        res.status(200).send(activity);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
