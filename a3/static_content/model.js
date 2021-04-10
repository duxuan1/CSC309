function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

// check two circle object overlap
// used by moving, shooting or other overlap check
function circle_interaction(x1, y1, r1, x2, y2, r2) {
	distance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);  
	rad_sum = (r1 + r2) * (r1 + r2);
	if (distance <= rad_sum) {
		return 1;
	}
	return 0;
}

class Stage {
	constructor(){
		//this.canvas = canvas;
		this.saved = false;
	
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		//this.player=null; // a special actor, the player
		this.player = [];
		this.enemies = [];
		this.obstacles = [];
		this.ammobags = [];
		this.state = 2; // 0: in progress, -1: loss, 1: win, 2: not started yet
		this.difficulty = 0; // 0: easy, 1: medium, 2: hard
		this.normalEnemyNum = 1;
		this.smartEnemyNum = 1;
		this.fuckingSmartEnemyNum = 1;
		this.obstacleNum = 1;
		this.ammobagNum = 1;
		this.playerHealthMul = 1;
		this.enemyHealthMul = 1;
		this.DMGMul = 1;


		// the logical width and height of the stage
		this.width=800;
		this.height=800;
	}

	addPlayer(playerName){
		// this.addActor(player);
		// //this.player=player;
		// this.player.push(player);

		// Add the player to the center of the stage
		var velocity = new Pair(0,0);
		var radius = 15;
		var colour= 'rgba(0,0,0,1)';
		var position = new Pair(Math.floor(this.width/2), Math.floor(this.height/2));
		var newPlayer = new Player(this, position, velocity, colour, radius, playerName);
		newPlayer.health *= this.playerHealthMul;
		this.addActor(newPlayer);
		this.player.push(newPlayer);
	}

	removePlayer(){
		this.removeActor(this.player);
		this.player=null;
	}

	addActor(actor){
		this.actors.push(actor);
	}

	remove_from_enemies(actor) {
		var index=this.enemies.indexOf(actor);
		if(index!=-1){
			this.enemies.splice(index,1);
		}	
	}

	remove_from_obstacles(actor) {
		var index=this.obstacles.indexOf(actor);
		if(index!=-1){
			this.obstacles.splice(index,1);
		}		
	}

