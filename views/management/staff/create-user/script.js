const $passwordInput = $('[name="password"]');

$passwordInput.tooltip({
  placement: "right",
  title: "COPIED!",
  trigger: "focus",
  delay: 100
});


$passwordInput.click(() => {
  $passwordInput.tooltip('show');
  setTimeout(() => $passwordInput.tooltip('hide'), 1200);
});
