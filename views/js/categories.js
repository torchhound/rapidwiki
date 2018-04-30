$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: '/api/categories',
		success: function(data) {
			$('#output').empty();
			if (data[0].category === "") {
				$('#output').append($("<li><b>" + data[0].error + "</b>"));
			} else {
				for (var i = data.length - 1; i >= 0; i--) {
					$('#output').append($("<li><a href='/view/category/" + data[i].category + "'>" + data[i].category + "</a>"));
				}
			}
		}
	})
});