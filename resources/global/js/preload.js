function handleCustomerUser(user) {
  let $usernameSpan = document.getElementById('username');
  let $loginButton = document.getElementById('open-login-btn');
  let $signOutBtn = document.getElementById('signOutbutton');
  $loginButton.classList.add('d-none');
  if (user.googleAccount === 'ye') {
    $usernameSpan.innerText = user.firstName;
  } else {
    $usernameSpan.innerText = user.username;
  }
  $usernameSpan.classList.remove('d-none');
  $signOutBtn.classList.remove('d-none');
}

function detectLoggedUser() {
  let userAccount = localStorage.getItem('userAccount');
  let type = userAccount && userAccount.type;
  if (type && type === 1) {
    window.location = '/management';
  } else if (type && type === 2) {
    handleCustomerUser(userAccount);
  }
}

detectLoggedUser();
