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
		var request = url + "profile/register_seeker";
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
    this.automatic_login_member = function(email,password) {
  		var request = url + "profile/login_seeker";
        return $.ajax({url: request, data: {email: email,password: password}, type: 'POST', processData: false,contentType: false});
    }

    
    this.get_member_details = function(member_no){
    	var request = url + "login/get_member_information/" + member_no;
        return $.ajax({url: request});
    }
  
}
/* Function to check for network connectivity */
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() 
{
    
    cordova.plugins.backgroundMode.setDefaults({ title:'JANTA 254', text:'JANTA 254', silent: true});
    
    //check if background action is enabled
    var enabled = cordova.plugins.backgroundMode.isEnabled();
    if(enabled === false)
    {
        // Enable background mode
        cordova.plugins.backgroundMode.enable();
    }

    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
        
        //clear other timeouts
        //clearTimeout(all_message_timeout);
        //clearTimeout(single_message_timeout);
        
    };
    
    cordova.plugins.backgroundMode.onfailure = function(errorCode) {
        cordova.plugins.backgroundMode.configure({
                        text:errorCode
                    });        
    };
}
(function message_cheker() {
	 $.ajax({
            url: base_url+'jobs/count_unread_jobs',
            cache:false,
            contentType: false,
            processData: false,
            dataType: 'json',
            statusCode: {
                302: function() {
                    //alert('302');
                }
            },
            success: function(data) 
            {
                var prev_total_jobs = parseInt(window.localStorage.getItem("total_jobs"));
                var total_received = parseInt(data.unread_messages);
                
                
                
                if(total_received > prev_total_jobs)
                {
                    // Modify the currently displayed notification
                    window.localStorage.setItem("total_jobs", total_received);
                    
                    set_jobs_data();
                    load_messages();
                    
                    //store received messages
                    var message_data = data.news;
                    
                    //calculate number of messages received
                    var difference = total_received - prev_total_jobs;
                    var count = 0;
                    $.each(message_data, function(idx, obj) 
                    {
                        count++;
                        if(count == 1)
                        {
                            var txt = 'news';
                        }
                        else
                        {
                            var txt = 'news';
                        }
                        $('#news_badge').html('<span style="font-size:10px; float:right; background-color:red;" class="img-rounded">'+count+'</span>');
                        
                        //display notification
                        cordova.plugins.backgroundMode.configure({title:'New message', text:'You have '+count+' new '+txt, silent: false});
                        var message_result = obj.result;//alert(message_result);
                       
                        //alert(obj.tagName);
                        
                        //check if chat history exists
                        var prev_msg = window.localStorage.getItem("jobs_div");
                        if(prev_msg == null)
                        {
                            var new_msg = message_result;
                        }
                        
                        else
                        {
                            var new_msg = prev_msg+message_result;
                        }
                        window.localStorage.setItem("jobs_div", new_msg);
                        
                        //if msg pop up is open
                        
                    });
                }
                
                else
                {
                    
                    //cordova.plugins.backgroundMode.configure({title:'New message', text:'new message', silent: true});
                    window.localStorage.setItem("total_jobs", total_received);
                }
            },
            complete: function() 
            {
                setTimeout(message_cheker, 2000);
            }
        });
})();




