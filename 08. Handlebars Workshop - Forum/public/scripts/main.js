﻿import { data } from './data.js';
import { templateLoader as tl} from './template-loader.js';
import { router } from './routing.js';

$(() => { // on document ready
  const GLYPH_UP = 'glyphicon-chevron-up',
        GLYPH_DOWN = 'glyphicon-chevron-down',
        root = $('#root'),
        navbar = root.find('nav.navbar'),
        mainNav = navbar.find('#main-nav'),
        contentContainer = $('#root #content'),
        loginForm = $('#login'),
        logoutForm = $('#logout'),
        usernameSpan = $('#span-username'),
        usernameInput = $('#login input'),
        alertTemplate = $($('#alert-template').text());

        router.init();
        

  (function checkForLoggedUser() {
    data.users.current()
      .then((user) => {
        if (user) {
          usernameSpan.text(user);
          loginForm.addClass('hidden');
          logoutForm.removeClass('hidden');
        }
      });
  })();

  function showMsg(msg, type, cssClass, delay) {
    let container = alertTemplate.clone(true)
        .addClass(cssClass).text(`${type}: ${msg}`)
        .appendTo(root);

    setTimeout(() => {
      container.remove();
    }, delay || 2000)
  }

   navbar.on('click', 'li', (ev) => {
    let $target = $(ev.target);
    $target.parents('nav').find('li').removeClass('active');
    $target.parents('li').addClass('active');
  });

  contentContainer.on('click', '#btn-add-thread', (ev) => {

    let title = $(ev.target).parents('form').find('input#input-add-thread').val() || null;
    ev.preventDefault();
    data.threads.add(title)
      .then(() => {
            Promise.all([data.threads.get(), tl.get('threads')])                                            
            .then(([data, template]) => {                
                $('#content').html(template(data))})            
            .catch(console.log)
        })
      .then(showMsg('Successfuly added the new thread', 'Success', 'alert-success'))
      .catch((err) => showMsg(JSON.parse(err.responseText).err, 'Error', 'alert-danger'));
  })

  contentContainer.on('click', '.btn-add-message', (ev) => {
    ev.preventDefault();
    let $target = $(ev.target),
      $container = $target.parents('.container-messages'),
      thId = $container.attr('data-thread-id'),
      msg = $container.find('.input-add-message').val();

    data.threads.addMessage(thId, msg)
      .then((params) => {
            Promise.all([data.threads.getById(params.id), tl.get('messages')])                                            
            .then(([data, template]) => {
                $('#msg-container').remove();
                $('#container-thraeds').after(template(data))
                //$('#content').append(template(data))
              })            
            .catch(console.log)
        })      
      .then(showMsg('Successfuly added the new mssagee', 'Success', 'alert-success'))
      .catch((err) => showMsg(JSON.parse(err.responseText).err, 'Error', 'alert-danger'));
  })

  contentContainer.on('click', '.btn-close-msg', (ev) => {
    ev.preventDefault();
    let msgContainer = $(ev.target).parents('.container-messages').remove();
  });

  contentContainer.on('click', '.btn-collapse-msg', (ev) => {
    ev.preventDefault;
    let $target = $(ev.target);
    if ($target.hasClass(GLYPH_UP)) {
      $target.removeClass(GLYPH_UP).addClass(GLYPH_DOWN);
    } else {
      $target.removeClass(GLYPH_DOWN).addClass(GLYPH_UP);
    }

    $target.parents('.container-messages').find('.messages').toggle();
});
  // end threads  
  // start login/logout
  navbar.on('click', '#btn-login', (ev) => {
    let username = usernameInput.val() || 'anonymous';
    data.users.login(username)
      .then((user) => {
        usernameInput.val('')
        usernameSpan.text(user);
        loginForm.addClass('hidden');
        logoutForm.removeClass('hidden');
      })
  });
  navbar.on('click', '#btn-logout', (ev) => {
    data.users.logout()
    .then(() => {
      usernameSpan.text('');
      loginForm.removeClass('hidden');
      logoutForm.addClass('hidden');
    })
  });
  // end login/logout
});