	remove_from_ammobags(actor) {
		var index=this.ammobags.indexOf(actor);
		if(index!=-1){
			this.ammobags.splice(index,1);
		}	
	}

	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}

	check_position_taken(x, y, radius) {
		var i;
		for (i = 0; i < this.actors.length; i++) {
			var actor = this.actors[i]
			if (circle_interaction(x, y, radius, actor.x, actor.y, actor.radius)) {
				return 1;
			}
		}
		return 0;
	}

	addEnemies(number) {
		var i;
		for (i = 0; i < number; i++) {
			var x=Math.floor((Math.random()*this.width)); 
			var y=Math.floor((Math.random()*this.height)); 
			var radius = 10;
			var check_position = this.check_position_taken(x, y, radius);
			while (check_position == 1 || x <=75 || y <= 100) {
				x=Math.floor((Math.random()*this.width)); 
				y=Math.floor((Math.random()*this.height)); 
				check_position = this.check_position_taken(x, y, radius);
			}
			var velocity = new Pair(rand(5), rand(5));
			var colour= 'rgba(225,0,0,1)';
			var position = new Pair(x,y);
			var enemy = new Enemy(this, position, velocity, colour, radius);
			//console.log(enemy);
			this.addActor(enemy);
			this.enemies.push(enemy);
		}
	}

	addSmartEnemies(number) {
		var i;
		for (i = 0; i < number; i++) {
			var x=Math.floor((Math.random()*this.width)); 
			var y=Math.floor((Math.random()*this.height)); 
			var radius = 10;
			var check_position = this.check_position_taken(x, y, radius);
			while (check_position == 1 || x <=75 || y <= 100) {
				x=Math.floor((Math.random()*this.width)); 
				y=Math.floor((Math.random()*this.height)); 
				check_position = this.check_position_taken(x, y, radius);
			}
			var velocity = new Pair(rand(5), rand(5));
			var colour= 'rgba(225,225,0,1)';
			var position = new Pair(x,y);
			var enemy = new SmartEnemy(this, position, velocity, colour, radius);
			this.addActor(enemy);
			this.enemies.push(enemy);
		}
	}

	addFuckingSmartEnemies(number) {
		var i;
		for (i = 0; i < number; i++) {
			var x=Math.floor((Math.random()*this.width)); 
			var y=Math.floor((Math.random()*this.height)); 
			var radius = 10;
			var check_position = this.check_position_taken(x, y, radius);
			while (check_position == 1 || x <=75 || y <= 100) {
				x=Math.floor((Math.random()*this.width)); 
				y=Math.floor((Math.random()*this.height)); 
				check_position = this.check_position_taken(x, y, radius);
			}
			var velocity = new Pair(rand(5), rand(5));
			var colour= 'rgba(0,225,225,1)';
			var position = new Pair(x,y);
			var enemy = new FuckingSmartEnemy(this, position, velocity, colour, radius);
			this.addActor(enemy);
			this.enemies.push(enemy);
		}
	}

	addObstacles(number) {
		var i;
		for (i = 0; i < number; i++) {
			var x=Math.floor((Math.random()*this.width)); 
			var y=Math.floor((Math.random()*this.height)); 
			var radius = 50;
			var check_position = this.check_position_taken(x, y, radius);
			while (check_position == 1 || x <=75 || y <= 100) {
				x=Math.floor((Math.random()*this.width)); 
				y=Math.floor((Math.random()*this.height)); 
				check_position = this.check_position_taken(x, y, radius);
			}
			var velocity = new Pair(0, 0);
			var colour= 'rgba(225,225,225,1)';
			var position = new Pair(x,y);
			var obstacle = new Obstacle(this, position, velocity, colour, radius);
			this.addActor(obstacle);
			this.obstacles.push(obstacle);
		}
	}

	addAmmoBags(number) {
		var i;
		for (i = 0; i < number; i++) {
			var x=Math.floor((Math.random()*this.width)); 
			var y=Math.floor((Math.random()*this.height));
			var radius = 15; 
			var check_position = this.check_position_taken(x, y, radius);
			while (check_position == 1 || x <=75 || y <= 100) {
				x=Math.floor((Math.random()*this.width)); 
				y=Math.floor((Math.random()*this.height)); 
				check_position = this.check_position_taken(x, y, radius);
			}
			var velocity = new Pair(0, 0);
			var colour= 'rgba(0,225,0,1)';
			var position = new Pair(x,y);
			var ammobag = new AmmoBag(this, position, velocity, colour, radius);

			this.addActor(ammobag);
			this.ammobags.push(ammobag);
		}
	}

	movePlayer(player, velocity){
		this.player.forEach((p)=>{
			if(p.name==player){
				p.velocity = velocity;
			}
		});
	}

	aimPlayer(player, aimx, aimy){
		this.player.forEach((p)=>{
			if(p.name==player){
				p.mousex = aimx;
				p.mousey = aimy;
			}
		});
	}

	firePlayer(player){
		this.player.forEach((p)=>{
			if(p.name==player){
				p.fire();
			}
		});
	}


	switchWeapon(player){
		this.player.forEach((p)=>{
			if(p.name==player){
				p.switchWeapon();
			}
		});

	checkPlayerHealth() {
        var i;
        for (i = 0; i < this.player.length; i++) {
                if (this.player[i].health <= 0) {
                        var p = this.player[i];
                        this.player.splice(i, 1);
                        this.removeActor(p);
                }
        }
	}

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
	// NOTE: Careful if an actor died, this may break!
	step(){
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
			this.checkPlayerHealth();
		}
		if (this.player.length == 0) {
			this.state = -1;
		} else if (this.enemies.length == 0) {
			this.state = 1;
		} else {
			this.state = 0;
		}
	}

	draw(){
		var context = this.canvas.getContext('2d');
		context.clearRect(0, 0, this.width, this.height);
		if (this.getState() == 1) {
			context.font = 'normal bold 5em courier';
			var text = "you win";
			context.fillText(text, 200, 400);
		} else if (this.getState() == -1) {
			context.font = 'normal bold 5em courier';
			var text = "you lose";
			context.fillText(text, 200, 400);
		} else {
			for(var i=0;i<this.actors.length;i++){
				this.actors[i].draw(context);
			}
		}
	}

	// notify controller by game states
	getState() {
		return this.state;
	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
	}

	loadCurrentSetting(){
		// Add enemies
		this.addEnemies(this.normalEnemyNum);
		// Add obstacles
		this.addObstacles(this.obstacleNum);
		// Add ammobags
		this.addAmmoBags(this.ammobagNum);
		// Add smart Enemy
		this.addSmartEnemies(this.smartEnemyNum);
		this.addFuckingSmartEnemies(this.fuckingSmartEnemyNum);

		this.state = 0;
	}

	setgameParamter(parameter){
		this.normalEnemyNum = parameter["numNormal"];
		this.smartEnemyNum = parameter["numSmart"];
		this.fuckingSmartEnemyNum = parameter["numSmarter"];
		this.obstacleNum = parameter["numObstacle"];
		this.ammobagNum = parameter["numAmmobag"];
		this.playerHealthMul = parameter["playerHealthMul"];
		this.enemyHealthMul = parameter["enemyHealthMul"];
		this.DMGMul = parameter["DMGMul"];
		this.difficulty = parameter["difficulty"];
		this.addPlayer(parameter["player"]);	
		this.loadCurrentSetting();
	}

	getModelState(){
		var currentState = [];
		var actorInfo = null;
		this.actors.forEach(function(actor){
			if(actor instanceof Enemy){
				actorInfo = {
					"type":'Enemy',
					"colour": actor.colour,
					"position":actor.position,
					"radius":actor.radius,
					"health":actor.health
				};
				currentState.push(actorInfo);
			}else if(actor instanceof Player){
				actorInfo = {
					"type":'Player',
					"colour": actor.colour,
					"position":actor.position,
					"radius":actor.radius,
					"health":actor.health,
					"x":actor.x,
					"y":actor.y,
					"mousex":actor.mousex,
					"mousey":actor.mousey,
					"weapon":actor.weapon,
					"ammunition":actor.ammunition,
					"score":actor.score,
					"enemyCount":actor.stage.enemies.length,
					"name":actor.name
				};
				currentState.push(actorInfo);
			}else if(actor instanceof AmmoBag){
				actorInfo = {
					"type":'AmmoBag',
					"colour": actor.colour,
					"position":actor.position,
					"radius":actor.radius,
				};
				currentState.push(actorInfo);
			}else{
				actorInfo = {
					"type":'Other',
					"colour": actor.colour,
					"position":actor.position,
					"radius":actor.radius,
				};
				currentState.push(actorInfo);
			}
		});
		return currentState;
	}
} // End Class Stage

