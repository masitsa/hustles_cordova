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
		alert("sdkajsda"+request);
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
    this.getAdvertDetail = function(advert_id) {
        var request = url + "advertising/get_advert_detail/" + advert_id;
        return $.ajax({url: request});
    }
    this.get_time_to_leave = function(advert_id) {
        var request = url + "advertising/time_to_leave/" + advert_id;
        return $.ajax({url: request});
    }
    this.get_advertisments = function() {
		var request = url + "advertising/get_adverts";
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
	var loggged_in = window.localStorage.getItem("loggged_in");
	// alert(loggged_in);
	// var loggged_in = null;
	if(loggged_in == null)
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
$$(document).on('pageInit', '.page[data-page="advert-single"]', function (e) 
{
	var advert_id = window.localStorage.getItem("advert_id");
	var myInterval = setInterval(function(){ start_timer_new(advert_id) }, 2000);
	window.localStorage.setItem("myInterval",myInterval);
	
})
function myStopFunction() {
		var myInterval = window.localStorage.getItem("myInterval");
     	clearInterval(myInterval);
}


function get_advert_description(advert_id)
{
	window.localStorage.setItem("advert_id",advert_id);

	$( "#loader-wrapper" ).removeClass( "display_none" );
	var service = new Jobs_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.getAdvertDetail(advert_id).done(function (employees) {
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

	// var loggged_in_other = window.localStorage.getItem("loggged_in_other");
 	// // var loggged_in_other = window.localStorage.setItem("loggged_in_other",null);
	// if(loggged_in_other == null)
	// {
	// 	myApp.openModal('.login-screen');
	// }
	// else
	// {

	    $( "#loader-wrapper" ).removeClass( "display_none" );
		service.get_advertisments().done(function (employees) {
			var data = jQuery.parseJSON(employees);
		
			if(data.message == "success")
			{

				// $( "#news-of-icpak" ).addClass( "display_block" );
				$( "#adverts_div" ).html( data.result );
				$( "#loader-wrapper" ).addClass( "display_none" );
			}
			
			else
			{

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
