//login & registration functions
var Login_service = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : base_url;
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        return $.ajax({url: url + "/" + id});
    }

    this.register_member = function(form_data) {
		var request = url + "login/register_user";
        return $.ajax({url: request, data: form_data, type: 'POST', processData: false,contentType: false});
    }

    /*this.login_member = function(member_no, password) {
		var request = url + "login/login_member/" + member_no + "/" + password;
        return $.ajax({url: request});
    }*/
    this.login_member = function(form_data) {
  		var request = url + "profile/login_seeker";
        return $.ajax({url: request, data: form_data, type: 'POST', processData: false,contentType: false});
    }
    this.get_member_details = function(member_no){
    	var request = url + "login/get_member_information/" + member_no;
        return $.ajax({url: request});
    }
  
}

$(document).on("submit","form#login_member",function(e)
{
	e.preventDefault();
	
	//get form values
	var form_data = new FormData(this);
	
	
	//check if there is a network connection
	//var connection = checkConnection();
	var connection = "connected";
	
	if(connection != 'No network connection')
	{
		var service = new Login_service();
		service.initialize().done(function () {
			console.log("Service initialized");
		});
		
		service.login_member(form_data).done(function (employees) {
			var data = jQuery.parseJSON(employees);
			
			if(data.message == "success")
			{
				//set local variables for future auto login
				
				$( ".mainmenu #dashboard" ).css( "display", 'inline-block' );
				$( ".mainmenu #profile" ).css( "display", 'inline-block' );
				$( "#profile_icon" ).html( '<a href="profile.html" class="link icon-only" onclick="get_profile();"><img src="img/menu2.png" alt=""></a>' );

				$("#login_response").html('<div class="alert alert-success center-align">'+"You have successfully logged in"+'</div>').fadeIn( "slow");

				// alert(data.message);

				myApp.closeModal('.login-screen');
				mainView.router.loadPage('dashboard.html');
			}
			else
			{
				// alert(data.result);
				$("#login_response").html('<div class="alert alert-danger center-align">'+"No internet connection - please check your internet connection then try again"+'</div>').fadeIn( "slow");
				mainView.router.loadPage('dashboard.html');
			}
        });
	}
	
	else
	{
		alert("No internet connection - please check your internet connection then try again");
	}
	return false;
});
