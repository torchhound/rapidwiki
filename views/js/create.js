 $(document).ready(function() {
 	var form = $('#createForm');
	form.submit(function(event) {
		event.preventDefault();
		var title = $('#title').val();
		var body = $('#body').val();
		var category = $('#category').val();

		if (title === '' || body === '' || category === '') {
			$('#formWarning').show();
		} else {
			$.ajax({
            	type: 'POST',
            	url: '/api/create',
            	data: JSON.stringify({title: title, body: body, category: category}),
            	contentType : "application/json",
            	success: function(data){
                	$('#formResponse').append(data.create).show();
                	form.each(function(){
    					this.reset();
					});
            	},
            	failure: function(jqXHR, textStatus, errorThrown){
                	$('formResponse').html('There has been a problem with your post operation: ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown).show();
            	}
        	});
		};
	});
});

$(document).ready(function() {
    $('#formWarning').hide();
    $('formResponse').hide();
});

 $(document).ready(function() {
    $('#closeWarning').on("click", function(){
        $('#formWarning').hide();
    });
    $('#closeResponse').on("click", function(){
        $('#formResponse').hide();
    });
 });