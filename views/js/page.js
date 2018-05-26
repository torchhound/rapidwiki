$(document).ready(function() {
  document.title = window.location.pathname.split("/").pop();
  $.ajax({
    type: 'GET',
    url: '/api/view/page/' + window.location.pathname.split("/").pop(),
    success: function(data) {
      if (data.empty === "true") {
        document.title = 'Not Found';
        $('#edit').hide();
        $('#history').hide();
        prepareEditForm(data);
      } else {
        $('#edit').show();
        $('#history').show();
        prepareEditForm(data);
      }
    }
  })
});

function prepareEditForm(data) {
  $('#output').empty().append($.parseHTML(data.html));
  $('#historyOutput').empty();
  for (var i = data.diff.length - 1; i >= 0; i--) {
    $('#historyOutput').append($("<li><div class='row card'><div class='col-md-12 card-body'><b>" + data.diff[i].hash +
      "</b><p>" + data.diff[i].difference + "</p><p><b>Category: </b>" + data.diff[i].category + "</p><p></p><p><b>Edited: </b>" +
      data.diff[i].timestamp + "</p></div></div>"));
  }
  $('#title').empty().val(data.raw.title);
  $('#body').empty().val(data.raw.body);
  $('#category').empty().val(data.raw.category);
}

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