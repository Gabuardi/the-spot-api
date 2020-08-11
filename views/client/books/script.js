(function ($){
    $('.resource-card').click(function (){
        let card = $(this);
        $('#sidebar-artwork').css('background-image', `url("/books/artworks/${card.data('id')}.jpg")`);
        $('#sidebar-title').text(card.data('title'));
        $('#sidebar-author').text(card.data('author'));
        $('#sidebar-genre').text(card.data('genres'));
        $('#sidebar-editorial').text(card.data('editorial'));
        $('#sidebar-year').text(card.data('year'));
        $('#sidebar-language').text(card.data('language'));
        $('.sidebar-dropdown').fadeIn(700);
        $('.sidebar').addClass('active');
        $('#buy-button').prop('href', `/payment?type=book&product=${card.data('id')}`);
    });

    $('.sidebar-dropdown').click(() => {
        $('.sidebar-dropdown').fadeOut(700);
        $('.sidebar').removeClass('active');
    });

    $('#select-artist').change(function() {
        let selected = $(this).val();
        runNewUrl('artist', selected);
    });

    $('#select-genre').change(function() {
        let selected = $(this).val();
        runNewUrl('genres', selected);
    });

    $('#select-editorial').change(function() {
        let selected = $(this).val();
        runNewUrl('editorial', selected);
    });

    $('#select-year').change(function() {
        let selected = $(this).val();
        runNewUrl('releaseYear', selected);
    });

    $('#select-language').change(function() {
        let selected = $(this).val();
        runNewUrl('language', selected);
    });
})(jQuery);