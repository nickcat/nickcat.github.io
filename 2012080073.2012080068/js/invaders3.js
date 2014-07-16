"use strict";

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

/*
 * 飞机信息
 */
var spaceship = {
  x: 100,
  y: 700,
  width: 40,
  height: 40,
  counter: 0
};

/* 
 * 游戏状态
 */
var game = {
  state: "start"
};

var keyboard = {};

var lasers = [];

var invaders = [];

var king = [];

var invaderMissiles = [];

var invader_life = []	

/*
 * 图像和声音
 */
var spaceship_image;				//我方飞机
var invader_image;					//敌方飞机
var missle_image;					//敌方子弹
var laser_image;					//我放子弹
var boom_image;						//飞机爆炸图像
var hit_invader;					//敌方飞机被打的图像
var star_image1;					//星1
var star_image2;					//星2
var star_image3;					//星3
var star_image4;					//星4
var star_image5;					//星5

var laser_sound;					//我方飞机枪声
var missle_sound;					//地方飞机枪声
var explosion_sound;				//爆咋声
var invader_explosion_sound;		//敌方飞机被击溃盛
var play_again_sound;				//重新开始游戏的声音

var back_ground_image_search = 0;	//背景图像的变量
var user_laser_num			 = 0;	//限制我放飞机的子弹个数


var level					 = 1;	//关卡
var invader_index;

var game_loop_control;

var random_x = new Array();
var random_y = new Array();

function video_stop()
{
	start_video.load();	
}

function picture_clean()
{
	$("#start_picture").hide("fast");
}


var textOverlay = {
  counter: -1,
  title: "",
  subtitle: ""
};

/* 
 *	游戏状态更新
 */
function updateGameState() {
  //当敌方飞机数量为0的时候
  if(game.state === "playing" && invaders.length === 0) {
    game.state = "won";
    textOverlay.title = "Turtles Defeated";
    textOverlay.subtitle = "press space bar to play again";
    textOverlay.counter = 0;
	
    play_again_sound.play();
	$("#start_video").show("fast");
	start_video.play();
	
  }
  
  //在死亡状态下，按空格键的时候
  if(game.state === "over" && keyboard[32]) {
    game.state = "start";
    spaceship.state = "alive";
    textOverlay.counter = -1;

    play_again_sound.pause();
    play_again_sound.currentTime = 0;
  }

  //在通关状态下，按空格键的时候
  if(game.state === "won" && keyboard[32]) {
    game.state = "start";
    spaceship.state = "alive";
    textOverlay.counter = -1;

    play_again_sound.pause();
    play_again_sound.currentTime = 0;
	level++;
	if(level > 5)
		level = 1;
	}

  if(textOverlay.counter >= 0 ) {
    textOverlay.counter++;
  }
}



//敌方飞机子弹的信息
function addInvaderMissle(invader){

  missle_sound.play(); 			

  return {
    x: invader.x,
    y: invader.y,
    width: 5,
    height: 25,
    counter: 0
  };
}

function updateBackground() {
    
  if(game.state == "start")
  {
	$("#start_video").hide("fast");	
	video_stop();					
  }
  }

//敌方子弹图像函数 
function drawInvaderMissiles() {
  for(var iter in invaderMissiles) {
    var missle = invaderMissiles[iter];

	if(level == 5)
	{
		context.drawImage(
		  missle_image,
		  missle.x, missle.y, missle.width, missle.height
		);
		context.drawImage(
		  missle_image,
		  missle.x+120, missle.y, missle.width, missle.height
		);
		context.drawImage(
		  missle_image,
		  missle.x+240, missle.y, missle.width, missle.height
		);
		context.drawImage(
		  missle_image,
		  missle.x-120, missle.y, missle.width, missle.height
		);
	}
	else
	{
		context.drawImage(
		  missle_image,
		  missle.x, missle.y, missle.width, missle.height
		);
	}
  }
}

