  const USER_ACCOUNT = JSON.parse(localStorage.getItem('userAccount'));
  $('#greeting-user-name').html(USER_ACCOUNT.username);

