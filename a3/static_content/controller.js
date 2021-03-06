//const client_model = require('./model');

var stage=null;
var view = null;
var interval=null;
var socket = null;
var credentials={ "username": "", "password":"" };
const USER_EXIST = 23505;
const TIMEOUT = 2300;
//$('html,body').css('cursor','crosshair');
function setupGame(){
        stage=new Stage(document.getElementById('stage'));
        // https://javascript.info/keyboard-events
}

// function startGame(){
// 	interval=setInterval(function(){stage.step(); stage.draw(); },100);
// }

function startGame(){
	interval=setInterval(function(){
                stage.step(); 
                stage.draw();
                if (stage.getState() == -1 || stage.getState() == 1) {
                        endGame();
                        //console.log("game finish");
                        //$("#restartbtns").show();
                        if(!stage.saved){
                                saveGameRecord();
                                stage.saved = true;
                        }
                }},
        50);
}

function pauseGame(){
	clearInterval(interval);
	interval=null;
}

function endGame() {
	clearInterval(interval);
	interval = null;
        document.removeEventListener('keydown', moveByKey);
        document.removeEventListener('keyup', stopByKey);
        document.removeEventListener('mousemove', moveByMouse);
        document.removeEventListener('mouseup', clickByMouse);
}

function restartGame(){
        endGame();
        setupGame();
        initializeGame();
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
        if (key == 'r') {
                stage.player.switchWeapon(); 
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

function initializeGame(){
        var numNormal = $("#enemyNumSlider").val();
        var numSmart = $("#smartEnemyNumSlider").val();
        var numSmarter = $("#evenSmarterEnemyNumSlider").val();
        var numObstacle = $("#obstacleNumSlider").val();
        var numAmmobag= $("#ammoBagNumSlider").val();
        var playerHealthMul = $("#playerHealthMulSlider").val();
        var enemyHealthMul = $("#enemyHealthMulSlider").val();
        var DMGMul = $("#bulletDMGMulSlider").val();
        var difficulty = $("input[type='radio'][name='gset']:checked").val();

        var gameSetting = {
                "numNormal":numNormal,
                "numSmart":numSmart,
                "numSmarter":numSmarter,
                "numObstacle":numObstacle,
                "numAmmobag":numAmmobag,
                "playerHealthMul":playerHealthMul,
                "enemyHealthMul":enemyHealthMul,
                "DMGMul":DMGMul,
                "difficulty":difficulty,
                "initialize":true
        }
        //stage.setgameParamter(gameSetting);
        socket.send(JSON.stringify(gameSetting));

        document.addEventListener('keydown', moveByKey);
        document.addEventListener('keyup', stopByKey);
        document.addEventListener('mousemove', moveByMouse);
        document.addEventListener('mouseup', clickByMouse);
        $("#gameMain").show();
        $("#gameSetting").hide();
        //play();
        //num of ememy, bullet dmage, playler health, num of obstacle
}

function presetGameSetting(){
        $("#gameEasy").on('click', function(){
                $("#enemyNumSlider").val(3);
                $("#smartEnemyNumSlider").val(2);
                $("#evenSmarterEnemyNumSlider").val(1);
                $("#obstacleNumSlider").val(5);
                $("#ammoBagNumSlider").val(6);
                $("#playerHealthMulSlider").val(2);
                $("#enemyHealthMulSlider").val(0.5);
                $("#bulletDMGMulSlider").val(2);
                $(".slider").each(function(){
                        var Sldid = $(this).attr('id').split("Slider")[0];
                        $("#" + Sldid).text($(this).val());
                        $("#" + Sldid).text($(this).val());
                        
                });
        });

        $("#gameNormal").on('click', function(){
                $("#enemyNumSlider").val(5);
                $("#smartEnemyNumSlider").val(3);
                $("#evenSmarterEnemyNumSlider").val(3);
                $("#obstacleNumSlider").val(7);
                $("#ammoBagNumSlider").val(5);
                $("#playerHealthMulSlider").val(1);
                $("#enemyHealthMulSlider").val(1);
                $("#bulletDMGMulSlider").val(1);
                $(".slider").each(function(){
                        var Sldid = $(this).attr('id').split("Slider")[0];
                        $("#" + Sldid).text($(this).val());
                        $("#" + Sldid).text($(this).val());
                        
                });
        });

        $("#gameHard").on('click', function(){
                $("#enemyNumSlider").val(5);
                $("#smartEnemyNumSlider").val(5);
                $("#evenSmarterEnemyNumSlider").val(5);
                $("#obstacleNumSlider").val(7);
                $("#ammoBagNumSlider").val(4);
                $("#playerHealthMulSlider").val(0.5);
                $("#enemyHealthMulSlider").val(2);
                $("#bulletDMGMulSlider").val(1);
                $(".slider").each(function(){
                        var Sldid = $(this).attr('id').split("Slider")[0];
                        $("#" + Sldid).text($(this).val());
                        $("#" + Sldid).text($(this).val());
                        
                });
        });
        $("#gameNormal").prop('checked', true);
        //$("#restartbtns").hide();
}

function saveGameRecord(){
        //var endtime = new Date().toISOString();
        var endtime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
        $.ajax({
                method: "POST",
                url: "/api/auth/stats/" + credentials.username,
                data: JSON.stringify({
                        "gamescore":stage.player.score,
                        "difficulty":stage.difficulty,
                        "endtime":endtime
                }),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

function login(){
	credentials =  { 
		"username": $("#username").val().trim(), 
		"password": $("#password").val() 
	};

        if(credentials.username==""){
                $("#username").focus();
                $("#loginuserNameErr").show();
                $("#loginuserNameErr").text("User name is required");
                $("#loginuserNameErr").fadeOut(TIMEOUT);
                return;
        }

        if(credentials.password==""){
                $("#password").focus();
                $("#loginPassErr").show();
                $("#loginPassErr").text("Password is required");
                $("#loginPassErr").fadeOut(TIMEOUT);
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

                $("#username").val("");
                $("#password").val("");
                $("#gameMain").hide();
                $("#gameSetting").show();
                displayUI("#ui_play");
                setupGame();
                socket = new WebSocket(`ws://${window.location.hostname}:8001`);
                socket.onopen = function (event) {
                        console.log("connected");
                };
                socket.onclose = function (event) {
                        alert("closed code:" + event.code + " reason:" +event.reason + " wasClean:"+event.wasClean);
                };
                socket.onmessage = function (event) {
                        console.log("addd");
                }
                initializeGame();
                play();


        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
                $("#password").focus();
                $("#loginuserNameErr").show();
                $("#loginuserNameErr").text("User name or password is incorrect");
                $("#password").val("");
                $("#loginuserNameErr").fadeOut(TIMEOUT);
        });
}

function register(){
	credentials =  { 
		"username": $("#createUser").val().trim(), 
		"password": $("#createPassword").val()
	};

        if(credentials.username==""){
                $("#createUser").focus();
                $("#userNameErr").show();
                $("#userNameErr").text("User name is required or can not be space only");
                $("#userNameErr").fadeOut(TIMEOUT);
                return;
        }
        
        if(credentials.password==""){
                $("#createPassword").focus();
                $("#passwordErr").show();
                $("#passwordErr").text("Password is required");
                $("#passwordErr").fadeOut(TIMEOUT);
                return;
        }

        if($("#confirmPassword").val()==""){
                $("#confirmPassword").focus();
                $("#confirmPassErr").show();
                $("#confirmPassErr").text("Please enter your password again");
                $("#confirmPassErr").fadeOut(TIMEOUT);
                return;
        }

        if($("#confirmPassword").val()!="" && credentials.password!="" && $("#confirmPassword").val()!=credentials.password){
                $("#confirmPassword").focus();
                $("#confirmPassErr").show();
                $("#confirmPassErr").text("The passwords do not match");
                $("#confirmPassword").val("");
                $("#confirmPassErr").fadeOut(TIMEOUT);
                return;
        }

        if($("#birthday").val()==""){
                $("#birthday").focus();
                $("#birthdayErr").show();
                $("#birthdayErr").text("Birthday is required");
                $("#birthdayErr").fadeOut(TIMEOUT);
                return;
        }

        if($("input[type='radio'][name='skill']:checked").val()==null){
                $("#birthdayErr").show();
                $("#birthdayErr").text("Please tell us your skill level:)");
                $("#birthdayErr").fadeOut(TIMEOUT);
                return;
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

                $("#registatus").show();
                $("#registatus").text("Registration completed! Coming back to Login page");
                $("#registatus").fadeOut(TIMEOUT, function(){
                        displayUI("#ui_login");
                        clearRegisterForm();
                })


        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
                if(err.responseJSON.error.code==USER_EXIST){
                        $("#createUser").focus();
                        $("#userNameErr").show();
                        $("#userNameErr").text("User name alredy exist");
                        $("#userNameErr").fadeOut(TIMEOUT);
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
                if($("#gameSetting").is(":hidden")){
                        startGame();
                }
		

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
                //console.log("get to instructions")
                pauseGame();
                displayUI("#ui_instructions");

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

function getStats(){
        $.ajax({
                method: "GET",
                url: "/api/auth/stats",
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                
                pauseGame();
                displayUI("#ui_stats");

                $(".newLeaders").remove();

                //console.log(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}));
                var easyCount = 0;
                var normalCount = 0;
                var hardCount = 0;
                data.forEach(function(record){
                        if(record["difficulty"]=="easy" && easyCount<10){
                                easyCount+=1;
                                var row = "<tr class='newLeaders'><th><label>" + easyCount + "</label></th><td>" + record["username"] + 
                                "</td><td>" + record["gamescore"] + "</td><td>" + record["endtime"] + "</td></tr>";
                                $(row).appendTo("#easyGames");
                        }else if(record["difficulty"]=="normal" && normalCount<10){
                                normalCount+=1;
                                var row = "<tr class='newLeaders'><th><label>" + normalCount + "</label></th><td>" + record["username"] + 
                                "</td><td>"+ record["gamescore"] + "</td><td>" + record["endtime"] + "</td></tr>";
                                $(row).appendTo("#normalGames");
                        }else if(record["difficulty"]=="hard" && hardCount<10){
                                hardCount+=1;
                                var row = "<tr class='newLeaders'><th><label>" + hardCount + "</label></th><td>" + record["username"] + 
                                "</td><td>"+ record["gamescore"] + "</td><td>" + record["endtime"] + "</td></tr>";
                                $(row).appendTo("#hardGames");
                        }
                });

                //var foo = $("<tr><th><label>Birthday:</label></th></tr>").appendTo("#easyGames");
                

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
                //console.log(data.prefer_time);

                if(data.prefer_time.length==0){
                        $("#profilePlaytime").text("You don't have any preferded time");    
                }else{
                        $("#profilePlaytime").text(data.prefer_time);
                }

                $("#profileInfoViewing").show();
                $("#profileInfoEditing").hide();

                displayUI("#ui_profile");

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

function prefillProfileSetting(){
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

                $("#changeUserName").val(data.username);
                $("#newBirthday").val(data.birthdayre);
                $("#profile" + data.skill).prop('checked', true);
                $(".profileSettingplaytime").each(function(){
                        $(this).prop('checked', false);
                })
                data.prefer_time.forEach(function(time){
                        $("#p" + time + "box").prop('checked', true);
                });

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

function updateProfile(){

        var username = $("#changeUserName").val().trim();

        if(username==""){
                $("#changeUserName").focus();
                $("#editingStatus").show();
                $("#editingStatus").text("User name is required or can not be space only");
                $("#editingStatus").fadeOut(TIMEOUT);
                return;
        }

        var times = [];
        $("input[type='checkbox'][class='profileSettingplaytime']:checked").each(function(){
                times.push(this.value);
        });

        var originalPass = $("#originalPassword").val();
        var newPass = $("#newPassword").val();
        var confirmNewPass = $("#confirmNewPassword").val();
        var changePass;

        if(originalPass!="" && newPass!="" && confirmNewPass!=""){
                if(originalPass!=credentials.password){
                        $("#originalPassword").focus();
                        $("#editingStatus").show();
                        $("#editingStatus").text("Password incorrect");
                        $("#editingStatus").fadeOut(TIMEOUT);
                        return;
                }

                if(newPass!=confirmNewPass){
                        $("#confirmNewPassword").focus();
                        $("#editingStatus").show();
                        $("#editingStatus").text("The passwords do not match");
                        $("#confirmNewPassword").val("");
                        $("#editingStatus").fadeOut(TIMEOUT);
                        return;
                }
                changePass = true;
                var payload = JSON.stringify({"birthday":$("#newBirthday").val(), 
                        "skill":$("input[type='radio'][name='pskill']:checked").val(),
                        "prefer_time":times,
                        "originalUsername":credentials.username,
                        "newUsername":username,
                        "newpassword":newPass,
                        "changePass":changePass
                });
        }else{
                changePass = false;
                var payload = JSON.stringify({"birthday":$("#newBirthday").val(), 
                        "skill":$("input[type='radio'][name='pskill']:checked").val(),
                        "prefer_time":times,
                        "originalUsername":credentials.username,
                        "newUsername":username,
                        "changePass":changePass
                });
        }

        $.ajax({
                method: "PUT",
                url: "/api/auth/profile/" + credentials.username,
                data: payload,
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                $("#originalPassword").val("");
                $("#newPassword").val("");
                $("#confirmNewPassword").val("");

                credentials.username = username;
                if(changePass){
                        credentials.password = newPass;
                }
                getProfile();

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
                if(err.responseJSON.error.code==USER_EXIST){
                        $("#changeUserName").focus();
                        $("#editingStatus").show();
                        $("#editingStatus").text("User name alredy exist");
                        $("#editingStatus").fadeOut(TIMEOUT);
                }
        });
}

function deleteProfile(){
        $.ajax({
                method: "DELETE",
                url: "/api/auth/profile/" + credentials.username,
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));

                $("#editingStatus").show();
                $("#editingStatus").text("Account deleted!");
                $("#editingStatus").fadeOut(TIMEOUT, function(){
                        credentials={ "username": "", "password":"" };
        	        displayUI("#ui_login");
                        endGame();
                });

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

function clearRegisterForm(){
        $("#createUser").val("");
        $("#createPassword").val("");
        $("#confirmPassword").val("");
        $("#birthday").val("");
        $("input[type='radio'][name='skill']:checked").prop('checked', false);
        $("input[type='checkbox'][name='playtimebox']:checked").each(function(){
                $(this).prop('checked', false);
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
                        $(this).css({"background-color": "#12175e", "color":"white"});
                })
                $(selectedNavbtn).css({"background-color": "white", "color":"#12175e"});
        }else{
                $("#navigation").hide();
        }
}

function displayConfirm(indication){
        if(indication){
                $("#confirmDelete").show();
                $("#profileDelete").hide(); 
        }else{
                $("#confirmDelete").hide();
                $("#profileDelete").show();
        }
}

$(function(){
        // Setup all events here and display the appropriate UI

        //Login and register
        $("#loginSubmit").on('click',function(){ login(); });
        $("#registerSubmit").on('click',function(){ register(); });
        $("#gotoRegister").on('click',function(){ go_register(); });
        $("#gotoLogin").on('click',function(){ go_login(); });

        //Profile
        $("#profileEdit").on('click',function(){
                $("#profileInfoViewing").hide();
                $("#profileInfoEditing").show();
                displayConfirm(false);
                prefillProfileSetting();
        });
        $("#profileSave").on('click',function(){
                displayConfirm(false);
                updateProfile();
        });
        $("#profileCancel").on('click',function(){ 
                $("#profileInfoViewing").show();
                $("#profileInfoEditing").hide();
                displayConfirm(false);
        });
        $("#profileDelete").on('click',function(){
                displayConfirm(true);
        });
        $("#confirmDelete").on('click',function(){ deleteProfile(); });
        
        //Nav
        $("#playNav").on('click',function(){ play(); });
        $("#instructionsNav").on('click',function(){ getInstruction(); });
        $("#statsNav").on('click',function(){ getStats(); });
        $("#profileNav").on('click',function(){ getProfile(); });
        $("#logoutNav").on('click',function(){ logout(); });

        //Game setting
        presetGameSetting();
        $(".slider").each(function(){
                var Sldid = $(this).attr('id').split("Slider")[0];
                $("#" + Sldid).text($(this).val());
                $(this).on('input', function(){
                        $("#" + Sldid).text($(this).val());
                });
        });
        $("#startGame").on('click', function(){ initializeGame() });

        //Game restart
        $("#restart").on('click', function(){ restartGame();});
        $("#restartNew").on('click', function(){
                $("#gameMain").hide();
                $("#gameSetting").show();
                endGame();
                setupGame();
        });
        
        displayUI("#ui_login");
});

