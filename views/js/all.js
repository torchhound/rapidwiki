$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: '/api/all',
		success: function(data) {
			//var jsonResponse = JSON.parse(data);
			for (var i = data.length - 1; i >= 0; i--) {
				$('#output').append($('<li>').text(data[i].title + '\n' + data[i].body + '\n'));
			}
		}
	})
});