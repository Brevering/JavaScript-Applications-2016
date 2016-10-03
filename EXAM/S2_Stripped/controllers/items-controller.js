var _ = require('lodash');
const PAGE_SIZE = 10,
  DEFAULT_ITEM_IMAGE = 'https://dayinthelifeofapurpleminion.files.wordpress.com/2014/12/batman-exam.jpg';

module.exports = function(db) {

  function _validate(item) {

  }

  function get(req, res) {
    var items = _.chain(db('items'))
      .sortBy(function(item) {
        return -item.likes || (item.postDate - 0);
      });

    res.json({
      result: items
    });
  }

  function post(req, res) {
    var user = req.user;
    if (!user) {
      res.status(401)
        .json('User not authorized');
      return;
    }
    var item = req.body;
    var validationError = _validate(item);
    if (validationError) {
      res.status(400)
        .json(validationError.message);
      return;
    }
    item.userId = user.id;
    item.likes = 0;
    item.dislikes = 0;
    item.img = item.img || DEFAULT_ITEM_IMAGE;
    item.shareDate = new Date();
    db('items').insert(item);
    res.json({
      result: item
    });
  }

  function put(req, res) {
    var user = req.user;
    if (!user) {
      res.status(401)
        .json('User not authorized');
      return;
    }

    var itemId = req.params.id;
    var item = db('items').find({
      id: itemId
    });

    if (!item) {
      res.status(404)
        .json('Invalid item ID');
      return;
    }
    var type = req.body.type;
    if (['like', 'dislike'].indexOf(type) < 0) {
      res.status(400)
        .json('Request type must be either "like" or "dislike"');
      return;
    }

    if (req.body.type === 'like') {
      item.likes += 1;
    } else {
      item.dislikes += 1;
    }
    db.save();

    res.json({
      result: item
    });
  }

  return {
    get: get,
    post: post,
    put: put
  };
};
