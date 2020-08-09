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