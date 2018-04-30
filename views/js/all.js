$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: '/api/all',
		success: function(data) {
			$('#output').empty();
			if (data[0].title === "") {
				$('#output').append($("<li><b>" + data[0].error + "</b>"));
			} else {
				for (var i = data.length - 1; i >= 0; i--) {
					$('#output').append($("<li><a href='/view/page/" + data[i].title + "'>" + data[i].title + "</a>"));
				}
			}
		}
	})
});