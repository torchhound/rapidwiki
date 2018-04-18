$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: '/api/categories',
		success: function(data) {
			for (var i = data.length - 1; i >= 0; i--) {
				$('#output').append($("<li><a href='/view/categories/" + data[i].category + "'>" + data[i].category + "</a>"));
			}
		}
	})
});