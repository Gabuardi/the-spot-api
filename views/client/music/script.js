(function(){
    $('.resource-card').click(function (){
        let card = $(this);
            $('#sidebar-artwork').css('background-image', `url("/music/artworks/${card.data('id')}.jpg")`);
            $('#sidebar-title').text(card.data('title'));
            $('#sidebar-artist').text(card.data('artist'));
            $('#sidebar-genre').text(card.data('genres'));
            $('#sidebar-album').text(card.data('album'));
            $('#sidebar-year').text(card.data('year'));
            $('#sidebar-record-label').text(card.data('recordlabel'));
            $('.sidebar-dropdown').fadeIn(700);
            $('.sidebar').addClass('active');
            $('#buy-button').prop('href', `/payment?type=song&product=${card.data('id')}`);
    });
    
    $('.sidebar-dropdown').click(() => {
        $('.sidebar-dropdown').fadeOut(700);
        $('.sidebar').removeClass('active');
    });

    $('#select-artist').change(function() {
        let selected = $(this).val();
        runNewUrl('artists', selected);
    });

    $('#select-genre').change(function() {
        let selected = $(this).val();
        runNewUrl('genres', selected);
    });

    $('#select-album').change(function() {
        let selected = $(this).val();
        runNewUrl('album', selected);
    });

    $('#select-record-label').change(function() {
        let selected = $(this).val();
        runNewUrl('recordLabel', selected);
    });

    $('#select-year').change(function() {
        let selected = $(this).val();
        runNewUrl('releaseYear', selected);
    });
})(jQuery)