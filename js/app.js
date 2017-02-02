var lyfcount = 3;//there are 3 life
var status = 0;// value changes after one game set
var keystatus = 0;
var collectedstars = 0;//this value will each time when the player collects a star

// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Starting co ordinates of enemy
    this.x = x;
    this.y = y;
    //speed of enemy
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed*dt;
    if(this.x>505 || this.x <0){
        this.x = 0;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if(status == 0){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x,y){
    this.x = x;
    this.y =y;
    this.speed = 100;
    this.sprite = 'images/char-horn-girl.png';
    this.score = 0;
};

Player.prototype.update = function(dt) {
    if(status == 0){
         this.checkCollisions();
    }
};

// Draw the player and score on the screen
Player.prototype.render = function() {
    if(this.y>0){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    else{
        ctx.font="60px Verdana";
        ctx.fillStyle="red";
        ctx.fillText("YOU WON!",100,280);
        ctx.strokeText("YOU WON!",100,280);
        ctx.font="18px Verdana";
        ctx.fillStyle="black";
        ctx.fillText("Want to play again..?? press any movement key",50,320);
        ctx.strokeText("Want to play again..?? press any movement key",50,320);
        this.x = 0;
        this.y = 0;
        status = 1;
    }
    this.Score();
};

//Moves the player according to input
Player.prototype.handleInput = function(direction){
    if(direction == 'left'&& this.x > 25){
            this.x -= 101;
    }
    if(direction =='right'&& this.x < 400){
            this.x += 101;
    }
    if(direction == 'up' && this.y > 5){
            this.y -= 83;
    }
    if(direction == 'down' && this.y < 400){
            this.y +=83;
    }
    if(status==1){//for starting new game
            this.gamereset();
        }
};

//Checks collision and change the score accordingly
Player.prototype.checkCollisions = function(){
    //check collision with enemy bugs
    for(var i = 0; i<allEnemies.length; i++){
        if(this.y<allEnemies[i].y+74 && this.y+73>allEnemies[i].y && this.x<allEnemies[i].x+80 &&this.x+60>allEnemies[i].x){
            lyfcount -=1;
            this.score -= 100;
            this.reset();
        }
    }
    //check collision with key.
    if(this.y < key.y+30 && this.y+78 > key.y && this.x < key.x+30 && this.x+60 > key.x){
        lyfcount += 1;
       keystatus += 1;
       key.y = 1000;// to ensure that collision dectected only once
    }
    //check collision with Stars
    for(var s = 0; s<allStars.length; s++){
        if(this.y < allStars[s].y+62 && this.y+78 > allStars[s].y && this.x < allStars[s].x+112 && this.x+80 > allStars[s].x){
            allStars[s].starStatus += 1;
            collectedstars += 1;
            allStars[s].y = 1000;// to ensure that collision dectected only once
            this.score += 500;
        }
    }
};

//For displaying score
Player.prototype.Score = function (){
    ctx.clearRect(1, 610, 500, 300);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("Score: "+ this.score, 10, 100);
};

// for reseting the position
Player.prototype.reset = function() {
    this.x= 200;
    this.y = 400;
};

//game reseting
Player.prototype.gamereset = function() {
    lyfcount = 3;
    status = 0;
    key.y = 160;
    key.x = 100;
    allStars[0].y=90 ;
    allStars[1].y= 180;
    allStars[2].y= 250;
    allStars[0].starStatus = 0;
    allStars[1].starStatus = 0;
    allStars[2].starStatus = 0;
    keystatus = 0;
    collectedstars = 0;
    this.score = 0;
    this.x= 200;
    this.y = 400;
};

//Heart class
var Heart = function(x,y){
    this.x = x;
    this.y = y;
    this.sprite = 'images/Heart.png';
};

//Displays heart
Heart.prototype.render = function() {
    if(collectedstars == 3){
        lyfcount += 1;
        collectedstars = 0;
    }
    var m = lyfcount;//No of hearts is equal to no of lives
    var p = 0;// to indicate the x co-ordinate of heart
    for(var k = 0; k<m; k++, p+=50){
        ctx.drawImage(Resources.get(this.sprite), this.x + p, this.y, 50,50);
    }
    //for displaying "game over"
    if(lyfcount<1){
        ctx.font="60px Verdana";
        ctx.fillStyle="red";
        ctx.fillText("Game Over!",100,280);
        ctx.strokeText("Game Over!",100,280);
        ctx.font="18px Verdana";
        ctx.fillStyle="black";
        ctx.fillText("Want to try again..?? press any movement key",50,320);
        ctx.strokeText("Want to try again..?? press any movement key",50,320);
        status = 1;
    }

};

//Key class
var Key = function(x,y){
    this.x = x;
    this.y = y;
    this.sprite = 'images/Key.png';
};

//Displays the key on screen
Key.prototype.render = function() {
    if(keystatus<1 && lyfcount >0){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y,140,140);
    }
};

//updates the position of key
Key.prototype.update = function(dt) {
    this.x = this.x + dt*450;
    if(this.x>505 || this.x < 0){
        this.x = 0;
    }
};

//Star class
var Star = function(x,y,speed){
    this.x = x;
    this.y = y;
    this.sprite = 'images/Star.png';
    this.speed = speed;
    this.starStatus = 0;
};

//Updates the posion of star
Star.prototype.update = function(dt){
    this.x = this.x + this.speed * dt;
    if(this.x>550 || this.x<0){
        this.x = 0;
    }
};

//Displays the Star on screen
Star.prototype.render = function(){
    if(this.starStatus<1 && lyfcount>0 && status==0){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y,140,140);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(0,60,200),new Enemy(300,60,200),
                 new Enemy(400,150,110),new Enemy(150,150,60),
                 new Enemy(30,230,90), new Enemy(280,230,40)];
// Place the player object in a variable called player
var player = new Player(200,400);
// Place the Heart object in a variable called heart
var heart = new Heart(0,540);
// Place the Key object in a variable called key
var key = new Key(100,170);
// Place all Star objects in an array called allStars
var allStars = [new Star(100,90,150),
                new Star(100,170,240),
                new Star(100,250,260)];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
