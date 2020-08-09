function authCustomer(data) {
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: '/customers/authenticate',
    data: JSON.stringify(data),
    success: (res) => {
      res.type = 2;
      localStorage.setItem('userAccount', JSON.stringify(res));
    },
    error: () => {
      $('#login-error').removeClass('d-none');
    }
  });
}

function createCustomer(data) {
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: '/customers',
    data: JSON.stringify(data),
    success: (res) => {
      let credetianls = {username: data.username, password: data.password};
      console.log(res);
      authCustomer(credetianls)
    },
    error: (res) => {
      $('#login-error').removeClass('d-none');
    }
  });
}

function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  let id = profile.getId();
  let email = profile.getEmail();
  let name = profile.getName();

  let accountData = {
    username: `G'${id}`,
    password: id,
    firstName: name,
    lastName: '',
    email: email,
    googleAccount: 'yes'
  };
  createCustomer(accountData);

  $.ajax({
    type: 'get',
    contentType: 'application/json',
    url: `/customers/check/G${id}`,
    statusCode: {
      404() {
        let accountData = {username: `G${id}`, password: id, firstName: name, lastName: '', email: email};
        createCustomer(accountData);
      },
      300() {
        let credentials = {username: `G${id}`, password: id};
        authCustomer(credentials);
      }
    }
  });
}



