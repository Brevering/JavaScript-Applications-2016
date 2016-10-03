var controllers = controllers || {};
(function(scope) {

  function all(context) {
    var sortby = context.params.sortby || 'date',
      category = context.params.category || null,
      user = context.params.user || null;

    var items,
      users,
      promise;
    if (data.users.hasUser()) {
      promise = data.users.get()
        .then(function(resUsers) {
          users = resUsers;
          return data.items.get();
        });
    } else {
      promise = data.items.get();
    }
    promise.then(function(resItems) {
        items = resItems;
        if (category) {
          items = items.filter(function(item) {
            return item.category.toLowerCase() === category.toLowerCase();
          });
        }

        items.sort(function(c1, c2) {
          if (sortby === 'date') {
            return (new Date(c2.shareDate)) - (new Date(c1.shareDate));
          }
          return c2.likes - c1.likes;
        });
        items = items.map(function(item) {
          item.timePast = moment(item.shareDate).fromNow();
          item.shareDate = moment(item.shareDate).format('Do MMM YYYY, hh:mm');
          if (users) {
            item.user = users.find(function(user) {
              return user.id === item.userId;
            });
          }
          return item;
        });

        if (user) {
          items = items.filter(function(item) {
            return item.user.username.toLowerCase() === user.toLowerCase();
          });
        }

        return templates.get('items');
      })
      .then(function(template) {
        context.$element().html(template(items));

        $('.btn-like-dislike').on('click', function() {
          if (!data.users.hasUser()) {
            toastr.warning('User is not logged in, redirecting to login page...');
            setTimeout(function() {
              context.redirect('#/register');
            }, 1000);
          }
          var $this = $(this),
            itemId = $this.parents('.item-box').attr('data-id'),
            type = $this.attr('data-type'),
            promise;
          if (type === 'like') {
            promise = data.items.like(itemId);
          } else {
            promise = data.items.dislike(itemId);
          }
          promise.then(function(item) {
            $this.parents('.item-box').find(`.${type}s`).html(item[`${type}s`]);
            toastr.clear();
            toastr.success(`Item ${type}d!`);
          });
        });

        $('.btn-share').on('click', function() {
          var $this = $(this),
            $itemBox = $this.parents('.item-box');
          var item = {
            text: $itemBox.find('.text').html().trim(),
            category: $itemBox.find('.category').html().trim(),
            img: $itemBox.find('img').attr('src')
          };
          data.items.add(item)
            .then(function(item) {
              toastr.success(`Item "${item.text}" reshared!`);
              setTimeout(function() {
                document.location = '#/';
              }, 1000);
            });
        });

        $('.tb-filter').on('input', function() {
          var pattern = $(this).val().toLowerCase(),
            selector = '.' + $(this).attr('data-type');
          $('.item-box')
            .each(function(index, itemBox) {
              var $itemBox = $(itemBox),
                value = $itemBox.find(selector).html().trim().toLowerCase();
              if (value.indexOf(pattern) >= 0) {
                $itemBox.removeClass('hide');
              } else {
                $itemBox.addClass('hide');
              }
            });
        });
      });
  }

  function add(context) {
    if (!data.users.hasUser()) {
      if (!data.users.hasUser()) {
        toastr.warning('User not logged in, redirecting to sign up form...');
        setTimeout(function() {
          toastr.clear();
          context.redirect('#/sign-up');
        }, 1000);
      }
    }
    templates.get('item-add')
      .then(function(template) {
        context.$element().html(template());
        return data.categories.get();
      })
      .then(function(categories) {

        //load categories autocomplete
        $('#tb-item-category').autocomplete({
          source: categories
        });

        //handle image preview
        $('#tb-item-img').on('input', function() {
          var url = $(this).val();
          $('#item-img-preview').attr('src', url);
        });

        //attach add item event
        $('#btn-add-item').on('click', function() {
          var item = {
            text: $('#tb-item-text').val(),
            category: $('#tb-item-category').val(),
            img: $('#tb-item-img').val()
          };
          data.items.add(item)
            .then(function(item) {
              toastr.success(`Item "${item.text}" addded!`);
              setTimeout(function() {
                document.location = '#/home';
              }, 1000);
            }, function(err) {
              toastr.error(err);
            });
        });
      });
  }

  scope.home = {
    all: all,
    add: add
  };
}(controllers));
