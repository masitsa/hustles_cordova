var myApp = new Framework7();
var $$ = Dom7;
//jobs functions
var Jobs_service = function() {

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

    this.get_jobs = function(job_status) {
		var request = url + "jobs/get_jobs/" + job_status;
        return $.ajax({url: request});
    }

    this.get_map = function() {

		var request = url + "jobs/get_map";
		
        return $.ajax({url: request});
    }

    this.getJobDetail = function(job_id,job_status) {
        var request = url + "jobs/get_job_detail/" + job_id + "/" + job_status;
        return $.ajax({url: request});
    }
    this.bookJob = function(job_id) {
    	var request = url + "jobs/book_job/" + job_id;
        return $.ajax({url: request});
    }
    this.get_profile = function() {
		var request = url + "profile/get_client_profile";
        return $.ajax({url: request});
    }	
    this.getAdvertDetail = function(advert_id, job_seeker_id) {
        var request = url + "advertising/get_advert_detail/" + advert_id +"/" + job_seeker_id;
        return $.ajax({url: request});
    }
    this.get_time_to_leave = function(advert_id) {
        var request = url + "advertising/time_to_leave/" + advert_id;
        return $.ajax({url: request});
    }
    this.get_advertisments = function(job_seeker) {
		var request = url + "advertising/get_adverts/"+job_seeker;
        return $.ajax({url: request});
    }

}

function get_profile()
{
	$( "#loader-wrapper" ).removeClass( "display_none" );
	var service = new Jobs_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get client's credentials
	
	service.get_profile().done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		if(data.message == "success")
		{
			$( "#seeker_profile" ).html( data.result );
		}
		
		else
		{

		}
	});
}

function get_jobs(jobs_status)
{
	var service = new Jobs_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	var logged_in = window.localStorage.getItem("logged_in");
	// alert(logged_in);
	// var logged_in = null;
	if(logged_in == null)
	{
		myApp.openModal('.login-screen');
	}
	else
	{
		$( "#loader-wrapper" ).removeClass( "display_none" );
		//get client's credentials
		service.get_jobs(jobs_status).done(function (employees) {
			var data = jQuery.parseJSON(employees);
			
			if(data.message == "success")
			{
				// $( "#news-of-icpak" ).addClass( "display_block" );
				$( "#jobs_div" ).html( data.result );
				$( "#loader-wrapper" ).addClass( "display_none" );
			}
			
			else
			{

			}
		});
	}
	
	
}

function get_home_map()
{

	$( "#loader-wrapper" ).removeClass( "display_none" );
	var service = new Jobs_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});

	//get client's credentials	

	service.get_map().done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		if(data.message == "success")
		{
			// $( "#news-of-icpak" ).addClass( "display_block" );
			alert(data.result);
			$( "#map-canvas" ).html( data.result );
			// $( "#loader-wrapper" ).addClass( "display_none" );
		}
		
		else
		{

		}
	});
}



function get_job_description(job_id,job_status)
{
	$( "#loader-wrapper" ).removeClass( "display_none" );
	var service = new Jobs_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.getJobDetail(job_id,job_status).done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		if(data.message == "success")
		{
			// $( "#news-of-icpak" ).addClass( "display_block" );
			$( "#single_job" ).html( data.result );
			// $( "#loader-wrapper" ).addClass( "display_none" );
		}
		
		else
		{

		}
	});
}

var playerObjects = {};
function onYouTubePlayerReady(playerId) 
{
	alert(playerId);
	playerObjects[playerId] = document.getElementById(playerId);
}
      
$$(document).on('pageInit', '.page[data-page="advert-single"]', function (e) 
{
	var advert_id = window.localStorage.getItem("advert_id");
	var myInterval = setInterval(function(){ start_timer_new(advert_id) }, 2000);
	window.localStorage.setItem("myInterval",myInterval);
})

function myStopFunction() 
{
	$( "#profile-icon" ).removeClass( "display_none" );
	$( "#left-menu-button" ).addClass( "display_none" );
	$( "#left-menu-button-default" ).removeClass( "display_none" );
	var myInterval = window.localStorage.getItem("myInterval");
	clearInterval(myInterval);
}
$$(document).on('pageInit', '.page[data-page="my_profile_page"]', function (e) 
{
	myStopFunction();
	$( "#left-menu-button-default" ).addClass( "display_none" );
	$( "#left-menu-button" ).removeClass( "display_none" );
	$( "#profile-icon" ).addClass( "display_none" );
})

function onYouTubeIframeAPIReady ()  { 
  var player ; 
  var video_id = window.localStorage.getItem("video_id");
  player =  new YT . Player ( 'player' ,  { 
    width :  1280 , 
    height :  720 , 
    videoId :  video_id , 
    events :  { 
      'onReady' : onPlayerReady , 
      'onStateChange' : onPlayerStateChange , 
      'onError' : onPlayerError 
    } 
  }); 
  // window.localStorage.setItem("payer_item",player);
}
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
		setTimeout(stopVideo, 6000);
		done = true;
	}
	else if (event.data == YT.PlayerState.PAUSED) {
		
		myStopFunction();
	}
}
function stopVideo() {
	// var player = window.localStorage.getItem("payer_item");
	player.stopVideo();
} 
function onPlayerError() {
	player.stopVideo();
} 


