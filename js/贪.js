;
(function(window) {
	function Food(options) {
		options = options || {};
		this.width = options.width || 20;
		this.height = options.height || 20;
		this.bgColor = options.bgColor || "blue";
		this.x = options.x || 0;
		this.y = options.y || 0;
	}
	Food.prototype.render = function(target) {
		var div = document.createElement("div");
		target.appendChild(div);

		div.style.width = this.width + "px";
		div.style.height = this.height + "px";
		div.style.backgroundColor = this.bgColor;
		div.style.borderRadius = '50%';
		div.style.position = "absolute";
		this.x = parseInt(Math.random() * target.offsetWidth / this.width);
		this.y = parseInt(Math.random() * target.offsetHeight / this.height);
		div.style.left = this.x * this.width + "px";
		div.style.top = this.y * this.height + "px";
	}
	window.Food = Food;
})(window);

;
(function(window) {
	var timer;

	function Game(target) {
		this.map = target;
		this.snake = new Snake();
		this.food = new Food();

		//初始化游戏
		this.init();
	}

	Game.prototype.init = function() {
		var that = this;
		this.snake.render(this.map);
		this.food.render(this.map);
		//onkeyup事件与onkeydown只能给有焦点的东西注册，document
		document.onkeyup = function(e) {
			switch(e.keyCode) {
				case 37:
					if(that.snake.direction != "right") {
						that.snake.direction = "left";
					}
					break;
				case 38:
					if(that.snake.direction != "bottom") {
						that.snake.direction = "top";
					}
					break;
				case 39:
					if(that.snake.direction != "left") {
						that.snake.direction = "right";
					}
					break;
				case 40:
					if(that.snake.direction != "top") {
						that.snake.direction = "bottom";
					}
					break;
			}
		}
	}

	Game.prototype.start = function() {
		var that = this; //that存储了外部的this
		clearInterval(timer);
		timer = setInterval(function() {
			//在定时器中的this，是window对象
			that.snake.move(that.map, that.food);

			//判断蛇头的位置，如果蛇头的位置超出了地图，就说明撞墙
			var head = that.snake.body[0];
			switch(head.x) {
				case -1:
					head.x = that.map.offsetWidth / that.snake.width - 1;
					break;
				case that.map.offsetWidth / that.snake.width:
					head.x = 0;
					break;
			}
			switch(head.y) {
				case -1:
					head.y = that.map.offsetHeight / that.snake.height - 1;
					break;
				case that.map.offsetHeight / that.snake.height:
					head.y = 0;
					break;
			}
			//撞身体的判断， 判断蛇头和蛇身体的位置是否重合
			for(var i = 3; i < that.snake.body.length; i++) {
				if(head.x === that.snake.body[i].x && head.y === that.snake.body[i].y) {
					alert('恭喜,你共获得'+text.value+'分');
					clearInterval(timer);
					text.value=0;
				}
			}
		}, 150);
	}

	window.Game = Game;
})(window);

;
(function(window) {
	function Snake(options) {
		options = options || {};
		this.width = options.width || 20;
		this.height = options.height || 20;
		this.headColor = options.headColor || "red";
		this.bodyColor = options.bodyColor || "green";
		//将来创建蛇对象的时候，
		this.direction = options.direction || "right";
		this.body = [{
				x: 2,
				y: 0,
				bgColor: this.headColor
			},
			{
				x: 1,
				y: 0,
				bgColor: this.bodyColor
			},
			{
				x: 0,
				y: 0,
				bgColor: this.bodyColor
			}
		];
	}

	Snake.prototype.render = function(target) {
		//把body中所有的东西全部都渲染到target
		for(var i = 0; i < this.body.length; i++) {

			var span = document.createElement("span");
			target.appendChild(span);
			//设置span的样式
			span.style.width = this.width + "px";
			span.style.height = this.height + "px";
			span.style.backgroundColor = this.body[i].bgColor;
			span.style.borderRadius = '50%';
			span.style.position = "absolute";
			span.style.left = this.body[i].x * this.width + "px";
			span.style.top = this.body[i].y * this.height + "px";
		}
	}
	var text = document.getElementById("text")
	var j = 0;
	Snake.prototype.move = function(target, food) {

		for(var i = this.body.length - 1; i > 0; i--) {
			this.body[i].x = this.body[i - 1].x;
			this.body[i].y = this.body[i - 1].y;
		}
		//修改蛇头
		switch(this.direction) {
			case "right":
				this.body[0].x++;
				break;
			case "left":
				this.body[0].x--;
				break;
			case "top":
				this.body[0].y--;
				break;
			case "bottom":
				this.body[0].y++;
				break;
		}
		var colorArr = ['red', 'green', 'blue', 'pink', 'cyan', 'gold', 'yellow', 'orange'];
		for(var i = this.body.length - 1; i > 0; i--) {
			if(this.body[i].x === food.x && this.body[i].y === food.y) {
				//给body加一个对象
				this.body.push({
					x: this.body[i].x,
					y: this.body[i].y,
					bgColor: colorArr[parseInt(Math.random() * colorArr.length)]
				});

				//删除食物,删除div
				var div = target.querySelector("div");
				target.removeChild(div);
				j++;
				text.value = j;
				//重新渲染食物
				food.render(target);
			}
		}
		//删除蛇， 只需要删除target中所有的span就ok
		var spans = target.querySelectorAll("span");
		for(var i = 0; i < spans.length; i++) {
			target.removeChild(spans[i]);

		}
		//重新渲染蛇
		this.render(target);
	}
	window.Snake = Snake;

})(window);