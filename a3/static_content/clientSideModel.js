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
	constructor(canvas, protagonist){
		this.canvas = canvas;
		this.saved = false;
		this.protagonist = protagonist;
	
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.player=null; // a special actor, the player
		this.enemies = [];
		this.obstacles = [];
		this.ammobags = [];
		this.state = 0; // 0: in prohree, -1: loss, 1: win
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
		this.width=canvas.width;
		this.height=canvas.height;
	}


	draw(){
		var context = this.canvas.getContext('2d');
		context.clearRect(0, 0, this.width, this.height);
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
		}
		// if (this.getState() == 1) {
		// 	context.font = 'normal bold 5em courier';
		// 	var text = "you win";
		// 	context.fillText(text, 200, 400);
		// } else if (this.getState() == -1) {
		// 	context.font = 'normal bold 5em courier';
		// 	var text = "you lose";
		// 	context.fillText(text, 200, 400);
		// } else {
		// 	for(var i=0;i<this.actors.length;i++){
		// 		this.actors[i].draw(context);
		// 	}
		// }
	}

	// notify controller by game states
	getState() {
		if (this.player.health <= 0) {
			return -1
		}
		if (this.enemies.length == 0) {
			return 1;
		}
		return 0;
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

	addActor(actor){
		this.actors.push(actor);
	}

	// loadCurrentSetting(){
	// 	// Add the player to the center of the stage
	// 	var velocity = new Pair(0,0);
	// 	var radius = 15;
	// 	var colour= 'rgba(0,0,0,1)';
	// 	var position = new Pair(Math.floor(this.width/2), Math.floor(this.height/2));
	// 	this.addPlayer(new Player(this, position, velocity, colour, radius));
	
	// 	this.player.health *= this.playerHealthMul;
	// 	// this.playerHealthMul.health = Math.round(this.playerHealthMul);

	// 	// Add enemies
	// 	this.addEnemies(this.normalEnemyNum);
	// 	// Add obstacles
	// 	this.addObstacles(this.obstacleNum);
	// 	// Add ammobags
	// 	this.addAmmoBags(this.ammobagNum);
	// 	// Add smart Enemy
	// 	this.addSmartEnemies(this.smartEnemyNum);
	// 	this.addFuckingSmartEnemies(this.fuckingSmartEnemyNum);

	// 	this.state = 0;
	// }

	// setgameParamter(parameter){
	// 	this.normalEnemyNum = parameter["numNormal"];
	// 	this.smartEnemyNum = parameter["numSmart"];
	// 	this.fuckingSmartEnemyNum = parameter["numSmarter"];
	// 	this.obstacleNum = parameter["numObstacle"];
	// 	this.ammobagNum = parameter["numAmmobag"];
	// 	this.playerHealthMul = parameter["playerHealthMul"];
	// 	this.enemyHealthMul = parameter["enemyHealthMul"];
	// 	this.DMGMul = parameter["DMGMul"];
	// 	this.difficulty = parameter["difficulty"];
	// 	this.loadCurrentSetting();
	// }

	applyNewWorld(actors){
		this.actors = [];
		actors.forEach((actor)=>{
			if(actor.type=="Player"){
				var player = new Player(this, new Pair(actor.x, actor.y), null, actor.colour, actor.radius, actor.name);
				player.health = actor.health;
				player.ammunition = actor.ammunition;
				player.enemyCount = actor.enemyCount;
				player.score = actor.score;
				player.weapon = actor.weapon;
				player.mousex = actor.mousex;
				player.mousey = actor.mousey;
				this.addActor(player);
				if(actor.name = this.protagonist){
					this.player = player;
				}
			}else if(actor.type=="Enemy"){
				var enemy = new Enemy(this, new Pair(actor.position.x, actor.position.y), null, actor.colour, actor.radius);
				enemy.health = actor.health;
				this.addActor(enemy);
			}else if(actor.type=="Other"){
				var other = new Ball(this, new Pair(actor.position.x, actor.position.y), null, actor.colour, actor.radius);
				this.addActor(other);
			}
		});
		//console.log(this.actors);
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
}

class EnemyBullet extends Bullet {
	// enemy bullet only give damage to player
	
}

class Cannonball extends Bullet {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.damage = 30 * this.stage.DMGMul;
		this.distance = 0;
	}

	// cannon ball wont disappare when hit an enemy
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
		this.enemyCount = 0;
		this.name = name;
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
		context.fillText(this.name, this.x, this.y - this.radius * 2);

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
		var enemycount = "Enemy Left "  + this.enemyCount;
		context.fillText(enemycount, 0, 50);
	}
}

