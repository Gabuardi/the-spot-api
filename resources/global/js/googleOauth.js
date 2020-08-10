function authCustomer(data) {
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: '/customers/authenticate',
    data: JSON.stringify(data),
    success: (res) => {
      res.type = 2;
      localStorage.setItem('userAccount', JSON.stringify(res));
      $('#open-login-btn').addClass('d-none');
      let $usernameSpan = $('#username');
      $usernameSpan.text(res.firstName);
      $usernameSpan.removeClass('d-none');
      $('#signOutbutton').removeClass('d-none');
      $('#login-modal').modal('hide');
    },
    error: () => {
      $('#login-error').removeClass('d-none');
    }
  });
}

function createCustomer(data) {
  let credetianls = {username: data.username, password: data.password};
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: '/customers',
    data: JSON.stringify(data),
    success: (res) => {
      authCustomer(credetianls);
    },
    error: (res) => {
      authCustomer(credetianls);
    }
  });
}

function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  let id = profile.getId();
  let email = profile.getEmail();
  let name = profile.getName();
  let userToken = parseInt(id).toString(36);

  let accountData = {
    username: `G${userToken}`,
    password: userToken,
    firstName: name,
    lastName: '',
    email: email,
    googleAccount: 'yes'
  };

  createCustomer(accountData);
}



