$(document).ready(function() {
  $('#loginButton').click(function() {
    var username = $('#inputEmail').val();
    var password = $('#inputPassword').val();

    if (username === '' || password === '') {
      $('#formWarning').empty().append('Email or Password field empty').show();
    } else {
      $.ajax({
        type: 'POST',
        url: '/api/auth/login',
        data: JSON.stringify({
          username: username,
          password: password
        }),
        contentType: "application/json",
        success: function(data) {
          if (data.login === true) {
            window.location.href = "/create";
          }
        },
        error: function(jqXHR, textStatus, errorThrown) { 
          if(jqXHR.status == 400 && jqXHR.responseJSON.login === false) {  
            window.location.href = "/auth";
          }
        }
      });
    };
  });
});

$(document).ready(function() {
  $('#signupButton').click(function() {
    var username = $('#inputEmail').val();
    var password = $('#inputPassword').val();

    if (username === '' || password === '') {
      $('#formWarning').empty().append('Email or Password field empty').show();
    } else {
      $.ajax({
        type: 'POST',
        url: '/api/auth/signup',
        data: JSON.stringify({
          username: username,
          password: password
        }),
        contentType: "application/json",
        success: function(data) {
          if (data.signup === true) {
            window.location.href = "/create";
          }
        },
        error: function(jqXHR, textStatus, errorThrown) { 
          if(jqXHR.status == 400) {  
            window.location.href = "/auth";
          }
        }
      });
    };
  });
});

$(document).ready(function() {
  $('#logoutButton').click(function() {
    $.ajax({
      type: 'GET',
      url: '/api/auth/logout',
      success: function(data) {
        if (data.logout === true) {
          window.location.href = "/";
        }
      },
      error: function(jqXHR, textStatus, errorThrown) { 
        if(jqXHR.status == 400 && jqXHR.responseJSON.logout === false) {  
          window.location.href = "/auth";
        }
      }
    });
  });
});

$(document).ready(function() {
  $('#formWarning').hide();
});

$(document).ready(function() {
  $('#closeWarning').on("click", function() {
    $('#formWarning').hide();
  });
});