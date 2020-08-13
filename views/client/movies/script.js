(function ($) {
  $('.resource-card').click(function (){
    let card = $(this);
    $('#sidebar-artwork').css('background-image', `url("/movies/artworks/${card.data('id')}.jpg")`);
    $('#sidebar-title').text(card.data('title'));
    $('#sidebar-year').text(card.data('year'));
    $('#sidebar-language').text(card.data('language'));
    $('#sidebar-genre').text(card.data('genres'));
    $('#sidebar-cast').text(card.data('cast'));
    $('.sidebar-dropdown').fadeIn(700);
    $('.sidebar').addClass('active');
    $('#buy-button').prop('href', `/payment?type=movie&product=${card.data('id')}`);
  });

  $('.sidebar-dropdown').click(() => {
    $('.sidebar-dropdown').fadeOut(700);
    $('.sidebar').removeClass('active');
  });

  $('#select-year').change(function() {
    let selected = $(this).val();
    runNewUrl('releaseYear', selected);
  });

  $('#select-language').change(function() {
    let selected = $(this).val();
    runNewUrl('language', selected);
  });

  $('#select-artist').change(function() {
    let selected = $(this).val();
    runNewUrl('cast', selected);
  });

  $('#select-genre').change(function() {
    let selected = $(this).val();
    runNewUrl('genres', selected);
  });

  window.onload = () => {
    let param = window.location.search.substring(1);

    if(param !== ''){
      setValuesOnLoad('#select-year', '#select-year option', param);

      setValuesOnLoad('#select-language', '#select-language option', param);

      setValuesOnLoad('#select-artist', '#select-artist option', param);

      setValuesOnLoad('#select-genre', '#select-genre option', param);
    }else {
      console.log('No filter has been applied');
    }
  }
})(jQuery);
