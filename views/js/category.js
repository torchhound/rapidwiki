$(document).ready(function() {
  document.title = window.location.pathname.split("/").pop();
  $.ajax({
    type: 'GET',
    url: '/api/view/category/' + window.location.pathname.split("/").pop(),
    success: function(data) {
      $('#output').empty();
      for (var i = data.length - 1; i >= 0; i--) {
        $('#output').append($("<li><a href='/view/page/" + data[i].title + "'>" + data[i].title + "</a>"));
      }
    }
  })
});