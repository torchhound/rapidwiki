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
          } else {
            window.location.href = "/auth";
          }
        },
        failure: function(jqXHR, textStatus, errorThrown) {
          $('formResponse').html('There has been a problem with your post operation: ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown).show();
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
          } else {
            window.location.href = "/auth";
          }
        },
        failure: function(jqXHR, textStatus, errorThrown) {
          $('formResponse').html('There has been a problem with your post operation: ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown).show();
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
        } else {
          window.location.href = "/auth";
        }
      },
      failure: function(jqXHR, textStatus, errorThrown) {
        $('formResponse').html('There has been a problem with your post operation: ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown).show();
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