// Lecture 18: JavaScript Events

// Задача 1:
// Разработете следната мини игра, като се базирате на кода от занятието и примера със
// самолетчето, което съм ви качил:
// В долната част на екрана имате стрелящ обект (може да е самолетче, танкче, каквото си харесате),
// в горната имате мишена, която се движи равномерно от горния десен край на екрана до горния
// ляв, ако стрелящия обект улучи мишената - получавате една точка.
// Можете да движите стрелящия обект наляво и надясно със стрелките и като движите мишката
// наляво и надясно.
// Стрелба - при натиснат интервал и кликане на левия бутон на мишката.
// Трябва да реализирате 2 кутийки, които да визуализират броя точки на играча и броя патрони,
// играча има 100 патрона по дефолт. Кутийките трябва да се ъпдейтват всеки път когато съответния
// показател се промени. Играта приключва с победа, щом направите 70 точки, и губите, ако патроните
// ви свършат преди да ги направите.
// Изисквания: добър визуален дизайн на елементите на играта.
(function() {
	var mainWindow = document.getElementById('main'),
		start = document.getElementById('start'),
		home = document.getElementById('home'),
		gameover = document.getElementById('gameover'),
		spaceship = document.getElementById('spaceship'),
		fireball = document.getElementById('fireball'),
		enemy = document.getElementById('enemy'),
		points = document.getElementById('points'),
		bullets = document.getElementById('bullets'),
		containerWidth = 1050,
		playgroundWidth = 1050,
		playgroundHeight = 550,
		spaceshipWidth = 118,
		spaceshipHeight = 150,
		enemyWidth = 98,
		enemyHeight = 150,
		fireballWidth = 72,
		fireballHeight = 72,
		spaceshipPositionLeft = (playgroundWidth - spaceshipWidth) / 2,
		enemyPositionLeft = playgroundWidth - enemyWidth,
		fireballPositionLeft,
		fireballPositionBottom = spaceshipHeight,
		step = 5,
		enemyStep = 5,
		countPoints = 0,
		pointsToWin = 70,
		countBullets = 100,
		events = {
			gameloop: false,
			left: false,
			right: false,
			shoot: false,
			collision: false
		};
	
	start.addEventListener('click', function() {
		home.style.visibility = "hidden";
		mainWindow.style.opacity = 1;
		events.gameloop = true;
	}, false);
	
	function enemyMove() {
		if (events.gameloop) {
			if (enemyPositionLeft < Math.abs(enemyStep) 
					|| enemyPositionLeft > playgroundWidth - enemyWidth - enemyStep) {
				enemyStep = -enemyStep;
			}
			
			enemyPositionLeft += enemyStep;
			enemy.style.left = enemyPositionLeft + 'px';
		}
		
		window.requestAnimationFrame(enemyMove);
	}
	
	window.requestAnimationFrame(enemyMove);
	
	document.addEventListener('keydown', function(event) {
		if (events.gameloop) {
			getKeyCode(event.keyCode, true);
		}
	}, false);
	
	document.addEventListener('keyup', function(event) {
		if (events.gameloop) {
			getKeyCode(event.keyCode, false);
		}
	}, false);
	
	document.addEventListener('mousemove', function() {
		var mouseX = event.screenX,
			screenWidth = screen.width;
		
		if (events.gameloop
				&& mouseX > (screenWidth - containerWidth) / 2
				&& mouseX < playgroundWidth) {
			spaceshipPositionLeft = mouseX - (screenWidth - containerWidth) / 2;
			spaceship.style.left = spaceshipPositionLeft + 'px';
		}
	}, false);
	
	document.addEventListener('mousedown', function() {
		if (events.gameloop) {
			events.shoot = true;
		}
	}, false);
	
	function getKeyCode(keyCode, state) {
		if (keyCode == '37') {
			events.left = state;
		} else if (keyCode == '39') {
			events.right = state;
		} else if (keyCode == '32' && state) {
			events.shoot = state;
		}
	}
	
	function moveSpaceship() {
		if (events.gameloop && events.left && step < spaceshipPositionLeft) {
			spaceshipPositionLeft -= step;
		} else if (events.gameloop && events.right
				&& spaceshipPositionLeft < playgroundWidth - spaceshipWidth - step) {
			spaceshipPositionLeft += step;
		}
		
		spaceship.style.left = spaceshipPositionLeft + 'px';
		
		window.requestAnimationFrame(moveSpaceship);
	}
	
	window.requestAnimationFrame(moveSpaceship);
	
	function shoot() {
		if (events.gameloop && events.shoot) {
			fireball.style.visibility = "visible";
			fireball.style.bottom = fireballPositionBottom + 'px';
			fireballPositionLeft = spaceshipPositionLeft + spaceshipWidth / 2 - fireballWidth / 2;
			fireball.style.left = fireballPositionLeft + 'px';
			fireballPositionBottom += step;
			
			if (fireballPositionLeft > enemyPositionLeft
					&& fireballPositionLeft < enemyPositionLeft + enemyWidth
					&& fireballPositionBottom > playgroundHeight - enemyHeight) {
				events.collision = true;
				countPoints += 1;
				points.innerHTML = countPoints;
				enemy.style.opacity = 0.5;
				
				setTimeout(function(){
					enemy.style.opacity = 1;
				}, 500);
			}
		
			if (events.collision
					|| fireballPositionBottom > playgroundHeight - fireballHeight) {
				events.shoot = false;
				fireball.style.visibility = "hidden";
				fireballPositionBottom = spaceshipHeight;
				events.collision = false;
				countBullets -= 1;
				bullets.innerHTML = countBullets;
				
				if (countBullets == 0 || countPoints == pointsToWin) {
					gameOver();
				}
			}
		}
		
		window.requestAnimationFrame(shoot);
	}
	
	window.requestAnimationFrame(shoot);
	
	function gameOver() {
		var msg = '<h1>Game over!</h1>';
		
		mainWindow.style.opacity = 0.5;
		gameover.style.visibility = "visible";
		events.gameloop = false;
		
		if (countPoints >= pointsToWin) {
			msg += '<p>You win!</p>';
		} else {
			msg += '<p>You lost!</p>';
		}
		
		msg += '<p>Your points: ' + countPoints + '</p>';
		msg += '<button id="startover">Start over</button>';
		gameover.innerHTML = msg;
		
		document.getElementById('startover').addEventListener('click', function() {
			location.reload();
		}, false);
	}
}());