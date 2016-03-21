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
	$( "#loader-wrapper" ).removeClass( "display_none" );
	var service = new Jobs_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
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

function get_advert_description(advert_id)
{
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
			// $( "#loader-wrapper" ).addClass( "display_none" );
		}
		
		else
		{

		}
	});
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
	$( "#loader-wrapper" ).removeClass( "display_none" );
	var service = new Jobs_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get client's credentials
	
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
}
//pass the variable in the link as follows e.g. news.html?id=1
//on the news.html page get the parameter by javascript as follows var id = getURLParameter('id');
//the function to get the url parameter is defined below
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}