//地方子弹速度
function updateInvaderMissiles() {
  for(var iter in invaderMissiles) {
    var laser = invaderMissiles[iter];
	if(level == 5)
	{
		laser.y += 10;
		laser.counter++;
	}
	else
	{
		laser.y += 4;
		laser.counter++;
	}
  }

  invaderMissiles = invaderMissiles.filter(function(laser) {
    return laser.y <= 800;
  });
}

//敌方飞机图像函数
function updateInvaders() {
  if(game.state === "start") {

    invaders = []; 
	if (level == 1)
	{
		for(var iter = 0; iter < 10; iter++) {
		  invaders.push({
			x: 10 + iter * 40, 
			y: 10,
			height: 40,
			width: 40,
			phase: Math.floor(Math.random() * 50),
			counter: 0,
			life : 10,
			reverse : 0,
			state: "alive"
		  });
		}
	}
	
	if (level == 2)
	{
		for(var iter = 0; iter < 20; iter++) {
		  invaders.push({
			x: 10 + iter * 23,
			y: 10,
			height: 40,
			width: 40,
			phase: Math.floor(Math.random() * 100),
			counter: 0,
			life : 12,
			reverse : 0,
			state: "alive"
		  });
		}
	}
	
	if (level == 3)
	{
		for(var iter = 0; iter < 30; iter++) {
		  invaders.push({
			x: 10 + iter * 15,
			y: 10,
			height: 40,
			width: 40,
			phase: Math.floor(Math.random() * 125),
			counter: 0,
			life : 14,
			reverse : 0,
			state: "alive"
		  });
		}
	}
	
	if (level == 4)
	{
		for(var iter = 0; iter < 40; iter++) {
		  invaders.push({
			x: 10 + iter * 10,
			y: 10,
			height: 40,
			width: 40,
			phase: Math.floor(Math.random() * 150),
			counter: 0,
			life : 16,
			reverse : 0,
			state: "alive"
		  });
		}
	}
	
	if (level == 5)
	{
		for(var iter = 0; iter < 1; iter++) {
		  invaders.push({
			x: 20 + iter * 10,
			y: 10,
			height: 200,
			width: 200,
			phase: Math.floor(Math.random() * 250),
			counter: 0,
			life : 800,
			reverse : 0,
			state: "alive"
		  });
		}
	}
    game.state = "playing";
  }

  for(var iter2 in invaders) {
    var invader = invaders[iter2];

    if(!invader) {
      continue;
    }
	
    if(invader && invader.state === "alive") {
      invader.counter++;
	  
	  if(level == 5)
	  {
		  if(invader.reverse == 1)
			invader.x -= Math.sin(invader.counter * Math.PI * 2 / 100) * 10;	
		  else if (invader.reverse == 2)	
			invader.x += Math.sin(invader.counter * Math.PI * 2 / 100) * 10;	
		  else						
			invader.x += Math.sin(invader.counter * Math.PI * 2 / 100) * 10;	
			
		  if(invader.x >= 550)
		  {
			invader.reverse = 1;
			invader.x = 550;
			invader.x -= Math.sin(invader.counter * Math.PI * 2 / 100) * 10;	
		  }
		  else if(invader.x <= 50)
		  {
			invader.reverse = 2;
			invader.x = 50;
			invader.x += Math.sin(invader.counter * Math.PI * 2 / 100) * 10;	
		  }
	  }
	  
	  else{
	  
		  if(invader.reverse == 1)	
			invader.x -= Math.sin(invader.counter * Math.PI * 2 / 100) * 3;	
		  else if (invader.reverse == 2)	
			invader.x += Math.sin(invader.counter * Math.PI * 2 / 100) * 3;	 
		  else						
			invader.x += Math.sin(invader.counter * Math.PI * 2 / 100) * 3;	
			
		  if(invader.x >= 550)
		  {
			invader.reverse = 1;
			invader.x = 550;
			invader.x -= Math.sin(invader.counter * Math.PI * 2 / 100) * 3;	
		 }
		  else if(invader.x <= 50)
		  {
			invader.reverse = 2;
			invader.x = 50;
			invader.x += Math.sin(invader.counter * Math.PI * 2 / 100) * 3;	
		  }
	  }
	  
     
	  if(level == 5)
	  {
		  if((invader.counter + invader.phase) % 13 === 0) {
			invaderMissiles.push(addInvaderMissle(invader));
		  }
	  }
	  else{
		  if((invader.counter + invader.phase) % 200 === 0) {
			invaderMissiles.push(addInvaderMissle(invader));
		  }
	  }
    }
	
	
    if(invader && invader.state === "hit") {
			invader.counter++;
      if(invader.counter >= 20) {
        invader.state = "dead";
        invader.counter = 0;
      }
    }

  }

  invaders = invaders.filter(function(event) {
    if (event && event.state !== 'dead') { return true; }
    return false;
  });

}

