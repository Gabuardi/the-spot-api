$('#artwork-file-input').change(function () {
  let formData = new FormData;
  formData.append('artworkFile', this.files[0]);
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/movies/upload/temp/artwork',
    data: formData,
    processData: false,
    contentType: false,
    success() {
      console.log('ASD');
      $('[for="artwork-file-input"]').css('background-image', 'url("http://localhost:3000/movies/artworks/temp.jpg")')
    },
    error() {
      console.error('ERROR');
    }
  });
});

$('#movie-file-input').change(function () {
  if (this.files.length !== 0) {
    let uploadedFileName = this.files[0].name;
    $('#uploaded-file-name').text(uploadedFileName);
  }
});

$('#new-movie-form').validate({
  rules: {
    title: "required",
    year: "required",
    language: "required",
    cast: "required",
    genres: "required",
    movieFile: "required",
    artworkFile: "required"
  },
  errorElement: 'p',
  submitHandler(form, event) {
    let formData = new FormData(form);
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/movies',
      data: formData,
      processData: false,
      contentType: false,
      // success(response) {
      //   console.log(response);
      // }
    });
  }
});
