$(document).ready(function() {


    $('form').submit(function() {
       $.ajax({
          type:'POST',
          url:'/staff',
          data:  {username: $('#username').val(), password: $('#password').val()},
          success:function(result){
             if(!result){
                $('form input[name="username"]').css("background-color", "red");
             }
 
          },
          error: function (xhr, ajaxOptions, thrownError) {
             console.log(xhr.status);
             console.log(thrownError);
          }
       });
 
 
       return false;
    });
 
 });