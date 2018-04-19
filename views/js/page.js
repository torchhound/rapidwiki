$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: '/api/view/page/' + window.location.pathname.split("/").pop(),
		success: function(data) {
			var out = JSON.parse(data);
			$('#output').append($.parseHTML(out.html));
		}
	})
});