/*
 * 生成敌方飞机图像
 */
function drawInvaders() { 
  for(var iter in invaders) {
    var invader = invaders[iter];

    if(invader.state === "alive") {
      context.drawImage(
        invader_image, 
        invader.x, invader.y, invader.width, invader.height
      );	  
    }
	
    if(invader.state === "check") {
			invader_explosion_sound.play();
			context.drawImage(hit_invader,invader.x, invader.y, invader.width, invader.height);
			invader.state = "alive";
			if(invader.life <= 0)
				invader.state = "hit";
    }
	
	//当敌方飞机被击中的时候
    if(invader.state === "hit") {
			invader_explosion_sound.play();
			context.drawImage(boom_image,invader.x, invader.y, invader.width, invader.height);
    }
	//当敌方飞机死亡的时候
    if(invader.state === "dead") {
      context.fillStyle = "black";
      context.fillRect(invader.x, invader.y, invader.width, invader.height);
    }

  }
}

/*
 * 背景
 */
function drawBackground() {

	context.fillStyle = "#000000";							
	context.fillRect(0, 0, canvas.width, canvas.height);	
	
	var star_number = 25;									
	
	if(back_ground_image_search/70 == 1){					// 星的位置随机排列
		for(var i = 0; i < star_number; i++)
		{
			random_x[i] = Math.floor(Math.random() * 550)+1;	
			random_y[i] = Math.floor(Math.random() * 750)+1;	
		}
	}
	else if (back_ground_image_search == 0)					 
	{
		for(var i = 0; i < star_number; i++)
		{
			random_x[i] = Math.floor(Math.random() * 550)+1;
			random_y[i] = Math.floor(Math.random() * 750)+1;
		}
	}
			
	for(var i = 0; i < 100; i++)					
	{
		var image_num = Math.floor(Math.random() * 5)+1;
		if(image_num == 1)
			context.drawImage(star_image1,random_x[i], random_y[i], 20,20);
		else if(image_num == 2)
			context.drawImage(star_image2,random_x[i], random_y[i], 20,20);
		else if(image_num == 3)
			context.drawImage(star_image3,random_x[i], random_y[i], 20,20);
		else if(image_num == 4)
			context.drawImage(star_image4,random_x[i], random_y[i], 20,20);
		else if(image_num == 5)
			context.drawImage(star_image5,random_x[i], random_y[i], 20,20);
	}
	
	if(back_ground_image_search == 70)
			back_ground_image_search = 1;
		
}

/*
 * 我方飞机子弹的速度
 */
function updateLasers() {

  for(var iter in lasers) {
    var laser = lasers[iter];
    laser.y -= 12;
    laser.counter++;
	
	if(laser.y < 0)		
		user_laser_num--;
	
  }

 
  lasers = lasers.filter(function(laser) {
    return laser.y >= 0;
  });

}


function fireLaser() {
  //如果发射的子弹个数超过3个的时，不能发射
  if(user_laser_num >= 3)
  {
	return;
  }

	user_laser_num++;
	if(user_laser_num > 3)
		user_laser_num = 3;
	if(user_laser_num < 0)            
		user_laser_num = 0;
  
  laser_sound.play();	

  lasers.push ({
    x: spaceship.x + 20,  
    y: spaceship.y - 10,
    width: 5,
    height: 30,
    counter: 0
  });
}