function get_advert_description(advert_id, video_id)
{	
	window.localStorage.setItem("advert_id",advert_id);
	var job_seeker_id = window.localStorage.getItem("job_seeker_id");

	$( "#loader-wrapper" ).removeClass( "display_none" );
	var service = new Jobs_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.getAdvertDetail(advert_id, job_seeker_id).done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		if(data.message == "success")
		{
			
			// $( "#news-of-icpak" ).addClass( "display_block" );
			$( "#single_advert" ).html( data.result );
			
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
		
		else
		{

		}
	});
}

function start_timer_new(advert_id)
{
	var count = 0;
	var counter = window.localStorage.getItem('count_item');
	var job_seeker_id = window.localStorage.getItem('job_seeker_id');
	if(counter > 0)
	{
		count = counter;
	}
	else if (counter == null)
	{
		count = 0;
	}
	else
	{
		count = 0;
	}
     $.ajax({
        url: base_url+'advertising/update_link_details/'+advert_id+'/'+count+'/'+job_seeker_id,
        cache:false,
        contentType: false,
        processData: false,
        dataType: 'json',
        statusCode: {
            302: function() {
            }
        },
        success: function(data) 
        {
            // Put anything here which you want done after the db update is done
         	// alert(data.message);
            if(data.message == 'success')
            {
            	window.localStorage.setItem("count_item",1);
            }
            else if(data.message == 'fail')
            {

            	window.localStorage.setItem("count_item",2);
            }
         	
        },
        complete: function() {

        },  
        error : function(xhr, textStatus, errorThrown ) {
	       window.localStorage.setItem("count_item",0);
	    }
    });
}


function start_timer(advert_id,myInterval)
{
	
	var service = new Jobs_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.get_time_to_leave(advert_id).done(function (employees) {
		var data = jQuery.parseJSON(employees);

	
		if(data.message == "success")
		{
			var stop_time = data.stop_time;
			window.localStorage.setItem("stop_time",stop_time);
		}
		
		else
		{
			var stop_time = 0;
			window.localStorage.setItem("stop_time",stop_time);
		}
	});

	myInterval = setInterval(function(){
		var count = 0;
		var counter = window.localStorage.getItem('count_item');
		if(counter > 0)
		{
			count = counter;
		}
		else if (counter == null)
		{
			count = 0;
		}
		else
		{
			count = 0;
		}
         $.ajax({
	        url: base_url+'advertising/update_link_details/'+advert_id+'/'+count,
	        cache:false,
            contentType: false,
            processData: false,
            dataType: 'json',
            statusCode: {
                302: function() {
                }
            },
            success: function(data) 
            {
	            // Put anything here which you want done after the db update is done
	         	// alert(data.message);
	            if(data.message == 'success')
	            {
	            	window.localStorage.setItem("count_item",1);
	            }
	            else if(data.message == 'fail')
	            {

	            	window.localStorage.setItem("count_item",2);
	            }
	         	
	        },
	        complete: function() {

	        },  
	        error : function(xhr, textStatus, errorThrown ) {
		       window.localStorage.setItem("count_item",0);
		    }
	    });
    }, 2000);
   
    var stop_time = window.localStorage.getItem('stop_time');
	// leave(myInterval,stop_time);
}

function leave(myInterval,stop_time)
{    

	setTimeout(
    function() {
      clearInterval(myInterval);
    }, 2000000000);
}



function request_job(job_id,job_status) {
	// body...
	var service = new Jobs_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.bookJob(job_id).done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		if(data.message == "success")
		{
			// $( "#news-of-icpak" ).addClass( "display_block" );
			// $( "#request_response" ).html(data.result);
			// $( "#loader-wrapper" ).addClass( "display_none" );
			alert(data.result);
		}
		
		else
		{
			alert(data.result);
		}
	});
	get_job_description(job_id,job_status);
}


function get_adverts()
{
	var service = new Jobs_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});

	// var logged_in_other = window.localStorage.getItem("logged_in_other");
 	// // var logged_in_other = window.localStorage.setItem("logged_in_other",null);
	// if(logged_in_other == null)
	// {
	// 	myApp.openModal('.login-screen');
	// }
	// else
	// {
		var job_seeker = window.localStorage.getItem("job_seeker_id");

	    $( "#loader-wrapper" ).removeClass( "display_none" );
		service.get_advertisments(job_seeker).done(function (employees) {
			var data = jQuery.parseJSON(employees);
			if(data.message == "success")
			{

				// $( "#news-of-icpak" ).addClass( "display_block" );
				$( "#adverts_div" ).html( data.result );
				$( "#loader-wrapper" ).addClass( "display_none" );
			}
			
			else
			{
				$( "#adverts_div" ).html( '<p>Unable to add load adverts</p>' );
			}
		});
	// }
}
//pass the variable in the link as follows e.g. news.html?id=1
//on the news.html page get the parameter by javascript as follows var id = getURLParameter('id');
//the function to get the url parameter is defined below
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}