class Enemy extends Ball {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.health = 10 * this.stage.enemyHealthMul;
		this.timer = randint(25);
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
	// fire() {
	// 	var volx = this.stage.player.x - this.x;
	// 	var voly = this.stage.player.y - this.y;
	// 	var divide = Math.max(Math.abs(volx), Math.abs(voly)) / 10;
	// 	volx = volx / divide;
	// 	voly = voly / divide;
	// 	// create a bullet, display on the stage
	// 	var velocity = new Pair(volx, voly);
	// 	var radius = 5;
	// 	var colour= 'rgba(225,225,0,1)';
	// 	var player_position = this.position;
	// 	var position = new Pair(player_position.x, player_position.y);
	// 	var b = new EnemyBullet(stage, position, velocity, colour, radius);
	// 	this.stage.addActor(b);
	// }
}

class FuckingSmartEnemy extends SmartEnemy {
	// fire() {
	// 	var volx = this.stage.player.x - this.x;
	// 	var voly = this.stage.player.y - this.y;
	// 	var divide = Math.max(Math.abs(volx), Math.abs(voly)) / 10;
	// 	volx = volx / divide;
	// 	voly = voly / divide;
	// 	// create a bullet, display on the stage
	// 	var velocity = new Pair(volx, voly);
	// 	var radius = 5;
	// 	var colour= 'rgba(0,225,225,1)';
	// 	var player_position = this.position;
	// 	var position = new Pair(player_position.x, player_position.y);
	// 	var b = new EnemyBullet(stage, position, velocity, colour, radius);
	// 	this.stage.addActor(b);
	// }

	// move() {
	// 	// this enemy will move towards player
	// 	this.hitWall();

	// 	var next_pos = new Pair(this.position.x+this.velocity.x, 
	// 		this.position.y+this.velocity.y);
	// 	var i;
	// 	var obstacles_array = this.stage.obstacles;
	// 	var check = 0;
	// 	for (i = 0; i < obstacles_array.length; i++) {
	// 		var obs = obstacles_array[i];
	// 		if (circle_interaction(next_pos.x, next_pos.y, this.radius, 
	// 			obs.x, obs.y, obs.radius) == 1) {
	// 			check = 1;
	// 			break;
	// 		}
	// 	}
	// 	if (check != 1) {
	// 		var volx = this.stage.player.x - this.x;
	// 		var voly = this.stage.player.y - this.y;
	// 		var divide = Math.max(Math.abs(volx), Math.abs(voly)) / 5;
	// 		volx = volx / divide;
	// 		voly = voly / divide;
	// 		// create a bullet, display on the stage
	// 		var velocity = new Pair(volx, voly);
	// 		this.velocity = velocity;
	// 		this.position.x=this.position.x+this.velocity.x;
	// 		this.position.y=this.position.y+this.velocity.y;

	// 	} else {
	// 		this.position.x=this.position.x-this.velocity.x;
	// 		this.position.y=this.position.y-this.velocity.y;
	// 		this.velocity.x = -this.velocity.x;
	// 		this.velocity.y = -this.velocity.y;	
	// 	}
	// 	this.intPosition();
	// }
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
