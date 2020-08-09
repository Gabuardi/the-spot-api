$('.resource-card').click(() => {
  $('.sidebar-dropdown').fadeIn(700);
  $('.sidebar').addClass('active');
});


$('.sidebar-dropdown').click(() => {
  $('.sidebar-dropdown').fadeOut(700);
  $('.sidebar').removeClass('active');
});

$('#select-year').change(function() {
  let selected = $(this).val();
  runNewUrl('releaseYear', selected);
});
