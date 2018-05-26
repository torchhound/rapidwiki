$(document).ready(function() {
  var form = $('#editForm');
  form.submit(function(event) {
    event.preventDefault();
    var body = $('#body').val();
    var category = $('#category').val();

    if (body === '' || category === '') {
      $('#formWarning').show();
    } else {
      $.ajax({
        type: 'PATCH',
        url: '/api/edit',
        data: JSON.stringify({
          title: window.location.pathname.split("/").pop(),
          body: body,
          category: category
        }),
        contentType: "application/json",
        success: function(data) {
          $('#formResponseSpan').empty().append(data.edit);
          $('#formResponse').show();
          location.reload();
        },
        failure: function(jqXHR, textStatus, errorThrown) {
          $('formResponse').html('There has been a problem with your post operation: ' +
            jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown).show();
        }
      });
    };
  });
});

$(document).ready(function() {
  $('#delete').click(function() {
    $.ajax({
      type: 'DELETE',
      url: '/api/delete/page/' + window.location.pathname.split("/").pop(),
      success: function(data) {
        window.location.href = '/create';
      }
    });
  });
});

$(document).ready(function() {
  $('#closeWarning').on("click", function() {
    $('#formWarning').hide();
  });
  $('#closeResponse').on("click", function() {
    $('#formResponse').hide();
  });
});