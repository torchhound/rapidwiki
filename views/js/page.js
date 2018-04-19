$(document).ready(function() {
	document.title = window.location.pathname.split("/").pop();
	$.ajax({
		type: 'GET',
		url: '/api/view/page/' + window.location.pathname.split("/").pop(),
		success: function(data) {
			$('#output').empty();
			$('#output').append($.parseHTML(data.html));
		}
	})
});