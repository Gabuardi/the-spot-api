$('.payment-method-card').click(function () {
  let dataForm = $(this).data('form');
  $('.payment-method-card').removeClass('active');
  $(this).addClass('active');
  $('form').addClass('d-none');
  $(`#${dataForm}-form`).removeClass('d-none');
});