//更新我放飞机的状态
function updateSpaceship() {
 
  
  if(keyboard[32] && spaceship.state === "hit")
  {
	$("#start_video").show("fast");
      start_video.play();
	return;
  }
  
  if (spaceship.state === 'dead') {
    return;
  }

  // 向左移动
  if(keyboard[37]) {
    spaceship.x -= 8;
    if(spaceship.x < 0) { 
      spaceship.x = 0;
    }
  }

  // 向右移动 
  if(keyboard[39]) {
    spaceship.x += 8;
    var right = canvas.width - spaceship.width;
    if(spaceship.x > right) {
      spaceship.x = right;
    }
  }

  if(keyboard[32]) {
    
    if(!keyboard.fired) {
		fireLaser();
      keyboard.fired = true;
    } else {
      keyboard.fired = false;
    }
  }

  //被击溃时
  if(spaceship.state === "hit") {
    spaceship.counter++;
    if(spaceship.counter >= 40) {
      spaceship.counter = 0;			
      spaceship.state = "dead";			
      game.state = "over";				
      textOverlay.title = "Game Over";	
      textOverlay.subtitle = "press space bar to play again";
      textOverlay.counter = 0;			
      play_again_sound.play();			
	  
	  $("#start_video").show("fast");
      start_video.play();
	  }
  }
 }

function drawSpaceship() {
	//飞机死亡时
  if(spaceship.state === "dead") {
	context.drawImage(invader_image,spaceship.x, spaceship.y, spaceship.width, spaceship.height);
	return;
  }
  //被打子弹时
  if(spaceship.state === "hit") {
    explosion_sound.play();
	context.drawImage(boom_image,spaceship.x, spaceship.y, spaceship.width, spaceship.height);	
	return;
  }

  context.drawImage(
    spaceship_image,
    0, 0, 50, 50,
    spaceship.x, spaceship.y, spaceship.width, spaceship.height
  );
}

function drawLasers() {
  context.fillStyle = "white";

  for(var iter in lasers) {
    var laser = lasers[iter];
    var count = Math.floor(laser.counter / 4);
    var xoffset = (count % 4) * 24;

    context.drawImage(
      laser_image,
     
      laser.x, laser.y, laser.width, laser.height
    );

  }
}

function hit(a, b) {
  var ahit = false;

  if(b.x + b.width >= a.x && b.x < a.x + a.width) {
    
    if(b.y + b.height >= a.y && b.y < a.y + a.height) {
      ahit = true;
    }
  }


  if(b.x <= a.x && b.x + b.width >= a.x + a.width) {
    if(b.y <= a.y && b.y + b.height >= a.y + a.height) {
      ahit = true;
    }
  }

 
  if(a.x <= b.x && a.x + a.width >- b.x + b.width) {
    if(a.y <= b.y && a.y + a.height >= b.y + b.height) {
      ahit = true;
    }
  }

  return ahit;
}


function checkHits() {
  for(var iter in lasers) {
    var laser = lasers[iter];
    for(var inv in invaders) {
      var invader = invaders[inv];
	  invader_index = inv;
      if(hit(laser, invader)) {
		if(level == 1)
		{
			laser.state = "hit";
			invader.state = "check";
			invader.life--;
			invader.counter = 0;
			invader_explosion_sound.play();
		}
		
		else if(level == 2)
		{
			laser.state = "hit";
			invader.state = "check";
			invader.life--;
			invader.counter = 0;
			invader_explosion_sound.play();
		}
		
		else if(level == 3)
		{
			laser.state = "hit";
			invader.state = "check";
			invader.life--;
			invader.counter = 0;
			invader_explosion_sound.play();
		}
		
		else if(level == 4)
		{
			laser.state = "hit";
			invader.state = "check";
			invader.life--;
			invader.counter = 0;
			invader_explosion_sound.play();
		}
		
		else if(level == 5)
		{
			laser.state = "hit";
			invader.state = "check";
			invader.life--;
			invader.counter = 0;
			invader_explosion_sound.play();
			invaderMissiles.push(addInvaderMissle(invader));
		}
		
      }
    }
  }

 
  if(spaceship.state === "hit" || spaceship.state === "dead") {
    return;
  }

  for(var iter2 in invaderMissiles) {
    var missle = invaderMissiles[iter2];
    if(hit(missle, spaceship)) {
      missle.state = "hit";
      spaceship.state = "hit";
      spaceship.counter = 0;
    }
  }
}


