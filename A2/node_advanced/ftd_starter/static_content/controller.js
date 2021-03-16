var stage=null;
var view = null;
var interval=null;
var credentials={ "username": "", "password":"" };
const USER_EXIST = 23505;
function setupGame(){
	stage=new Stage(document.getElementById('stage'));

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKey);
}
function startGame(){
	interval=setInterval(function(){ stage.step(); stage.draw(); },100);
}
function pauseGame(){
	clearInterval(interval);
	interval=null;
}
function moveByKey(event){
	var key = event.key;
	var moveMap = { 
                'a': new Pair(-5,0),
                's': new Pair(0,5),
                'd': new Pair(5,0),
                'w': new Pair(0,-5)
	};
	if(key in moveMap){
		stage.player.velocity=moveMap[key];
	}
}

function login(){
	credentials =  { 
		"username": $("#username").val(), 
		"password": $("#password").val() 
	};

        $.ajax({
                method: "POST",
                url: "/api/auth/login",
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));

        	$("#ui_login").hide();
                $("#ui_register").hide();
        	$("#ui_play").show();

		setupGame();
		startGame();

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
                $("#password").focus();
                $("#loginuserNameErr").show();
                $("#loginuserNameErr").text("User name or password is incorrect");
                $("#loginuserNameErr").fadeOut(3000);
                return;
        });
}

function register(){
	credentials =  { 
		"username": $("#createUser").val(), 
		"password": $("#createPassword").val() 
	};

        if(credentials.username==""){
                $("#createUser").focus();
                $("#userNameErr").show();
                $("#userNameErr").text("User name is required");
                $("#userNameErr").fadeOut(3000);
                return;
        }
        
        if(credentials.password==""){
                $("#createPassword").focus();
                $("#passwordErr").show();
                $("#passwordErr").text("Password is required");
                $("#passwordErr").fadeOut(3000);
                return;
        }

        if($("#confirmPassword").val()==""){
                $("#confirmPassword").focus();
                $("#confirmPassErr").show();
                $("#confirmPassErr").text("Please enter your password again");
                $("#confirmPassErr").fadeOut(3000);
                return;
        }

        if($("#confirmPassword").val()!="" && credentials.password!="" && $("#confirmPassword").val()!=credentials.password){
                $("#confirmPassword").focus();
                $("#confirmPassErr").show();
                $("#confirmPassErr").text("The passwords do not match");
                $("#confirmPassErr").fadeOut(3000);
                return;
        }

        $.ajax({
                method: "POST",
                url: "/api/register",
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));

                $("#registatus").text("Registration completed! Coming back to Login page");
                $("#registatus").fadeOut(3000, function(){
                        $("#ui_login").show();
                        $("#ui_register").hide();
        	        $("#ui_play").hide();
                })

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
                if(err.responseJSON.error.code==USER_EXIST){
                        $("#createUser").focus();
                        $("#userNameErr").show();
                        $("#userNameErr").text("User name alredy exist");
                        $("#userNameErr").fadeOut(3000);
                }
        });
}

function go_register(){
        $.ajax({
                method: "POST",
                url: "/api/go_register",
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));

        	$("#ui_login").hide();
                $("#ui_register").show();
        	$("#ui_play").hide();

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

function go_login(){
        $.ajax({
                method: "POST",
                url: "/api/go_login",
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));

        	$("#ui_login").show();
                $("#ui_register").hide();
        	$("#ui_play").hide();

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

// Using the /api/auth/test route, must send authorization header
function test(){
        $.ajax({
                method: "GET",
                url: "/api/auth/test",
                data: {},
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

$(function(){
        // Setup all events here and display the appropriate UI
        $("#loginSubmit").on('click',function(){ login(); });
        $("#registerSubmit").on('click',function(){ register(); });
        $("#gotoRegister").on('click',function(){ go_register(); });
        $("#gotoLogin").on('click',function(){ go_login(); });
        
        $("#ui_login").show();
        $("#ui_register").hide();
        $("#ui_play").hide();
});

