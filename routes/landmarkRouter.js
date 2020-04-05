const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Landmarks = require('../models/landmarks');

const landmarkRouter = express.Router();

landmarkRouter.use(bodyParser.json());

landmarkRouter.route('/')
    .get((req, res, next) => {
        Landmarks.find({})
            .populate('comments.author')
            .then((landmarks) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(landmarks);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // dishRouter.route('/')
    //     .get((req, res, next) => {
    //         Dishes.find({})
    //             .then((dishes) => {
    //                 res.statusCode = 200;
    //                 res.setHeader('Content-Type', 'application/json');
    //                 res.json(dishes);
    //             }, (err) => next(err))
    //             .catch((err) => next(err));
    //     })
    // authenticate.verifyAdmin,
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Landmarks.create(req.body)
            .then((landmark) => {
                console.log('Landmark Created ', landmark);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(landmark);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    // authenticate.verifyAdmin,
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /landmarks');
    })
    // authenticate.verifyAdmin,
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Landmarks.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

landmarkRouter.route('/:landmarkId')
    .get((req, res, next) => {
        Landmark.findById(req.params.landmarkId)
            .populate('comments.author')
            .then((landmark) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(landmark);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // dishRouter.route('/:dishId')
    //     .get((req, res, next) => {
    //         Dishes.findById(req.params.dishId)
    //             .then((dish) => {
    //                 res.statusCode = 200;
    //                 res.setHeader('Content-Type', 'application/json');
    //                 res.json(dish);
    //             }, (err) => next(err))
    //             .catch((err) => next(err));
    //     })

    // authenticate.verifyAdmin,
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /landmarks/' + req.params.landmarkId);
    })

    // authenticate.verifyAdmin,
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Landmarks.findByIdAndUpdate(req.params.landmarkId, {
            $set: req.body
        }, { new: true })
            .then((landmark) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(landmark);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // authenticate.verifyAdmin,
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Landmarks.findByIdAndRemove(req.params.landmarkId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

landmarkRouter.route('/:landmarkId/comments')
    .get((req, res, next) => {
        Landmarks.findById(req.params.landmarkId)
            .populate('comments.author')
            .then((landmark) => {
                if (landmark != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(landmark.comments);
                }
                else {
                    err = new Error('Landmark ' + req.params.landmarkId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // dishRouter.route('/:dishId/comments')
    //     .get((req, res, next) => {
    //         Dishes.findById(req.params.dishId)
    //             .then((dish) => {
    //                 if (dish != null) {
    //                     res.statusCode = 200;
    //                     res.setHeader('Content-Type', 'application/json');
    //                     res.json(dish.comments);
    //                 }
    //                 else {
    //                     err = new Error('Dish ' + req.params.dishId + ' not found');
    //                     err.status = 404;
    //                     return next(err);
    //                 }
    //             }, (err) => next(err))
    //             .catch((err) => next(err));
    //     })

    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Landmarks.findById(req.params.landmarkId)
            .then((landmark) => {
                if (landmark != null) {
                    req.body.author = req.user._id;
                    landmark.comments.push(req.body);
                    landmark.save()
                        .then((landmark) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(landmark);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Landmark ' + req.params.landmarkId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // .post(authenticate.verifyUser, (req, res, next) => {
    //     Dishes.findById(req.params.dishId)
    //         .then((dish) => {
    //             if (dish != null) {
    //                 dish.comments.push(req.body);
    //                 dish.save()
    //                     .then((dish) => {
    //                         res.statusCode = 200;
    //                         res.setHeader('Content-Type', 'application/json');
    //                         res.json(dish);
    //                     }, (err) => next(err));
    //             }
    //             else {
    //                 err = new Error('Dish ' + req.params.dishId + ' not found');
    //                 err.status = 404;
    //                 return next(err);
    //             }
    //         }, (err) => next(err))
    //         .catch((err) => next(err));
    // })


    // END OF ADMIN BUILD ??

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /landmarks/'
            + req.params.landmarkId + '/comments');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Landmarks.findById(req.params.landmarkId)
            .then((landmark) => {
                if (landmark != null) {
                    for (var i = (landmark.comments.length - 1); i >= 0; i--) {
                        landmark.comments.id(landmark.comments[i]._id).remove();
                    }
                    landmark.save()
                        .then((landmark) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(landmark);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Landmark ' + req.params.landmarkId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

landmarkRouter.route('/:landmarkId/comments/:commentId')
    .get((req, res, next) => {
        Landmarks.findById(req.params.landmarkId)
            .populate('comments.author')
            .then((landmark) => {
                if (landmark != null && landmark.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(landmark.comments.id(req.params.commentId));
                }
                else if (landmarkId == null) {
                    err = new Error('Landmark ' + req.params.landmarkId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // dishRouter.route('/:dishId/comments/:commentId')
    //     .get((req, res, next) => {
    //         Dishes.findById(req.params.dishId)
    //             .then((dish) => {
    //                 if (dish != null && dish.comments.id(req.params.commentId) != null) {
    //                     res.statusCode = 200;
    //                     res.setHeader('Content-Type', 'application/json');
    //                     res.json(dish.comments.id(req.params.commentId));
    //                 }
    //                 else if (dish == null) {
    //                     err = new Error('Dish ' + req.params.dishId + ' not found');
    //                     err.status = 404;
    //                     return next(err);
    //                 }
    //                 else {
    //                     err = new Error('Comment ' + req.params.commentId + ' not found');
    //                     err.status = 404;
    //                     return next(err);
    //                 }
    //             }, (err) => next(err))
    //             .catch((err) => next(err));
    //     })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /landmarks/' + req.params.landmarkId
            + '/comments/' + req.params.commentId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Landmarks.findById(req.params.landmarkId)
            .then((landmark) => {
                if (landmark != null && landmark.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        landmark.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        landmark.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    landmark.save()
                        .then((landmark) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(landmark);
                        }, (err) => next(err));
                }
                else if (landmark == null) {
                    err = new Error('Landmark ' + req.params.landmarkId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Landmarks.findById(req.params.landmarkId)
            .then((landmark) => {
                if (landmark != null && landmark.comments.id(req.params.commentId) != null) {
                    landmark.comments.id(req.params.commentId).remove();
                    landmark.save()
                        .then((landmarkRouter) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(landmark);
                        }, (err) => next(err));
                }
                else if (landmark == null) {
                    err = new Error('Landmark ' + req.params.landmarkId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = landmarkRouter;