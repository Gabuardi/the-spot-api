(function ($) {
  /* ..............................................
    LOGIN MODAL
    ................................................. */
  (function () {
    const $logInOption = $('#login-option');
    const $signInOption = $('#signin-option');
    const $logInForm = $('#login-form');
    const $signInForm = $('#signin-form');

    $('#open-login-btn').click(() => {
      $('#login-modal').modal('show');
    });

    $logInOption.click(() => {
      $signInOption.removeClass('active');
      $logInOption.addClass('active');
      $signInForm.addClass('d-none');
      $logInForm.removeClass('d-none');
    });

    $signInOption.click(() => {
      $logInOption.removeClass('active');
      $signInOption.addClass('active');
      $logInForm.addClass('d-none');
      $signInForm.removeClass('d-none');
    });

    const $userTypeSwitch = $('#user-type-switch');
    const $userTypeInput = $userTypeSwitch.children('input');

    $userTypeSwitch.click((e) => {
      e.stopPropagation();
      let inputChecked = $userTypeInput.prop('checked');
      $userTypeInput.prop('checked', !inputChecked);
      inputChecked ? $signInOption.show() : $signInOption.hide();
    });
  })();

  /* ..............................................
  LOGIN MODAL VALIDATION
  ................................................. */
  (function () {
    function authStaff(data) {
      $.ajax({
        type: 'POST',
        crossDomain: true,
        contentType: 'application/json',
        url: 'http://localhost:3000/staff/authenticate',
        data: data,
        success: (res) => {
          res.type = 1;
          localStorage.setItem('userAccount', JSON.stringify(res));
          window.location = '../../management/home/index.html';
        },
        error: (res) => {
          $('#login-error').removeClass('d-none');
        }
      });
    }

    function authCustomer(data) {
      $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/customers/authenticate',
        data: data,
        success: (res) => {
          res.type = 2;
          localStorage.setItem('userAccount', JSON.stringify(res));
          let $usernameSpan = $('#username');
          $('#open-login-btn').addClass('d-none');
          $usernameSpan.text(res.username);
          $usernameSpan.show();
          $usernameSpan.removeClass('d-none');
          $('#signOutbutton').removeClass('d-none');
          $('#login-modal').modal('hide');
        },
        error: (res) => {
          $('#login-error').removeClass('d-none');
        }
      });
    }

    $('#login-form').validate({
      rules: {
        username: {
          required: true
        },
        password: {
          required: true
        },
      },
      errorElement: 'p',
      submitHandler: () => {
        let username = $('input[name="username"]').val();
        let password = $('input[name="password"]').val();
        const data = JSON.stringify({username: username, password: password});

        $('#login-error').addClass('d-none');
        if ($('input[name="isStaff"]').prop('checked')) {
          authStaff(data);
        } else {
          authCustomer(data);
        }
      }
    });
  })();

  /* ..............................................
    SIGN IN MODAL VALIDATION
    ................................................. */


}(jQuery));

/* ..............................................
  Filter Url Params Manipulation
  ................................................. */
function ifEmpty(param, type, value) {
  if (param === '') {
    value = `?${type}=${value}`;
    return value;
  } else {
    value = `&${type}=${value}`;
    return value;
  }
  ;
};

function ifDuplicate() {
  let params = window.location.search;
  params.cont
};

function runNewUrl(type, value) {
  let newUrl = window.location.href;
  newUrl += `${ifEmpty(window.location.search, type, value)}`;
  window.location.href = newUrl;
}

/* ..............................................
  SIGN OUT BUTTON
................................................. */
function signOut() {
  localStorage.removeItem('userAccount');
  window.location.reload();
}

function signOutGoogle() {
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then();
}

$('#signOutbutton').click(() => {
  let user = JSON.parse(localStorage.getItem('userAccount'));
  if (user && user.type === 2 && user.googleAccount === 'ye') {
    signOutGoogle();
  }
  signOut();
});
