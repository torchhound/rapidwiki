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
          for (var i = data.length - 1; i >= 0; i--) {
            $('#output').empty().append($("<li><a href='/view/page/" + data[i].title + "'>" + data[i].title + "</a>"));
          }
        },
        error: function(jqXHR, textStatus, errorThrown) { 
          if(jqXHR.status == 400) {  
            $('#output').empty().append($("<li><b>" + jqXHR.responseText + "</b>"));
          }
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