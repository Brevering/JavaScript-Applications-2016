var _ = require('lodash');
const PAGE_SIZE = 10,
  DEFAULT_ITEM_IMAGE = 'https://dayinthelifeofapurpleminion.files.wordpress.com/2014/12/batman-exam.jpg';


module.exports = function(db) {

  function getRandomItem() {
    var items = db('items').value();
    var index = Math.floor(Math.random() * items.length);
    return items[index];
  }

  function get(req, res) {
    var user = req.user;
    if (!user) {
      res.status(401)
        .json('User not authorized');
      return;
    }
    var myItem;

    if (user.myItems) {
      myItem = _.last(user.myItems);
      var now = new Date().getHours();
      var myItemTime = myItem.hours;
      if (myItemTime !== now) {
        myItem = getRandomItem();
      }
    } else {
      myItem = getRandomItem();
    }

    user.myItems = user.myItems || [];

    myItem.hours = new Date().getHours();
    user.myItems.push(myItem);

    db.save();

    res.json({
      result: _.last(user.myItems)
    });
  }

  return {
    get: get
  };
};
