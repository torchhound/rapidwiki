$(document).ready(function() {
  $.ajax({
    type: 'GET',
    url: '/api/categories',
    success: function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        $('#output').empty().append($("<li><a href='/view/category/" + data[i].category + "'>" + data[i].category + "</a>"));
      }
    },
    error: function(jqXHR, textStatus, errorThrown) { 
      if(jqXHR.status == 400) {  
        $('#output').empty().append($("<li><b>" + jqXHR.responseText + "</b>"));
      }
    }
  })
});