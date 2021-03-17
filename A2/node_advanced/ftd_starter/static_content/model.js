function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

function circle_interaction(x1, y1, r1, x2, y2, r2) {
	distance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);  
	rad_sum = (r1 + r2) * (r1 + r2);
	if (distance <= rad_sum) {
		return 1;
	}
	return 0;
}

class Stage {
	constructor(canvas){
		this.canvas = canvas;
	
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.player=null; // a special actor, the player
		this.enemies = [];
		this.obstacles = [];
		// the logical width and height of the stage
		this.width=canvas.width;
		this.height=canvas.height;

		// Add the player to the center of the stage
		var velocity = new Pair(0,0);
		var radius = 15;
		var colour= 'rgba(0,0,0,1)';
		var position = new Pair(Math.floor(this.width/2), Math.floor(this.height/2));
		this.addPlayer(new Player(this, position, velocity, colour, radius));
	
		// Add enemies
		this.addEnemies(5);

		// Add obstacles
		this.addObstacles(3);
	}

	addPlayer(player){
		this.addActor(player);
		this.player=player;
	}

	removePlayer(){
		this.removeActor(this.player);
		this.player=null;
	}

	addActor(actor){
		this.actors.push(actor);
	}

	remove_from_enemies(actor) {
		var index=this.enemies_array.indexOf(actor);
		if(index!=-1){
			this.enemies_array.splice(index,1);
		}	
	}

	remove_from_obstacles(actor) {
		var index=this.obstacles.indexOf(actor);
		if(index!=-1){
			this.obstacles.splice(index,1);
		}		
	}

	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}

	addEnemies(number) {
		var i;
		for (i = 0; i < number; i++) {
			var x=Math.floor((Math.random()*this.width)); 
			var y=Math.floor((Math.random()*this.height)); 
			var velocity = new Pair(rand(5), rand(5));
			var radius = 10;
			var colour= 'rgba(225,0,0,1)';
			var position = new Pair(x,y);
			var enemy = new Enemy(this, position, velocity, colour, radius);

			this.addActor(enemy);
			this.enemies.push(enemy);
		}
	}

	addObstacles(number) {
		var i;
		for (i = 0; i < number; i++) {
			var x=Math.floor((Math.random()*this.width)); 
			var y=Math.floor((Math.random()*this.height)); 
			var velocity = new Pair(0, 0);
			var radius = 50;
			var colour= 'rgba(225,225,225,1)';
			var position = new Pair(x,y);
			var obstacle = new Obstacle(this, position, velocity, colour, radius);
			this.addActor(obstacle);
			this.obstacles.push(obstacle);
		}
	}

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
	// NOTE: Careful if an actor died, this may break!
	step(){
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
		}
	}

	draw(){
		var context = this.canvas.getContext('2d');
		context.clearRect(0, 0, this.width, this.height);
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
		}
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
				enemy.health -= 10;
				if (enemy.health <= 0) {
					this.stage.removeActor(enemy);
					this.stage.remove_from_enemies(enemy);
				} 		
				// killed enemy, add score to player
				this.stage.player.score += 1;
			}
		}
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
		this.killEnemy();
		this.hitObstacle();
		this.hitWall();
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
	}
}

class EnemyBullet extends Bullet {
	killEnemy() {
		var enemy = this.stage.player;
		if (circle_interaction(this.x, this.y, this.radius, enemy.x, enemy.y, enemy.radius) == 1) {
			// remove enemy and bullet
			this.stage.player.health -= 10;
			this.stage.removeActor(this);
		}
	}

	step() {
		this.killEnemy();
		this.hitWall();
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
	}
}

class Player extends Ball {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.mousex = 0;
		this.mousey = 0;
		this.health = 100;
		this.ammunition = 10;
		this.score = 0;
	}

	fire() {
		if (this.ammunition > 0) {
			// create a bullet, display on the stage
			var velocity = new Pair(this.mousex, this.mousey);
			var radius = 5;
			var colour= 'rgba(0,0,0,1)';
			var player_position = this.stage.player.position;
			var position = new Pair(player_position.x, player_position.y);
			var b = new Bullet(stage, position, velocity, colour, radius);
			this.stage.addActor(b);
			this.ammunition -= 1;
		}
	}

	draw(context){
		context.fillStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();   

		context.font = 'normal bold 0.8em courier';
		var HP_text = "HP " + this.health;
		context.fillText(HP_text, this.x - 1.5 * this.radius, this.y + this.radius * 2);

		context.font = 'normal bold 1em courier';
		var Ammunition = "Ammo "  + this.ammunition + "/10";
		context.fillText(Ammunition, 0, 25);
		var Score = "Score "  + this.score;
		context.fillText(Score, 0, 50);
	}
}

class Enemy extends Ball {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.health = 10;
		this.timer = randint(25);
	}

	fire() {
		// create a bullet, display on the stage
		var velocity = new Pair(rand(10) - 5, rand(10) - 5);
		var radius = 5;
		var colour= 'rgba(225,0,0,1)';
		var player_position = this.position;
		var position = new Pair(player_position.x, player_position.y);
		var b = new EnemyBullet(stage, position, velocity, colour, radius);
		this.stage.addActor(b);
	}

	step() {
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
