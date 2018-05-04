$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: '/api/files',
		success: function(data) {
			$('#output').empty();
			if (data.files === undefined || data.files == 0) {
				$('#output').append($("<li><b>No files on server</b>"));
			} else {
				for (var i = data.files.length - 1; i >= 0; i--) {
					$('#output').append($("<li><span>" + data.files[i] + "</span>" + 
						"<button class='btn btn-danger deleteButtons' id=" + data.files[i] + ">Delete File</button>"));
				}
			}
		}
	})
});

$(document).ready(function() {
	$('#output').on('click', '.deleteButtons', function() {
		$.ajax({
        	type: 'DELETE',
        	url: '/api/delete/file/' + event.target.id,
        	success: function(data){
        		location.reload();
        	}
    	});
	});	
});

$(document).ready(function() {
	$('#submitButton').click(function () {
		event.preventDefault();
		if (document.getElementById("file").files[0] === undefined || 
			document.getElementById("file").files[0].size <= 0) {
			$('#formWarning').show();
		} else {
			var fileData = new FormData();
			fileData.append('file', document.getElementById("file").files[0]);

			$.ajax({
	            type: 'POST',
	            url: '/api/file',
	            data: fileData,
	            cache: false,
	        	contentType: false,
	        	processData: false,
	            success: function(data){
	            	if (data.error === true) {
	            		$('#formResponseSpan').empty().append(data.files);
	                	$('#formResponse').show();
	            	} else {
	            		$('#formResponseSpan').empty().append(data.files);
	                	$('#formResponse').show();
	                	location.reload();
	            	}
	            }
	        });
		}
	});
});

$(document).ready(function() {
    $('#formWarning').hide();
    $('#formResponse').hide();
});

$(document).ready(function() {
	$('#closeWarning').on("click", function(){
		$('#formWarning').hide();
	});
	$('#closeResponse').on("click", function(){
		$('#formResponse').hide();
	});
});