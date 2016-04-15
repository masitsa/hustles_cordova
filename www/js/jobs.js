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
	var video_id = window.localStorage.getItem("video_id");
	
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
			var myInterval = setInterval(function(){ start_timer_new(advert_id) }, 2000);
			window.localStorage.setItem("myInterval",myInterval);
		}
		
		else
		{

		}
	});
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
				
				//display youtube video
				display_youtube_video();
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

function display_youtube_video()
{
	var i,c,y,v,s,n;v=document.getElementsByClassName("youtube");if(v.length>0){s=document.createElement("style");s.type="text/css";s.innerHTML='.youtube{background-color:#000;max-width:100%;overflow:hidden;position:relative;cursor:hand;cursor:pointer}.youtube .thumb{bottom:0;display:block;left:0;margin:auto;max-width:100%;position:absolute;right:0;top:0;width:100%;height:auto}.youtube .play{filter:alpha(opacity=80);opacity:.8;height:77px;left:50%;margin-left:-38px;margin-top:-38px;position:absolute;top:50%;width:77px;background:url("data:image/png;base64,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") no-repeat}';document.body.appendChild(s)}for(n=0;n<v.length;n++){y=v[n];i=document.createElement("img");i.setAttribute("src","http://i.ytimg.com/vi/"+y.id+"/hqdefault.jpg");i.setAttribute("class","thumb");c=document.createElement("div");c.setAttribute("class","play");y.appendChild(i);y.appendChild(c);y.onclick=function(){}};
}

//View app
$(document).on("click",".youtube",function() 
{
	var video_id = $(this).attr('id');
	var advert_id = $(this).attr('advert_id');
	
	window.localStorage.setItem("video_id",video_id);
	window.localStorage.setItem("advert_id",advert_id);
	
	var mainView = myApp.addView('.view-main');
	mainView.router.loadPage('advert-single.html');
	return false;
});