$(document).ready(function(){
	automatic_login();
});
//automatic login
function automatic_login()
{
	// alert("here");
	$( "#loader-wrapper" ).removeClass( "display_none" );

	
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get member's credentials
	var email = window.localStorage.getItem("email");
	var password = window.localStorage.getItem("password");
	
	service.automatic_login_member(email, password).done(function (employees) {
		var data = jQuery.parseJSON(employees);//alert(email+' '+password);
		
		if(data.message == "success")
		{
			$( ".mainmenu #dashboard" ).css( "display", 'inline-block' );
			$( ".mainmenu #profile" ).css( "display", 'inline-block' );
			$( "#requested-jobs" ).css( "display", 'inline-block' );
			$( "#completed-jobss" ).css( "display", 'inline-block' );
			$( "#assigned-jobs" ).css( "display", 'inline-block' );
			$( "#profile_icon" ).html( '<a href="profile.html" class="link icon-only" onclick="get_profile();"><img src="img/menu2.png" alt=""></a>' );
	
		}
		else
		{
			$("#response").html('<div class="alert alert-danger center-align">'+data.result+'</div>').fadeIn( "slow");
		}
		
		$( "#loader-wrapper" ).addClass( "display_none" );
	});
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
				$( "#requested-jobs" ).css( "display", 'inline-block' );
				$( "#completed-jobss" ).css( "display", 'inline-block' );
				$( "#assigned-jobs" ).css( "display", 'inline-block' );
				$( "#profile_icon" ).html( '<a href="profile.html" class="link icon-only" onclick="get_profile();"><img src="img/menu2.png" alt=""></a>' );
				$( "#available-jobs-item" ).css( "display", 'inline-block' );
				$( "#available-jobs" ).addClass( "display_none" );
				$("#login_response").html('<div class="alert alert-success center-align">'+"You have successfully logged in"+'</div>').fadeIn( "slow");

				// alert(data.message);
				window.localStorage.setItem("email", $("input[name=email]").val());
				window.localStorage.setItem("password", $("input[name=password]").val());
				window.localStorage.setItem("loggged_in", 1);

				myApp.closeModal('.login-screen');
				get_map_home();
				mainView.router.loadPage('index.html');
			}
			else
			{
				// alert(data.result);
				$("#login_response").html('<div class="alert alert-danger center-align">'+"Sorry the user credentials entered are wrong. Please Try again"+'</div>').fadeIn( "slow");
				mainView.router.loadPage('dashboard.html');
			}
			$( "#loader-wrapper" ).addClass( "display_none" );
        });
	}
	
	else
	{
		alert("No internet connection - please check your internet connection then try again");
	}
	return false;
});

$(document).on("submit","form#register_member",function(e)
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
        
        service.register_member(form_data).done(function (employees) {
            var data = jQuery.parseJSON(employees);
            if(data.message == "success")
            {
                //set local variables for future auto login
                // alert(data.message);
                window.localStorage.setItem("email_address", $("input[name=email_address]").val());
                window.localStorage.setItem("phone_number", $("input[name=phone_number]").val());
                window.localStorage.setItem("fullname", $("input[name=fullname]").val());
                window.localStorage.setItem("loggged_in_other", 1);

                $( "#clickable-adverts" ).css( "display", 'inline-block' );
                $( "#non-clickable-adverts" ).addClass( "display_none" );

                $( "#left-clickable-item" ).css( "display", 'inline-block' );
                $( "#left-non-clickable-item" ).addClass( "display_none" );

                // myApp.closeModal('.popup');
                // myApp.closeModal('.login-screen');
                get_adverts();
                window.location.href ='advertisments.html';
                // mainView.router.loadPage('advertisments.html');
            }
            else
            {
                // alert(data.result);
                $("#login_response").html('<div class="alert alert-danger center-align">'+"Please try again. Something went wrong"+'</div>').fadeIn( "slow");
              
            }
            $( "#loader-wrapper" ).addClass( "display_none" );
        });
    }
    
    else
    {
        alert("No internet connection - please check your internet connection then try again");
    }
return false;
});

function set_jobs_data()
{
		var service = new Login_service();
		service.initialize().done(function () {
			console.log("Service initialized");
		});
		service.get_jobs().done(function (employees) {
		
		var data = jQuery.parseJSON(employees);
		
		window.localStorage.setItem("jobs_div", data.result);
		window.localStorage.setItem("total_jobs", data.total);
	});
}
function load_messages()
{
	var messages = window.localStorage.getItem("jobs_div");
	$("#icpak_news").html(messages);
}