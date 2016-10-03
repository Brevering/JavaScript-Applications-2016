var _ = require('lodash');

module.exports = function(db) {

  function get(req, res) {
    var categories = _.chain(db('items'))
      .map(function(item) {
        return item.category;
      }).uniq()
      .value();
    res.json({
      result: categories
    });
  }

  return {
    get: get
  };
};
