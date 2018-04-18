$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: '/api/recent',
		success: function(data) {
			for (var i = data.length - 1; i >= 0; i--) {
				$('#output').append($("<li><a href='/view/pages/" + data[i].title + "'>" + data[i].title + "</a>"));
			}
		}
	})
});