class Pair {
	constructor(x,y){
		this.x=x; this.y=y;
	}

	toString(){
		return "("+this.x+","+this.y+")";
	}

	normalize(){
		var magnitude=Math.sqrt(this.x*this.x+this.y*this.y);
		this.x=this.x/magnitude;
		this.y=this.y/magnitude;
	}
}

class Ball {
	constructor(stage, position, velocity, colour, radius){
		this.stage = stage;
		this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position

		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
	}
	
	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}

	hitWall() {
		// bounce off the walls
		if(this.position.x<0){
			this.position.x=0;
			this.velocity.x=Math.abs(this.velocity.x);
		}
		if(this.position.x>this.stage.width){
			this.position.x=this.stage.width;
			this.velocity.x=-Math.abs(this.velocity.x);
		}
		if(this.position.y<0){
			this.position.y=0;
			this.velocity.y=Math.abs(this.velocity.y);
		}
		if(this.position.y>this.stage.height){
			this.position.y=this.stage.height;
			this.velocity.y=-Math.abs(this.velocity.y);
		}	
	}


	// when ball moves, it may hit obstacles, check all
	// obstacles and then move
	move() {
		this.hitWall();

		var next_pos = new Pair(this.position.x+this.velocity.x, 
			this.position.y+this.velocity.y);
		var i;
		var obstacles_array = this.stage.obstacles;
		var check = 0;
		for (i = 0; i < obstacles_array.length; i++) {
			var obs = obstacles_array[i];
			if (circle_interaction(next_pos.x, next_pos.y, this.radius, 
				obs.x, obs.y, obs.radius) == 1) {
				check = 1;
				break;
			}
		}
		if (check != 1) {
			this.position.x=this.position.x+this.velocity.x;
			this.position.y=this.position.y+this.velocity.y;
		} else {
			this.position.x=this.position.x-this.velocity.x;
			this.position.y=this.position.y-this.velocity.y;
			this.velocity.x = -this.velocity.x;
			this.velocity.y = -this.velocity.y;	
		}
		this.intPosition();
	}

	step(){
		this.move();
	}

	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
	draw(context){
		context.fillStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();   
	}
}

