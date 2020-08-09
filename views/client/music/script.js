$('.resource-card').click(() => {
    $('.sidebar-dropdown').fadeIn(700);
    $('.sidebar').addClass('active');
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