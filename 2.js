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
  {x: 120, y: 150}
];

let dx = 10; // 水平速度
let dy = 0;  // 垂直速度

let score = 0; // 初始化分数

// 创建食物
let foodX, foodY;

function randomTen(min, max) {
  // 生成min到max之间的20的倍数，且不会超界
  const range = Math.floor((max - min) / 10) + 1;
  return min + 10 * Math.floor(Math.random() * range);
}

function createFood() {
  foodX = randomTen(0, canvas.width - 10);
  foodY = randomTen(0, canvas.height - 10);
  
  // 防止食物和蛇重叠
  snake.forEach(function isFoodOnSnake(part) {
    if (part.x === foodX && part.y === foodY) {
      createFood();
    }
  });
}

// 绘制蛇
function drawSnakePart(snakePart) {
  ctx.fillStyle = 'lightgreen';
  ctx.strokeStyle = 'darkgreen';
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
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
  snake.unshift(head); // 加入新的蛇头

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    score += 10;
    document.getElementById('score').innerHTML = `Score: ${score}`;
    createFood(); // 创建新食物
  } else {
    snake.pop(); // 删除蛇尾
  }
}

// 检查游戏是否结束
function didGameEnd() {
  // 检查蛇是否碰到自己
  for (let i = 4; i < snake.length; i++) { 
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (didCollide) return true;
  }

  // 检查蛇是否碰到墙壁
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;
  
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

let frameCount = 0; // 新增帧计数器

// 自动移动蛇并保持平滑的动画
function moveSnake() {
  frameCount++;
  // 每3帧才移动一次蛇，降低速度约为原来的1/3
  if (frameCount % 10 === 0) {
    if (didGameEnd()) {
      alert("Game Over! Final Score: " + score);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // 清除画布

    advanceSnake();  // 先更新蛇的位置
    drawFood();      // 绘制食物
    drawSnake();     // 绘制蛇
  }
  requestAnimationFrame(moveSnake);  // 使用requestAnimationFrame平滑渲染
}

// 控制键盘事件（通过箭头键来控制蛇的移动）
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp' && dy === 0) {
    dx = 0;
    dy = -10;
  } else if (event.key === 'ArrowDown' && dy === 0) {
    dx = 0;
    dy = 10;
  } else if (event.key === 'ArrowLeft' && dx === 0) {
    dx = -10;
    dy = 0;  
  } else if (event.key === 'ArrowRight' && dx === 0) {
    dx = 10;
    dy = 0;  
  }
});

// 启动游戏
function startGame() {
  createFood(); // 创建初始食物
  moveSnake();  // 启动蛇的移动
}

startGame();  // 启动游戏
