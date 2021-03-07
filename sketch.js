// these are globaal variables
var bg, backgroundImg,platformImage,platformGroup;
var diamondImage,diamondsGroup;
var spikeImage,spikesGroup;
var score =0;
var gameState ="PLAY";

function preload() {
   // to load diiferent images
  backgroundImg = loadImage("images/bg.jpg");
  ironImage = loadImage("images/iron.png");
  platformImage = loadImage("images/stone.png");
  diamondImage = loadImage("images/diamond.png");
  spikeImage = loadImage("images/spikes.png");
  restartImage = loadImage("images/restart.png");
  }

function setup() {
  //to create a canvas of 1000*600
  createCanvas(1000, 600);

  // create background sprite
  bg = createSprite(580,300);
  bg.addImage(backgroundImg);
  bg.scale =2;
 
   // create ground sprite for ironman
  ground = createSprite(200,585,1700,10);
  ground.visible=false;
 
   //to create ironman sprite 
  ironMan = createSprite(200, 505, 20, 50);
  ironMan.addImage("running", ironImage);
  ironMan.scale = 0.3;
  // to change collider height and width
  ironMan.setCollider("rectangle",100,0,200,400)

  // to create group
  platformGroup = new Group();
  diamondsGroup = new Group();
  spikesGroup = new Group();

  //to create restart 
  restart = createSprite(500,300);
  restart.addImage(restartImage);
  restart.visible= false;
}

function draw() {

if(gameState ==="PLAY"){

  ironMan.setCollider("rectangle",0,0,200,500);
    
    bg.velocityY = -4;
    if (bg.y < 100){
      bg.y=bg.width/4;
    }
  
    if (keyDown("up")) {
    ironMan.velocityY = -10;
  }
  if (keyDown("left")) {
    ironMan.x = ironMan.x - 5;
  }
  if (keyDown("right")) {
    ironMan.x = ironMan.x + 5;
  }
  ironMan.velocityY = ironMan.velocityY + 0.5;

  //call the function to generate platforms
  generatePlatforms();
  for (var i = 0; i < platformGroup.length; i++) {
    var temp = platformGroup.get(i);

    if (temp.isTouching(ironMan)) {
   //make ironman step(collide) on ground
      ironMan.collide(temp);
    }
  }

  //call the function to generate diamonds
  generateDiamonds();

  for(var i = 0 ; i< (diamondsGroup).length ;i++){
    var temp = (diamondsGroup).get(i) ;
    
    if (temp.isTouching(ironMan)) {
      //increase the score when diamond is caught
      score++;
      // destroy the diamonds once caught
      temp.destroy();
      temp=null;
      }

        
    }

    //call the function to generate spikes
    generateSpikes();

    for(var i = 0 ; i< (spikesGroup).length ;i++){
      var temp = (spikesGroup).get(i) ;
      
      if (temp.isTouching(ironMan)) {
      //reduce the score by 5 when spike is caught 
        score=score-5;
      // destroy the spike once caught 
        temp.destroy();
        temp=null;
        }
          
      }
      if(score<=-10 || ironMan.y>610){
       gameState ="END";
      }
      
}
if(gameState ==="END"){
  bg.velocityY=0;
  ironMan.velocityY=0;
  diamondsGroup.setVelocityYEach(0);
  spikesGroup.setVelocityYEach(0);
  platformGroup.setVelocityYEach(0);
  diamondsGroup.setLifetimeEach(-1);
  spikesGroup.setLifetimeEach(-1);
  platformGroup.setLifetimeEach(-1);
  
  restart.visible=true;
  if(mousePressedOver(restart)){
   restartGame();

  }
}
  ironMan.collide(ground);
    drawSprites();
    textSize(20);
    fill("white")
    text("Diamonds Collected: "+ score, 500,50);
   
}

// function  definition of generate Platforms
function generatePlatforms() {
  if (frameCount % 60 === 0) {
    var brick = createSprite(1200, 10, 40, 10);
    brick.x = random(50, 850);
    brick.addImage(platformImage);
    brick.velocityY = 5;
    brick.lifetime = 250;
    platformGroup.add(brick);
  }
}

// function  definition of generate diamonds
function generateDiamonds() {
  if (frameCount % 80 === 0) {
    var diamond = createSprite(1200, 0, 40, 10);
 // to generate random position of diamond
    diamond.addAnimation("diamond", diamondImage);
    diamond.x = random(50, 850);
    diamond.scale = 0.5;
    diamond.velocityY = 3;
    // to avoid memory leak 
    diamond.lifetime = 400;
    diamondsGroup.add(diamond);
  }
}

// function  definition of generate spikes
function generateSpikes() {
  if (frameCount % 150 === 0) {
    var spikes = createSprite(1200, 90, 10, 40);
    spikes.addAnimation("spike", spikeImage);
     // to generate random position of spike
    spikes.x = random(50, 850);
    spikes.scale = 0.5;
    spikes.velocityY = 3;
    // to avoid memory leak 
    spikes.lifetime = 600;
    spikesGroup.add(spikes);
  }
}

// function  definition of restart game
function restartGame(){
  gameState ="PLAY";
  platformGroup.destroyEach();
  diamondsGroup.destroyEach();
  spikesGroup.destroyEach();
  score=0;
  
  ironMan.y=50;
  restart.visible=false;
}