class Obstacle extends Ball {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.health = 30;
	}
}

class Bullet extends Ball {

	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.damage = 10 * this.stage.DMGMul;
		this.distance = 0;
	}

	hitObstacle() {
		var i;
		var obstacles_array = this.stage.obstacles;
		// loop through obstacle array to see if bullet hit one obstacle
		for (i = 0; i < obstacles_array.length; i++) {
			var obs = obstacles_array[i];
			if (circle_interaction(this.x, this.y, this.radius, obs.x, obs.y, obs.radius) == 1) {
				// remove bullet when hit obstacle
				this.stage.removeActor(this);
				// destroy obstacle by three hits
				obs.health -= 10;
				if (obs.health <= 0) {
					this.stage.removeActor(obs);
					this.stage.remove_from_obstacles(obs);
				} 
			}
		}
	}

	hitWall() {
		// disappear when hit wall
		if(this.position.x<0) {this.stage.removeActor(this);}
		if(this.position.x>this.stage.width) {this.stage.removeActor(this);}
		if(this.position.y<0) {this.stage.removeActor(this);}
		if(this.position.y>this.stage.height) {this.stage.removeActor(this);}
		this.intPosition();
	}

	step() {
		// first check all possible action, then move
		this.killEnemy();
		this.hitObstacle();
		this.hitWall();
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
		if (this.distance > 10) {
			this.stage.removeActor(this);
		}
		this.distance += 1;
		this.intPosition();
	}
}

class EnemyBullet extends Bullet {
	// enemy bullet only give damage to player
	killEnemy() {
		// var enemy = this.stage.player;
		// if (circle_interaction(this.x, this.y, this.radius, enemy.x, enemy.y, enemy.radius) == 1) {
		// 	// remove enemy and bullet
		// 	this.stage.player.health -= this.damage;
		// 	this.stage.removeActor(this);
		// }

		var enemies = this.stage.player;
		enemies.forEach((enemy)=>{
			if (circle_interaction(this.x, this.y, this.radius, enemy.x, enemy.y, enemy.radius) == 1) {
				// remove enemy bullet after a hit
				enemy.health -= this.damage;
				this.stage.removeActor(this);
			}
		});
	}

	step() { // enemy bullet will not damage obstacles
		this.killEnemy();
		this.hitWall();
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
		if (this.distance > 10) {
			this.stage.removeActor(this);
		}
		this.distance += 1;
		this.intPosition();
	}
}

class PlayerBullet extends Bullet{
	constructor(stage, position, velocity, colour, radius, origin){
		super(stage, position, velocity, colour, radius);
		this.damage = 10 * this.stage.DMGMul;
		this.distance = 0;
		this.origin = origin;
	}

	killEnemy() {
		var i;
		var enemies_array = this.stage.enemies;
		// loop through enemy array to see if bullet hit one enemy
		for (i = 0; i < enemies_array.length; i++) {
			var enemy = this.stage.enemies[i];
			if (circle_interaction(this.x, this.y, this.radius, enemy.x, enemy.y, enemy.radius) == 1) {
				// remove bullet
				this.stage.removeActor(this);
				// destroy enemy and remove it
				enemy.health -= this.damage;
				if (enemy.health <= 0) {
					this.stage.removeActor(enemy);
					this.stage.remove_from_enemies(enemy);
				} 		
				// killed enemy, add score to player
				this.origin.score += 1;
			}
		}
	}
}

class Cannonball extends PlayerBullet {
	constructor(stage, position, velocity, colour, radius, origin){
		super(stage, position, velocity, colour, radius, origin);
		this.damage = 30 * this.stage.DMGMul;
		this.distance = 0;
	}

	// cannon ball wont disappare when hit an enemy
	killEnemy() {
		var i;
		var enemies_array = this.stage.enemies;
		// loop through enemy array to see if bullet hit one enemy
		for (i = 0; i < enemies_array.length; i++) {
			var enemy = this.stage.enemies[i];
			if (circle_interaction(this.x, this.y, this.radius, enemy.x, enemy.y, enemy.radius) == 1) {
				// destroy enemy and remove it
				enemy.health -= this.damage;
				if (enemy.health <= 0) {
					this.stage.removeActor(enemy);
					this.stage.remove_from_enemies(enemy);
				} 		
				// killed enemy, add score to player
				this.origin.score += 1;
			}
		}
	}

