$('.payment-method-card').click(function () {
  let dataForm = $(this).data('form');
  $('.payment-method-card').removeClass('active');
  $(this).addClass('active');
  $('form').addClass('d-none');
  $(`#${dataForm}-form`).removeClass('d-none');
});

// ---------------------------------------------------------------------
// FORM VALIDATION
// ---------------------------------------------------------------------
function errorParentPlacement(error, element) {
  $(error).appendTo($(element).parent());
}

function donwloadFile(form, event) {
  event.preventDefault();
  window.location = $(form).data('download');
}

$('#credit-card-form').validate({
  rules: {
    cardNumber: 'required',
    expMonth: 'required',
    expYear: 'required',
    cardProvider: 'required',
    cvv: 'required'
  },
  messages: {
    expMonth: 'This field is required',
    expYear: 'This filed is required',
    cardProvider: 'This field is required',
  },
  errorElement: 'p',
  errorPlacement: errorParentPlacement,
  submitHandler: donwloadFile
});

$('#easypay-form').validate({
  rules: {
    accountNumber: 'required',
    securityCode: 'required',
    password: 'required'
  },
  errorElement: 'p',
  submitHandler: () => console.log('DOWNLOAD')
});
