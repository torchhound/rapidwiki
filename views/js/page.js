$(document).ready(function() {
	document.title = window.location.pathname.split("/").pop();
	$.ajax({
		type: 'GET',
		url: '/api/view/page/' + window.location.pathname.split("/").pop(),
		success: function(data) {
			$('#output').empty().append($.parseHTML(data.html));
			$('#title').empty().val(data.raw.title);
			$('#body').empty().val(data.raw.body);
			$('#category').empty().val(data.raw.category);
		}
	})
});

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
            	type: 'POST',
            	url: '/api/edit',
            	data: JSON.stringify({title: window.location.pathname.split("/").pop(), body: body, category: category}),
            	contentType : "application/json",
            	success: function(data){
                	$('#formResponseSpan').empty().append(data.edit);
                    $('#formResponse').show();
					location.reload();
            	},
            	failure: function(jqXHR, textStatus, errorThrown){
                	$('formResponse').html('There has been a problem with your post operation: ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown).show();
            	}
        	});
		};
	});
});

 $(document).ready(function() {
    $('#closeWarning').on("click", function(){
        $('#formWarning').hide();
    });
    $('#closeResponse').on("click", function(){
        $('#formResponse').hide();
    });
 });