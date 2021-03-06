'use strict';

const Gallery = require('../model/gallery');
const errorHandler = require('../lib/error-handler');
const debug = require('debug')('cfgram:route-gallery');
const bearerAuth = require('../lib/bearer-auth-middleware');

module.exports = function(router) {
  router.post('/api/gallery', bearerAuth, (req, res) => {
    debug('POST /api/gallery');

    req.body.userId = req.user._id;

    return new Gallery(req.body).save()
      .then(gallery => res.status(201).json(gallery))
      .catch(err => errorHandler(err, req, res));
  });

  // need to use bearerAuth in all of the other commands

  router.get('/api/gallery/:_id', bearerAuth, (req, res) => {
    debug('GET /api/gallery/:_id');

    return Gallery.findById(req.params._id)
      .then(gallery => res.json(gallery))
      .catch(err => errorHandler(err, req, res));
  });

  router.get('/api/gallery', bearerAuth, (req, res) => {
    debug('GETALL /api/gallery');

    return Gallery.find()
      .then(gallery => res.json(gallery.map(gallery => gallery._id)))
      .catch(err => errorHandler(err, req, res));
  });
  // need to finish
  router.put('/api/gallery', bearerAuth, (req, res) => {
    debug('PUT /api/gallery');

    Gallery.findByIdAndUpdate(req.params._id, req.body, { upsert:true, runValidators:true})
      .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));
  });

  router.delete('/api/gallery/:_id', bearerAuth, (req, res) => {
    debug('DELETE /api/gallery');

    return Gallery.findByIdAndRemove(req.params._id)
      .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));
  });
};