	step() {
		this.killEnemy();
		this.hitObstacle();
		this.hitWall();
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
		if (this.distance > 20) {
			this.stage.removeActor(this);
		}
		this.distance += 1;
		this.intPosition();

	}
}

class AmmoBag extends Ball {
	draw(context){
		context.fillStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();   

		context.font = 'normal bold 0.8em courier';
		var text = "Ammo Bag";
		context.fillText(text, this.x - 2 * this.radius, this.y + this.radius * 1.5);
	}
}

class Player extends Ball {
	constructor(stage, position, velocity, colour, radius, name){
		super(stage, position, velocity, colour, radius);
		this.mousex = 0;
		this.mousey = 0;
		this.health = 100;
		this.ammunition = 10;
		this.score = 0;
		this.weapon = 0; // 0: default weapon, 1: shotgun, 2: cannon
		this.warning = "";
		this.name = name;
	}

	switchWeapon() {
		this.weapon += 1;
		this.weapon %= 3;
	}

	hitAmmoBag() {
		var i;
		var ammobag_array = this.stage.ammobags;
		// loop through enemy array to see if bullet hit one enemy
		for (i = 0; i < ammobag_array.length; i++) {
			var bag = this.stage.ammobags[i];
			if (circle_interaction(this.x, this.y, this.radius, bag.x, bag.y, bag.radius) == 1) {
				// add ammo to player
				this.ammunition += 10;
				// remove bag
				this.stage.remove_from_ammobags(bag);
				this.stage.removeActor(bag);
			}
		}	
	}

	fire() {
		if (this.ammunition > 0) {
			var radius = 5;
			var colour= 'rgba(0,0,0,1)';
			var player_position = this.position;
			var position = new Pair(player_position.x, player_position.y);
			if (this.weapon == 0) {
				// create a bullet, display on the stage
				var velocity = new Pair(this.mousex, this.mousey);
				var b = new PlayerBullet(this.stage, position, velocity, colour, radius, this);
				this.stage.addActor(b);
				this.ammunition -= 1;
			} else if (this.weapon == 1 && this.ammunition >= 3) {
				// create three bullet, display on the stage
				var v1 = new Pair(this.mousex - 5, this.mousey);
				var v2 = new Pair(this.mousex , this.mousey);
				var v3 = new Pair(this.mousex + 5, this.mousey);
				var b1 = new PlayerBullet(this.stage, position, v1, colour, radius, this);
				var b2 = new PlayerBullet(this.stage, new Pair(player_position.x - 5, player_position.y + 5), v2, colour, radius, this);
				var b3 = new PlayerBullet(this.stage,new Pair(player_position.x + 5, player_position.y + 5), v3, colour, radius, this);
				this.stage.addActor(b1);
				this.stage.addActor(b2);
				this.stage.addActor(b3);
				this.ammunition -= 3;
			} else if (this.weapon == 2 && this.ammunition >= 5) {
				// create a big bullet, display on the stage
				var velocity = new Pair(this.mousex, this.mousey);
				var b = new Cannonball(this.stage, position, velocity, colour, 30);
				this.stage.addActor(b);
				this.ammunition -= 5;
			}
		}
	}

	step() {
		this.hitAmmoBag();
		this.move();
	}

	draw(context){
		// shape
		context.fillStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();   
		context.beginPath(); 
		context.arc(this.x + this.mousex / 2, this.y + this.mousey / 2, this.radius / 1.5, 0, 2 * Math.PI, false); 
		context.fill();   

		// text display for health, ammo, weapon and score
		context.font = 'normal bold 0.8em courier';
		var HP_text = "HP " + this.health;
		context.fillText(HP_text, this.x - 1.5 * this.radius, this.y + this.radius * 2);

		context.font = 'normal bold 0.8em courier';
		context.fillText(this.name, this.x - 1.5 * this.radius, this.y - this.radius * 2);

		var weapon_text;
		if (this.weapon == 0) {
			weapon_text = "pistol " + this.ammunition;
		} else if (this.weapon == 1) {
			weapon_text = "shotgun " + this.ammunition;
		} else {
			weapon_text = "cannon " + this.ammunition;
		}
		context.fillText(weapon_text, this.x - 2 * this.radius, this.y + this.radius * 3);
		
		context.font = 'normal bold 1em courier';

		var Score = "Score "  + this.score;
		context.fillText(Score, 0, 25);
		var enemycount = "Enemy Left "  + this.stage.enemies.length;
		context.fillText(enemycount, 0, 50);
	}
}

