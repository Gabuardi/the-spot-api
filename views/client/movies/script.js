(function ($) {
  // ------------------------------------------------------------
  // RESOURCE CARD CLICK EVENT
  $('.resource-card').click(function () {
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

  // ------------------------------------------------------------
  // SIDEBAR EXIT EVENT -----------------------------------------
  $('.sidebar-dropdown').click(() => {
    $('.sidebar-dropdown').fadeOut(700);
    $('.sidebar').removeClass('active');
  });

  // ------------------------------------------------------------
  // FILTERS  ---------------------------------------------------

  function buildFilterUrl(filterName, value) {
    let params = new URLSearchParams(window.location.search);
    if (params.has(filterName)) {
      params.set(filterName, value);
    } else {
      params.append(filterName, value);
    }
    return `${window.location.pathname}?${params.toString()}`;
  }


  function initializeFiltersEvents() {
    $('#search-title').keyup(function () {
      let search = $(this).val();
      $('#apply-filters').addClass('active');
      window.history.replaceState({}, '', buildFilterUrl('title', search));
    });

    $('#select-year').change(function () {
      let selectedValue = $(this).val();
      $('#apply-filters').addClass('active');
      window.history.replaceState({}, '', buildFilterUrl('releaseYear', selectedValue));
    });

    $('#select-language').change(function () {
      let selectedValue = $(this).val();
      $('#apply-filters').addClass('active');
      window.history.replaceState({}, '', buildFilterUrl('language', selectedValue));
    });

    $('#select-artist').change(function () {
      let selectedValue = $(this).val();
      $('#apply-filters').addClass('active');
      window.history.replaceState({}, '', buildFilterUrl('cast', selectedValue));
    });

    $('#select-genre').change(function () {
      let selectedValue = $(this).val();
      $('#apply-filters').addClass('active');
      window.history.replaceState({}, '', buildFilterUrl('genres', selectedValue));
    });
  }


  // ------------------------------------------------------------
  // FILL VALUES  ------------------------------------------------
  let params = new URLSearchParams(window.location.search);
  $('#search-title').val(params.get('title'));
  $('#select-year').val(params.get('releaseYear'));
  $('#select-language').val(params.get('language'));
  $('#select-artist').val(params.get('cast') && params.get('cast').split(','));
  $('#select-genre').val(params.get('genres') && params.get('genres').split(','));

  // ------------------------------------------------------------
  // INITIALIZER  ------------------------------------------------

  initializeFiltersEvents();
  $('#apply-filters').click(() => window.location.reload());


  // $('#select-artist').change(function() {
  //   let selected = $(this).val();
  //   runNewUrl('cast', selected);
  // });
  //
  // $('#select-genre').change(function() {
  //   let selected = $(this).val();
  //   runNewUrl('genres', selected);
  // });
  //
  // window.onload = () => {
  //   let param = window.location.search.substring(1);
  //
  //   if(param !== ''){
  //     setValuesOnLoad('#select-year', '#select-year option', param);
  //
  //     setValuesOnLoad('#select-language', '#select-language option', param);
  //
  //     setValuesOnLoad('#select-artist', '#select-artist option', param);
  //
  //     setValuesOnLoad('#select-genre', '#select-genre option', param);
  //   }else {
  //     console.log('No filter has been applied');
  //   }
  // }


})(jQuery);
