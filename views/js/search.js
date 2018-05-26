$(document).ready(function() {
  var form = $('#searchForm');
  form.submit(function(event) {
    event.preventDefault();
    var search = $('#search').val();

    if (search === '') {
      $('#formWarning').show();
    } else {
      $.ajax({
        type: 'POST',
        url: '/api/search',
        data: JSON.stringify({
          search: search
        }),
        contentType: "application/json",
        success: function(data) {
          $('#output').empty();
          if (data[0].title === "") {
            $('#output').append($("<li><b>" + data[0].error + "</b>"));
          } else {
            for (var i = data.length - 1; i >= 0; i--) {
              $('#output').append($("<li><a href='/view/page/" + data[i].title + "'>" + data[i].title + "</a>"));
            }
          }
        },
        failure: function(jqXHR, textStatus, errorThrown) {
          $('formResponse').html('There has been a problem with your post operation: ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown).show();
        }
      });
    };
  });
});

$(document).ready(function() {
  $('#formWarning').hide();
});

$(document).ready(function() {
  $('#closeWarning').on("click", function() {
    $('#formWarning').hide();
  });
});