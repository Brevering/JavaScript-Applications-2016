var controllers = controllers || {};
(function(scope) {

  function all(context) {
    if (!data.users.hasUser()) {
      toastr.warning('User not logged in, redirecting to sign up form...');
      setTimeout(function() {
        toastr.clear();
        context.redirect('#/sign-up');
      }, 1000);
      return;
    }
    var myItem;
    data.myItems.get()
      .then(function(resMyItem) {
        myItem = resMyItem;
        return templates.get('my-item');
      }).then(function(template) {
        context.$element().html(template(myItem));
        $('.btn.btn-success').on('click', function() {
          var $this = $(this),
            itemId = $this.parents('.item-box').attr('data-id');
          data.items.like(itemId)
            .then(function(item) {
              $this.parents('.item-box').find('.likes').html(item.likes);
              toastr.clear();
              toastr.success('Item liked!');
            });
        });
        $('.btn.btn-danger').on('click', function() {
          var $this = $(this),
            itemId = $this.parents('.item-box').attr('data-id');
          data.items.dislike(itemId)
            .then(function(item) {
              toastr.clear();
              toastr.error('Item disliked!');
              $this.parents('.item-box').find('.dislikes').html(item.dislikes);
            });
        });
      });
  }

  scope.myItem = {
    all: all,
  };
}(controllers));
