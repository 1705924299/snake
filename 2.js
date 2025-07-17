// 获取 canvas 元素和其上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
if (!canvas || !ctx) {
  console.error("Canvas not found or context not available.");
}

// 初始蛇的位置和大小
let snake = [
  {x: 150, y: 150},
  {x: 140, y: 150},
  {x: 130, y: 150},
  {x: 120, y: 150},
  {x: 110, y: 150},
];

let dx = 20; // 水平速度
let dy = 0;  

// 创建食物
let foodX, foodY;

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
  foodX = randomTen(0, canvas.width - 10);
  foodY = randomTen(0, canvas.height - 10);
  
  snake.forEach(function isFoodOnSnake(part) {
    if (part.x === foodX && part.y === foodY) {
      createFood();
    }
  });
}

// 绘制蛇
function drawSnakePart(snakePart) {
  ctx.fillStyle = 'lightgreen';
  ctx.strokestyle = 'darkgreen';
  ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
  ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
}

// 绘制整条蛇
function drawSnake() {
  snake.forEach(drawSnakePart);
}

// 绘制食物
function drawFood() {
  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'darkred';
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

// 移动蛇
function advanceSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    createFood(); 
  } else {
    snake.pop(); 
  }
}

// 自动移动蛇并保持平滑的动画
function moveSnake() {
  setTimeout(function onTick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood(); 
    advanceSnake(); 
    drawSnake(); 
    moveSnake(); 
  }, 100);
}

// 控制键盘事件（通过箭头键来控制蛇的移动）
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp' && dy === 0) {  // 防止蛇不能立即反向
    dx = 0;
    dy = -20;
  } else if (event.key === 'ArrowDown' && dy === 0) {
    dx = 0;
    dy = 20;
  } else if (event.key === 'ArrowLeft' && dx === 0) {
    dx = -20;
    dy = 0;  
  } else if (event.key === 'ArrowRight' && dx === 0) {
    dx = 20;
    dy = 0;  
  }
});

// 启动游戏
createFood(); 
moveSnake(); 
