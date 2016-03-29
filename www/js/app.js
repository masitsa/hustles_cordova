var myApp = new Framework7();
var $$ = Dom7;
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

    this.register_non_member = function(form_data) {
		var request = url + "profile/register_seeker";
        return $.ajax({url: request, data: form_data, type: 'POST', processData: false,contentType: false});
    }

    /*this.login_member = function(member_no, password) {
		var request = url + "login/login_member/" + member_no + "/" + password;
        return $.ajax({url: request});
    }*/
    this.reset_password = function(form_data) {
  		var request = url + "profile/reset_password";
        return $.ajax({url: request, data: form_data, type: 'POST', processData: false,contentType: false});
    }
    this.login_member = function(form_data) {
  		var request = url + "profile/login_seeker";
        return $.ajax({url: request, data: form_data, type: 'POST', processData: false,contentType: false});
    }
    this.login_non_member = function(form_data) {
  		var request = url + "profile/login_non_member";
        return $.ajax({url: request, data: form_data, type: 'POST', processData: false,contentType: false});
    }
    this.automatic_login_member = function(email,password) {
  		var request = url + "profile/login_seeker";
        return $.ajax({url: request, data: {email: email,password: password}, type: 'POST', processData: false,contentType: false});
    }

    
    this.get_member_details = function(member_no){
    	var request = url + "profile/get_client_profile/" + member_no;
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
	//automatic_login();
	//window.localStorage.setItem("logged_in", "no");
	var logged_in = window.localStorage.getItem("logged_in");
	var mainView = myApp.addView('.view-main');
	
	//if user has logged in
	if(logged_in == "yes")
	{
		var logged_in_type = window.localStorage.getItem("logged_in_type");
		
		//if member
		if(logged_in_type == "member")
		{
			mainView.router.loadPage('members.html');
		}
		
		//else non member
		else
		{
			mainView.router.loadPage('advertisments.html');
		}
		$( "#profile-icon" ).removeClass( "display_none" );
	}
	
	//user hasn't logged in. Open login page
	else
	{
		$( "#profile-icon" ).addClass( "display_none" );
		mainView.router.loadPage('sign_in.html');
	}

});

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
				$("#login_response").html('<div class="alert alert-success center-align">'+"You have successfully logged in"+'</div>').fadeIn( "slow");

				// alert(data.message);
				window.localStorage.setItem("email", $("input[name=email]").val());
				window.localStorage.setItem("password", $("input[name=password]").val());
				window.localStorage.setItem("logged_in", "yes");
				window.localStorage.setItem("logged_in_type", "member");
				window.localStorage.setItem("job_seeker_id", data.job_seeker_id);
				$( "#profile-icon" ).removeClass( "display_none" );

				myApp.closeModal('.popup-signin-member');
				//get_map_home();
				var mainView = myApp.addView('.view-main');
				mainView.router.loadPage('members.html');
			}
			else
			{
				// alert(data.result);
				$("#login_response").html('<div class="alert alert-danger center-align">'+"Sorry the user credentials entered are wrong. Please Try again"+'</div>').fadeIn( "slow");
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

$(document).on("submit","form#login_non_member",function(e)
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
		
		service.login_non_member(form_data).done(function (employees) {
			var data = jQuery.parseJSON(employees);
			
			if(data.message == "success")
			{
				$("#non_member_login_response").html('<div class="alert alert-success center-align">'+"You have successfully logged in"+'</div>').fadeIn( "slow");

				// alert(data.message);
				window.localStorage.setItem("email", $("input[name=email]").val());
				window.localStorage.setItem("password", $("input[name=password]").val());
				window.localStorage.setItem("logged_in", "yes");
				window.localStorage.setItem("job_seeker_id", data.job_seeker_id);
				window.localStorage.setItem("logged_in_type", "non_member");

				$( "#profile-icon" ).removeClass( "display_none" );

				myApp.closeModal('.popup-signin-non-member');
				//get_map_home();
				var mainView = myApp.addView('.view-main');
				mainView.router.loadPage('advertisments.html');
			}
			else
			{
				// alert(data.result);
				$("#non_member_login_response").html('<div class="alert alert-danger center-align">'+"Sorry the user credentials entered are wrong. Please Try again"+'</div>').fadeIn( "slow");
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

$(document).on("submit","form#register_non_member",function(e)
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
        
        service.register_non_member(form_data).done(function (employees) {
            var data = jQuery.parseJSON(employees);
            if(data.message == "success")
            {
                //set local variables for future auto login
                // alert(data.message);
                window.localStorage.setItem("email_address", $("input[name=email_address]").val());
                window.localStorage.setItem("phone_number", $("input[name=phone_number]").val());
                window.localStorage.setItem("fullname", $("input[name=fullname]").val());
				window.localStorage.setItem("logged_in", "yes");
				window.localStorage.setItem("job_seeker_id", data.job_seeker_id);
				window.localStorage.setItem("logged_in_type", "non_member");

                /*$( "#clickable-adverts" ).css( "display", 'inline-block' );
                $( "#non-clickable-adverts" ).addClass( "display_none" );

                $( "#left-clickable-item" ).css( "display", 'inline-block' );
                $( "#left-non-clickable-item" ).addClass( "display_none" );*/

                // myApp.closeModal('.popup');
                // myApp.closeModal('.login-screen');
				myApp.closeModal('.popup-signin-non-member');
				myApp.closeModal('.popup-non-member-register');
                get_adverts();
				var mainView = myApp.addView('.view-main');
				mainView.router.loadPage('non_members.html');
                // mainView.router.loadPage('advertisments.html');
            }
            else
            {
                // alert(data.result);
                $("#registration_response").html('<div class="alert alert-danger center-align">'+data.result+'</div>').fadeIn( "slow");
              
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

$(document).on("submit","form#reset_password",function(e)
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
        
        service.reset_password(form_data).done(function (employees) {
            var data = jQuery.parseJSON(employees);
            if(data.message == "success")
            {
                $("#reset_response").html(data.result).fadeIn( "slow");
				/*var mainView = myApp.addView('.view-main');
				mainView.router.loadPage('non_members.html');*/
                // mainView.router.loadPage('advertisments.html');
            }
            else
            {
                // alert(data.result);
                $("#reset_response").html('<div class="alert alert-danger center-align">'+"Please try again. Something went wrong"+'</div>').fadeIn( "slow");
              
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

$$(document).on('pageInit', '.page[data-page="members"]', function (e) 
{
	get_map_home();
})

$$(document).on('pageInit', '.page[data-page="advertisments"]', function (e) 
{
	$( "#profile-icon" ).removeClass( "display_none" );
	get_adverts();
})

function get_map_home() 
{
	var latitude, longitude;
	latitude = -1.2920659;
	longitude = 36.82194619999996;
	// Try HTML5 geolocation.
	if (navigator.geolocation) 
	{
		// navigator.geolocation.getCurrentPosition(function(position) 
		// {
		// 	latitude = position.coords.latitude;
		// 	longitude = position.coords.longitude;
		// }, function() {
		// 	handleLocationError(true, infoWindow, map.getCenter());
		// });
		 browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
			  initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			  map.setCenter(initialLocation);
			}, function() {
			  handleNoGeolocation(browserSupportFlag);
			});
	} 
	else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
	function handleNoGeolocation(errorFlag) {
		if (errorFlag == true) {
		  alert("Geolocation service failed.");
		  initialLocation = newyork;
		} else {
		  alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
		  initialLocation = siberia;
		}
		map.setCenter(initialLocation);
	  }
	//set default location
	var default_location = new google.maps.LatLng(latitude, longitude);
	
	var markers = [];
	var map;
		
	var mapOptions = {
		zoom: 13,
		center: default_location,
		//mapTypeId: google.maps.MapTypeId.SATELLITE
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map-canvas-item'), mapOptions);
	
	function initialize() {
		
		/*marker = new google.maps.Marker({
			map:map,
			draggable:true,
			animation: google.maps.Animation.DROP,
			position: default_location,
			title: 'Hello World!'
		});
		google.maps.event.addListener(marker, 'click', toggleBounce);
		
		marker.setMap(map);*/
		drop();
	}
	function toggleBounce() {
	
		if (marker.getAnimation() != null) 
		{
			marker.setAnimation(null);
		} 
		else 
		{
			marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}
	
	//drop multiple markers one at a time
	function drop() {
		//clearMarkers();
		
		/*for (var i = 0; i < neighborhoods.length; i++) {//alert(i);
			addMarkerWithTimeout(neighborhoods[i], i * 200);
		}*/
		
		//get jobs
		$.ajax({
			type:'POST',
			url: base_url+'jobs/all_jobs',
			cache:false,
			contentType: false,
			processData: false,
			dataType: 'json',
			statusCode: {
				302: function() {
					//window.location.href = '<?php echo site_url();?>error';
				}
			},
			success:function(data){
				
				if(data.message == "success")
				{
					var arr = $.map(data.result, function(el) { return el; });
					
					for (var i = 0; i < arr.length; i++)
					{
						var longitude = arr[i].start_location_long;
						var latitude = arr[i].start_location_lat;
						var job_id = arr[i].job_id;
						var job_title = arr[i].job_title;
						var job_description = arr[i].job_description;
						var delivery_location_detail = arr[i].delivery_location_detail;
						
						var after_service = '';
						var delivery_location_detail = 'Drop at '+delivery_location_detail;
						
						if(!longitude || longitude == '')
						{
						}
						
						else
						{
							longitude = parseFloat(longitude).toFixed(16);
							latitude = parseFloat(latitude).toFixed(16);
							
							addMarkerWithTimeout(new google.maps.LatLng(latitude, longitude), i * 200, job_title, job_id, job_description, delivery_location_detail);
							
						}
					}
					
					//alert(markers.length);
					//add event listener
					for (var r = 0; r < markers.length; r++) {
						//markers[i].setMap(null);
						google.maps.event.addListener(markers[r], 'click', function() { 
						   alert("I am marker " + markers.title); 
						});
					}
				}
				else
				{
					console.log(data);
				}
			},
			error: function(xhr, status, error) {
				console.log("XMLHttpRequest=" + xhr.responseText + "\ntextStatus=" + status + "\nerrorThrown=" + error);
			}
		});
	}
	
	//function addMarkerWithTimeout(position, timeout, job, job_id, after_service, job_location) {
		function addMarkerWithTimeout(position, timeout, job_title, job_id, job_description, delivery_location_detail) {
		window.setTimeout(function() {
			
			//create marker
			var marker = new google.maps.Marker({
								position: position,
								map: map,
								animation: google.maps.Animation.DROP,
								title: job_title
							});
			
			//add marker description
			var contentString = '<span itemprop="streetAddress">'+job_title+'</span><br/><span itemprop="addressLocality">'+delivery_location_detail+'</span><br/><span itemprop="addressLocality">'+job_description+'</span>';
			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			// infowindow.open(map,marker);
			
			//on click listener;
			marker.addListener('click', function() 
			{
				infowindow.open(map,marker);
				// var title = marker.getTitle();
				// var conf = confirm('Are you sure you want to select '+title+'?');
				// infowindow.open(map, marker);
				
				// if(conf)
				// {
				// 	window.location.href = '<?php echo site_url();?>hire-user/'+job_id;
				// }
			  });
			/*markers.push(new google.maps.Marker({
				position: position,
				map: map,
				animation: google.maps.Animation.DROP,
				title: job
			}));*/
		}, timeout);
	}
	
	//clear all markers
	function clearMarkers() {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers = [];
	}
	
  google.maps.event.addDomListener(window, 'load', initialize);
  
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
	searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
	var places = searchBox.getPlaces();

	if (places.length == 0) {
	  return;
	}

	// Clear out the old markers.
	markers.forEach(function(marker) {
	  marker.setMap(null);
	});
	markers = [];

	// For each place, get the icon, name and location.
	var bounds = new google.maps.LatLngBounds();
	places.forEach(function(place) {
	  var icon = {
		url: place.icon,
		size: new google.maps.Size(71, 71),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(25, 25)
	  };

	  // Create a marker for each place.
	  markers.push(new google.maps.Marker({
		map: map,
		icon: icon,
		title: place.name,
		position: place.geometry.location
	  }));

	  if (place.geometry.viewport) {
		// Only geocodes have viewport.
		bounds.union(place.geometry.viewport);
	  } else {
		bounds.extend(place.geometry.location);
	  }
	});
	map.fitBounds(bounds);
	drop();
  });

}

function get_member_details()
{

	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});

	var job_seeker_id = window.localStorage.getItem("job_seeker_id");

    $( "#loader-wrapper" ).removeClass( "display_none" );
	service.get_member_details(1).done(function (employees) {
		var data = jQuery.parseJSON(employees);
		if(data.message == "success")
		{
			// $( "#news-of-icpak" ).addClass( "display_block" );
			$( "#seeker_profile" ).html( data.result );
			window.localStorage.setItem("seeker_profile",data.result);
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
		
		else
		{
			$( "#adverts_div" ).html( '<p>Unable to add load adverts</p>' );
		}
	});
	
}
$$(document).on('pageInit', '.page[data-page="advert-single"]', function (e) 
{
	$( "#profile-icon" ).addClass( "display_none" );
	$( "#left-menu-button-default" ).addClass( "display_none" );
	$( "#left-menu-button" ).removeClass( "display_none" );
})


function load_membership()
{

	var mainView = myApp.addView('.view-main');
	
	mainView.router.loadPage('about_membership.html');
	$( "#left-menu-button-default" ).addClass( "display_none" );
	$( "#left-menu-button" ).removeClass( "display_none" );

		
}
function load_contact()
{
	var mainView = myApp.addView('.view-main');
	
	mainView.router.loadPage('contact.html');
	$( "#left-menu-button-default" ).addClass( "display_none" );
	$( "#left-menu-button" ).removeClass( "display_none" );

}
function load_profile()
{
	var mainView = myApp.addView('.view-main');

	mainView.router.loadPage('profile.html');
	
	get_member_details();
	$( "#left-menu-button-default" ).addClass( "display_none" );
	$( "#left-menu-button" ).removeClass( "display_none" );
}