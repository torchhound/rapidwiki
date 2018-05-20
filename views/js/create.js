 $(document).ready(function() {
 	var form = $('#createForm');
	form.submit(function(event) {
		event.preventDefault();
        const maxChars = 80;
		var title = $('#title').val();
		var body = $('#body').val();
		var category = $('#category').val();
        title = $('<p>' + title + '</p>').text();
        category = $('<p>' + category + '</p>').text();
        if (title.length > maxChars) {
            title = title.substr(0, maxChars);
        } 
        if (category.length > maxChars) {
            category = category.substr(0, maxChars);
        }
        title = title.replace(/[^a-z0-9\s]+/gi, '');
        category = category.replace(/[^a-z0-9\s]+/gi, '');

		if (title === '' || body === '' || category === '') {
			$('#formWarning').show();
		} else {
			$.ajax({
            	type: 'POST',
            	url: '/api/create',
            	data: JSON.stringify({title: title, body: body, category: category}),
            	contentType: "application/json",
            	success: function(data) {
                    if (data.create === "") {
                        $('#formResponse').removeClass("alert-info").addClass("alert-danger");
                        $('#formResponseSpan').empty().append(data.error);
                        $('#formResponse').show();
                    } else {
                        $('#formResponse').removeClass("alert-danger").addClass("alert-info");
                        $('#formResponseSpan').empty().append(data.create);
                        $('#formResponse').show();
                        form.each(function(){
                            this.reset();
                        });
                    }
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