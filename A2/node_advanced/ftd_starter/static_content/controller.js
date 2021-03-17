var stage=null;
var view = null;
var interval=null;
var credentials={ "username": "", "password":"" };
const USER_EXIST = 23505;
function setupGame(){
	stage=new Stage(document.getElementById('stage'));

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKey);
        document.addEventListener('mousemove', moveByMouse);
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
                'a': new Pair(-10,0),
                's': new Pair(0,10),
                'd': new Pair(10,0),
                'w': new Pair(0,-10),
	};
	if(key in moveMap){
		stage.player.velocity=moveMap[key];
	}
        if (key == 'f') {
                // create a bullet, display on the stage
                var velocity = new Pair(stage.player.mousex, stage.player.mousey);
                var radius = 5;
                var colour= 'rgba(0,0,0,1)';
                var player_position = stage.player.position
                var position = new Pair(player_position.x + stage.player.radius/2, 
                        player_position.y + stage.player.radius/2)
                var b = new Bullet(stage, position, velocity, colour, radius);
                stage.addActor(b);

                // player have limited amunition
                // Todo
        }
}
function moveByMouse(event){
        var x = event.clientX - stage.canvas.getBoundingClientRect().left;
	var y = event.clientY - stage.canvas.getBoundingClientRect().top;  
        var volx = x - stage.player.x;
        var voly = y - stage.player.y;
        var divide = Math.max(Math.abs(volx), Math.abs(voly)) / 20;
        volx = volx / divide;
        voly = voly / divide;
        stage.player.mousex = volx;
        stage.player.mousey = voly;
}

function login(){
	credentials =  { 
		"username": $("#username").val(), 
		"password": $("#password").val() 
	};

        if(credentials.username==""){
                $("#username").focus();
                $("#loginuserNameErr").show();
                $("#loginuserNameErr").text("User name is required");
                $("#loginuserNameErr").fadeOut(3000);
                return;
        }

        if(credentials.password==""){
                $("#password").focus();
                $("#loginPassErr").show();
                $("#loginPassErr").text("Password is required");
                $("#loginPassErr").fadeOut(3000);
                return;
        }

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
                $("#password").val("");
                $("#loginuserNameErr").fadeOut(2000);
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
                $("#confirmPassword").val("");
                $("#confirmPassErr").fadeOut(3000);
                return;
        }

        if($("#birthday").val()==""){
                $("#birthday").focus();
                $("#birthdayErr").show();
                $("#birthdayErr").text("Birthday is required");
                $("#birthdayErr").fadeOut(3000);
                return;
        }

        if($("input[type='radio'][name='skill']:checked").val()==null){
                $("#birthdayErr").show();
                $("#birthdayErr").text("Please tell us your skill level:)");
                $("#birthdayErr").fadeOut(3000);
        }

        var times = [];
        const checkboxes = $("input[type='checkbox'][name='playtimebox']:checked").each(function(){
                times.push(this.value);
        });

        $.ajax({
                method: "POST",
                url: "/api/register",
                data: JSON.stringify({"birthday":$("#birthday").val(), 
                                "skill":$("input[type='radio'][name='skill']:checked").val(),
                                "prefer_time":times}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));


                $("#registatus").text("Registration completed! Coming back to Login page");
                $("#registatus").fadeOut(2000, function(){
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

