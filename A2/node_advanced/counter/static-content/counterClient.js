// See the JQuery documentation at ... 
// http://api.jquery.com/
// http://learn.jquery.com/
// See my JQuery and Ajax notes 
// Could also use the fetch api see...
// https://www.sitepoint.com/xmlhttprequest-vs-the-fetch-api-whats-best-for-ajax-in-2019/

function login(){
	// Normally would check the server to see if the credentials checkout
	$("#ui_login").hide();
	$("#ui_counter").show();
}

// Request all counters from the server
function retrieveAll(){
	// For a completely restful api, we would need to send some king of authentication
	// token for each request. A simple trivial one is sending the user and password
	// an alternative is to send something hashed with the user and password

	$.ajax({ 
		method: "GET", 
		url: "/api/counter/",
		processData:false, 
		contentType: "application/json; charset=utf-8",
		dataType:"json"
	}).done(function(data, text_status, jqXHR){
		console.log(jqXHR.status+" "+text_status+JSON.stringify(data));

		var allCounters = "";
		for(var counter in data){
			allCounters += "<br/>"+counter+" "+data[counter];
		}
		$("#allCounters").html(allCounters);
	}).fail(function(err){
		console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
	});
}

// add a counter new counter
function create(){
	$.ajax({ 
		method: "POST", 
		url: "/api/counter/"+$("#createCounterName").val(),
		data: JSON.stringify({ "value": $("#createCounterValue").val() }),
		processData:false, 
		contentType: "application/json; charset=utf-8",
		dataType:"json"
	}).done(function(data, text_status, jqXHR){
		console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
		retrieveAll(); 
	}).fail(function(err){
		console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
	});
}

// increment a counter
function update(){
	$.ajax({ 
		method: "PUT", 
		url: "/api/counter/"+$("#updateCounterName").val()+"/", 
		data: JSON.stringify({ "amount": $("#updateCounterAmount").val() }),
		processData: false, 
		contentType: "application/json; charset=utf-8",
		dataType :"json"
	}).done(function(data, text_status, jqXHR){
		console.log(jqXHR.status+" "+text_status+JSON.stringify(data));

		retrieveAll();
	}).fail(function(err){
		console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
	});
}

// delete a counter
function deleteCounter(){
	$.ajax({ 
		method: "DELETE", 
		url: "/api/counter/"+$("#deleteCounterName").val()+"/", 
		processData:false, 
		contentType: "application/json; charset=utf-8",
		dataType:"json"
	}).done(function(data, text_status, jqXHR){
		console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
		retrieveAll();
	}).fail(function(err){
		console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
	});
}

// This is executed when the document is ready (the DOM for this document is loaded)
$(function(){
	// Setup all events here and display the appropriate UI
	$("#loginSubmit").on('click',function(){ login(); });
	$("#createCounterSubmit").on('click',function(){ create(); });
	$("#updateCounterSubmit").on('click',function(){ update(); });
	$("#deleteCounterSubmit").on('click',function(){ deleteCounter(); });
	$("#retrieveCounterSubmit").on('click',function(){ retrieveAll(); });
	$("#ui_login").show();
	$("#ui_counter").hide();
});
