var stage=null;
var view = null;
var interval=null;
var credentials={ "username": "", "password":"" };
const USER_EXIST = 23505;
function setupGame(){
	stage=new Stage(document.getElementById('stage'));

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKey);
        document.addEventListener('keyup', stopByKey);
        document.addEventListener('mousemove', moveByMouse);
        document.addEventListener('mouseup', clickByMouse);
}

// function startGame(){
// 	interval=setInterval(function(){stage.step(); stage.draw(); },100);
// }

function startGame(){
	interval=setInterval(function(){
                stage.step(); 
                stage.draw();
                if (stage.getState() == -1 || stage.getState() == 1) {
                        pauseGame();
                        console.log("game finish");
                }},
        100);
}

function pauseGame(){
	clearInterval(interval);
	interval=null;
}

function endGame() {
	clearInterval(interval);
	interval = null;
}

function moveByKey(event){
	var key = event.key;
	var moveMap = { 
                'a': new Pair(-20,0),
                's': new Pair(0,20),
                'd': new Pair(20,0),
                'w': new Pair(0,-20),
	};
	if(key in moveMap){
		stage.player.velocity=moveMap[key];
	}
}

function stopByKey(event) {
        var key = event.key;
	var moveMap = { 
                'a': new Pair(0,0),
                's': new Pair(0,0),
                'd': new Pair(0,0),
                'w': new Pair(0,0),
	};
	if(key in moveMap){
		stage.player.velocity=moveMap[key];
	}    
}

function clickByMouse(event) {
        if (event.button == 0) {
                var left_boundary = stage.canvas.getBoundingClientRect().left;
                var top_boundary = stage.canvas.getBoundingClientRect().top;
                var x = event.clientX - left_boundary;
                var y = event.clientY - top_boundary; 
                if (x > 0 && x < 800 && y > 0 && y < 800 && event.clientY >= 75) {
                        stage.player.fire();
                }
        }
}

function moveByMouse(event){
        var left_boundary = stage.canvas.getBoundingClientRect().left;
        var top_boundary = stage.canvas.getBoundingClientRect().top;
        var x = event.clientX - left_boundary;
	var y = event.clientY - top_boundary; 
        if (x > 0 && x < 800 && y > 0 && y < 800) {
                var volx = x - stage.player.x;
                var voly = y - stage.player.y;
                var divide = Math.max(Math.abs(volx), Math.abs(voly)) / 20;
                volx = volx / divide;
                voly = voly / divide;
                stage.player.mousex = volx;
                stage.player.mousey = voly;
        }
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

        	// $("#ui_login").hide();
                // $("#ui_register").hide();
        	// $("#ui_play").show();

		// setupGame();
		// startGame();
                $("#username").val("");
                $("#password").val("");
                setupGame();
                play();

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
                        displayUI("#ui_login");
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

function play(){
        $.ajax({
                method: "POST",
                url: "/api/auth/play",
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));

                displayUI("#ui_play");
		startGame();

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

function getInstruction(){
        $.ajax({
                method: "POST",
                url: "/api/auth/instruction",
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                console.log("get to instructions")
                pauseGame();
                displayUI("#ui_instructions");

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

function getStats(){
        $.ajax({
                method: "GET",
                url: "/api/auth/stats/" + credentials.username,
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                
                pauseGame();
                displayUI("#ui_stats");

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

function getProfile(){
        $.ajax({
                method: "GET",
                url: "/api/auth/profile/" + credentials.username,
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                pauseGame();
                $("#profileGreeting").text("Hi " + data.username + String.fromCodePoint(0x1F609));
                $("#profileSkill").text(data.skill);
                $("#profileBirthday").text(data.birthdayre);
                $("#profilePlaytime").text(data.prefer_time);
                console.log(data.username);
                displayUI("#ui_profile");

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

function logout(){
        $.ajax({
                method: "POST",
                url: "/api/auth/logout",
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                credentials={ "username": "", "password":"" };
        	displayUI("#ui_login");
                endGame();

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
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

        	displayUI("#ui_register");

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

        	displayUI("#ui_login");

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

function displayUI(ui){
        /**
         * This function takes a id for a ui div element
         * in index.html, modify other elements' properties
         * so that only the ui with this id is displayed.
         *
         */
        $('div[class="ui"]').not(ui).each(function(){
                $(this).hide();
        });
        $(ui).show();
        if(ui!="#ui_login" && ui!="#ui_register"){
                $("#navigation").show();
                var selectedNavbtn = "#" + ui.split("_")[1] + "Nav";
                $('button[class="navbtn"]').not(selectedNavbtn).each(function(){
                        $(this).css({"background-color": "black", "color":"white"});
                })
                $(selectedNavbtn).css({"background-color": "white", "color":"black"});
        }else{
                $("#navigation").hide();
        }
}

$(function(){
        // Setup all events here and display the appropriate UI
        $("#loginSubmit").on('click',function(){ login(); });
        $("#registerSubmit").on('click',function(){ register(); });
        $("#gotoRegister").on('click',function(){ go_register(); });
        $("#gotoLogin").on('click',function(){ go_login(); });
        $("#profileEdit").on('click',function(){ 
              $("#profileInfoViewing").hide();
              $("#profileInfoEditing").show();
              console.log("edit profile");
        });
        $("#profileSave").on('click',function(){ 
                $("#profileInfoViewing").show();
                $("#profileInfoEditing").hide();
                console.log("edit profile");
        });
        
        //Nav
        $("#playNav").on('click',function(){ play(); });
        $("#instructionsNav").on('click',function(){ getInstruction(); });
        $("#statsNav").on('click',function(){ getStats(); });
        $("#profileNav").on('click',function(){ getProfile(); });
        $("#logoutNav").on('click',function(){ logout(); });
        
        displayUI("#ui_login");
});