class Enemy extends Ball {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.health = 10 * this.stage.enemyHealthMul;
		this.timer = randint(25);
	}

	fire() {
		// create a bullet, display on the stage
		var velocity = new Pair(rand(30) - 15, rand(30) - 15);
		var radius = 5;
		var colour= 'rgba(225,0,0,1)';
		var player_position = this.position;
		var position = new Pair(player_position.x, player_position.y);
		var b = new EnemyBullet(this.stage, position, velocity, colour, radius);
		this.stage.addActor(b);
	}

	step() {
		// bullet have certain range
		if (this.timer >= 25) {
			// create a bullet, display on the stage
			this.fire();
			this.timer = -1;
		}
		this.timer += 1;
		this.move();
	}

	draw(context){
		context.fillStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();   

		context.font = 'normal bold 0.8em courier';
		var HP_text = "HP " + this.health;
		context.fillText(HP_text, this.x - 2 * this.radius, this.y + this.radius * 2);
	}
}

class SmartEnemy extends Enemy {
	fire() {
		var volx = this.stage.player.x - this.x;
		var voly = this.stage.player.y - this.y;
		var divide = Math.max(Math.abs(volx), Math.abs(voly)) / 10;
		volx = volx / divide;
		voly = voly / divide;
		// create a bullet, display on the stage
		var velocity = new Pair(volx, voly);
		var radius = 5;
		var colour= 'rgba(225,225,0,1)';
		var player_position = this.position;
		var position = new Pair(player_position.x, player_position.y);
		var b = new EnemyBullet(this.stage, position, velocity, colour, radius);
		this.stage.addActor(b);
	}
}

class FuckingSmartEnemy extends SmartEnemy {
	fire() {
		var volx = this.stage.player.x - this.x;
		var voly = this.stage.player.y - this.y;
		var divide = Math.max(Math.abs(volx), Math.abs(voly)) / 10;
		volx = volx / divide;
		voly = voly / divide;
		// create a bullet, display on the stage
		var velocity = new Pair(volx, voly);
		var radius = 5;
		var colour= 'rgba(0,225,225,1)';
		var player_position = this.position;
		var position = new Pair(player_position.x, player_position.y);
		var b = new EnemyBullet(this.stage, position, velocity, colour, radius);
		this.stage.addActor(b);
	}

	move() {
		// this enemy will move towards player
		this.hitWall();

		var next_pos = new Pair(this.position.x+this.velocity.x, 
			this.position.y+this.velocity.y);
		var i;
		var obstacles_array = this.stage.obstacles;
		var check = 0;
		for (i = 0; i < obstacles_array.length; i++) {
			var obs = obstacles_array[i];
			if (circle_interaction(next_pos.x, next_pos.y, this.radius, 
				obs.x, obs.y, obs.radius) == 1) {
				check = 1;
				break;
			}
		}
		if (check != 1) {
			var volx = this.stage.player.x - this.x;
			var voly = this.stage.player.y - this.y;
			var divide = Math.max(Math.abs(volx), Math.abs(voly)) / 5;
			volx = volx / divide;
			voly = voly / divide;
			// create a bullet, display on the stage
			var velocity = new Pair(volx, voly);
			this.velocity = velocity;
			this.position.x=this.position.x+this.velocity.x;
			this.position.y=this.position.y+this.velocity.y;

		} else {
			this.position.x=this.position.x-this.velocity.x;
			this.position.y=this.position.y-this.velocity.y;
			this.velocity.x = -this.velocity.x;
			this.velocity.y = -this.velocity.y;	
		}
		this.intPosition();
	}
}

//module.exports.Stage = Stage;
module.exports = {
	Stage: Stage,
	Enemy: Enemy,
	Pair: Pair,
	Ball: Ball,
	Obstacle: Obstacle,
	Bullet:Bullet,
	Player:Player,
	EnemyBullet:EnemyBullet,
	AmmoBag:AmmoBag,
	Cannonball:Cannonball,
	SmartEnemy:SmartEnemy,
	FuckingSmartEnemy:FuckingSmartEnemy
}
//module.exports.other = {Enemy, SmartEnemy, FuckingSmartEnemy};
//export {Stage, Enemy, Pair, Ball, Obstacle, Bullet, Player, AmmoBag, Cannonball, SmartEnemy, FuckingSmartEnemy, Cannonball};