function addEvent(node, name, func) {
  if(node.addEventListener) {
    node.addEventListener(name, func, false);
  } else if(node.attachEvent) {
  
    node.attachEvent(name, func);
  }
}


function addKeyboardEvents() {
  addEvent(document, "keydown", function(e) {
    keyboard[e.keyCode] = true;
  });

  addEvent(document, "keyup", function(e) {
    keyboard[e.keyCode] = false;
  });

}

function drawTextOverlay() {
  

  if(textOverlay.counter === -1) {
    return;
  }

  var alpha = textOverlay.counter / 50.0;

  if(alpha > 1 ) {
    alpha = 1;
  }

  context.globalAlpha = alpha;
  context.save();
  
//失败的情况
  if(game.state === "over") {
    context.fillStyle = "white";
    context.font = "Bold 40pt Arial";
    context.fillText(textOverlay.title, 140, 400);
    context.font = "14pt Helvectica";
    context.fillText(textOverlay.subtitle, 190, 450);
  }

  //胜利的情况
  if(game.state === "won") {
    context.fillStyle = "white";
    context.font = "Bold 40pt Arial";
    context.fillText(textOverlay.title, 100, 400);
    context.font = "14pt Helvectica";
    context.fillText(textOverlay.subtitle, 190, 450);
  }

 context.restore();
}

function gameLoop() {

  updateGameState();
  updateBackground();
  updateInvaders();
  updateSpaceship();

  updateLasers();
  updateInvaderMissiles();

  checkHits();

  drawBackground();
  drawSpaceship();
  drawInvaders();

  drawInvaderMissiles();
  drawLasers();
  drawTextOverlay();
  
  back_ground_image_search++;	
}

function playSound(file) {
  var sound = document.createElement("audio");
  sound.setAttribute("src", "sounds/" + file + ".wav");
  sound.play();
}

function loadResources() {
  spaceship_image = new Image();
  spaceship_image.src = 'images/spaceship.png';

  missle_image = new Image();
  missle_image.src = 'images/torpedo.png';

  invader_image = new Image();
  invader_image.src = 'images/invader.png';
  
  hit_invader 	= new Image();
  hit_invader.src	= 'images/hit_invader.png';
  
  laser_image = new Image();
  laser_image.src = 'images/laser.png';
  
  boom_image = new Image();
  boom_image.src = 'images/boom.png';
  
  star_image1 = new Image();
  star_image1.src = 'images/star1.png';
  
  star_image2 = new Image();
  star_image2.src = 'images/star2.png';
  
  star_image3 = new Image();
  star_image3.src = 'images/star3.png';
  
  star_image4 = new Image();
  star_image4.src = 'images/star4.png';
  
  star_image5 = new Image();
  star_image5.src = 'images/star5.png';

  missle_sound = document.createElement("audio");
  document.body.appendChild(missle_sound);
  missle_sound.setAttribute("src", "sounds/rocket.wav");

  laser_sound = document.createElement("audio");
  document.body.appendChild(laser_sound);
  laser_sound.setAttribute("src", "sounds/laser.wav");

  explosion_sound = document.createElement("audio");
  document.body.appendChild(explosion_sound);
  explosion_sound.setAttribute("src", "sounds/explosion.wav");

  invader_explosion_sound = document.createElement("audio");
  document.body.appendChild(invader_explosion_sound);
  invader_explosion_sound.setAttribute("src", "sounds/invader_explosion.wav");

  play_again_sound = document.createElement("audio");
  document.body.appendChild(play_again_sound);
  play_again_sound.setAttribute("src", "sounds/darkfactory.ogg");

}

$("#start_video").hide("fast");		

setTimeout(picture_clean , 3000); 	
setTimeout(loadResources , 3000);
addKeyboardEvents();
game_loop_control = setInterval(gameLoop, 1000/60);