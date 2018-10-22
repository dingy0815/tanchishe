//点击开始游戏-->startPage消失-->游戏开始
//随机出现食物，出现三节🐍开始运动
//上下左右-->改变方向运动
//判断吃到食物-->食物消失，🐍加一
//判断游戏结束，弹出分数框
var content = getId("content"),
    startGameBool = true,
    startPauseBool = true,
    startPage = getId("startPage"),
    snakeMove = null,
    scoreBox = getId("score"),
    loser = getId("loser"),
    loserScore = getId("loserScore"),
    close = getId("close"),
    startP = getId("startP"),
    startBtn = getId("startBtn");
// console.log(score);

init();

//封装一个通过id获取dom元素的方法
function getId(id) {
    return typeof(id) === "string"?document.getElementById(id):id;
}

function init() {
    //地图
    this.mapW = parseInt(getComputedStyle(content).width);
    this.mapH = parseInt(getComputedStyle(content).height);
    this.mapDiv = content;
    //食物
    this.foodW = 20;
    this.foodH = 20;
    this.foodX = 0;
    this.foodY = 0;
    //🐍
    this.snakeW = 20;
    this.snakeH = 20;
    this.snakeBody = [[3,1,"head"],[2,1,"body"],[1,1,"body"]];
    //游戏属性
    this.direct = "right";
    this.left = false;
    this.right = false;
    this.up = true;
    this.down = true;
    this.score = 0;

    bindEvent();
}

function startGame() {
    startPage.style.display = "none";
    startP.style.display = "block";
    food();
    snake();
}

function food() {
    var food = document.createElement("div");
    food.style.width = this.foodW + "px";
    food.style.height = this.foodH + "px";
    food.style.position = "absolute";
    this.foodX = Math.floor(Math.random() * (this.mapW / 20));
    this.foodY = Math.floor(Math.random() * (this.mapH / 20));
    food.style.left = this.foodX * 20 + "px";
    food.style.top = this.foodY * 20 + "px";
    this.mapDiv.appendChild(food).setAttribute("class","food");
}

function snake() {
    for (var i = 0; i < this.snakeBody.length; i++) {
        var snake = document.createElement("div");
        snake.style.width = this.snakeW + "px";
        snake.style.height = this.snakeH + "px";
        snake.style.position = "absolute";
        snake.style.left = this.snakeBody[i][0] * 20 + "px";
        snake.style.top = this.snakeBody[i][1] * 20 + "px";
        snake.classList.add(this.snakeBody[i][2]);
        this.mapDiv.appendChild(snake).classList.add("snake");
        switch (this.direct) {
            case "right":
                break;
            case "left":
                snake.style.transform = "rotate(180deg)";
                break;
            case "up":
                snake.style.transform = "rotate(270deg)";
                break;
            case "down":
                snake.style.transform = "rotate(90deg)";
                break;
            default:
                break;
        }
    }
}

function move() {
    for (var i = this.snakeBody.length - 1; i > 0; i--) {
        this.snakeBody[i][0] = this.snakeBody[i - 1][0];
        this.snakeBody[i][1] = this.snakeBody[i - 1][1];
    }
    switch (this.direct) {
        case "right":
            this.snakeBody[0][0] += 1;
            break;
        case "left":
            this.snakeBody[0][0] -= 1;
            break;
        case "up":
            this.snakeBody[0][1] -= 1;
            break;
        case "down":
            this.snakeBody[0][1] += 1;
            break;
        default:
            break;
    }
    removeClass("snake");
    snake();
    if (this.snakeBody[0][0] === this.foodX && this.snakeBody[0][1] === this.foodY) {
        removeClass("food");
        food();
        var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
        var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
        switch (this.direct) {
            case "right":
                this.snakeBody.push([snakeEndX + 1, snakeEndY, "body"]);
                break;
            case "left":
                this.snakeBody.push([snakeEndX - 1, snakeEndY, "body"]);
                break;
            case "up":
                this.snakeBody.push([snakeEndX, snakeEndY - 1, "body"]);
                break;
            case "down":
                this.snakeBody.push([snakeEndX + 1, snakeEndY + 1, "body"]);
                break;
            default:
                break;
        }
        this.score++;
        // console.log(this.score);
        scoreBox.innerHTML = this.score;


    }
    if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW / 20 || this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH / 20){
        console.log(111);
        reloadGame();
    }
    var snakeHX = this.snakeBody[0][0];
    var snakeHY = this.snakeBody[0][1];
    for (var j = 1,len = this.snakeBody.length; j < len; j++) {
        if(snakeHX === this.snakeBody[j][0] && snakeHY === this.snakeBody[j][1]){
            console.log(111);
            reloadGame();
        }
    }
}

function reloadGame() {
    removeClass("snake");
    removeClass("food");
    clearInterval(snakeMove);
    this.snakeBody = [[3,1,"head"],[2,1,"body"],[1,1,"body"]];
    this.direct = "right";
    this.left = false;
    this.right = false;
    this.up = true;
    this.down = true;
    loser.style.display = "block";
    loserScore.innerHTML = this.score;
    this.score = 0;
    scoreBox.innerHTML = this.score;
    startGameBool = true;
    startPauseBool = true;
    startP.setAttribute("src","../img/start.png");
}

function removeClass(className) {
    var ele = document.getElementsByClassName(className);
    while(ele.length > 0){
      ele[0].parentNode.removeChild(ele[0]);
    }
}

function bindEvent() {
    document.onkeydown = function (e) {
        var code = e.keyCode;
        e.preventDefault();
        setDerict(code);
    };
    close.addEventListener("click",function () {
        loser.style.display = "none";
    });
    startBtn.addEventListener("click",function () {
        startAndPause();
    });
    startP.addEventListener("click",function () {
        startAndPause();
    })
}

function setDerict(code) {
    switch (code) {
        case 37:
          if(this.left){
              this.direct = "left";
              this.left = false;
              this.right = false;
              this.up = true;
              this.down = true;
          }
          break;
        case 38:
          if(this.up){
              this.direct = "up";
              this.left = true;
              this.right = true;
              this.up = false;
              this.down = false;
          }
          break;
        case 39:
          if(this.right){
              this.direct = "right";
              this.left = false;
              this.right = false;
              this.up = true;
              this.down = true;
          }
          break;
        case 40:
          if(this.down){
              this.direct = "down";
              this.left = true;
              this.right = true;
              this.up = false;
              this.down = false;
          }
          break;
        default:
          break;

    }
}

function startAndPause() {
    if(startPauseBool){
        if(startGameBool){
            startGame();
            startGameBool = false;
        }
        startP.setAttribute("src","../img/pause.png");
        document.onkeydown = function (e) {
            e.preventDefault();
            var code = e.keyCode;
            setDerict(code);

        };
        snakeMove = setInterval(function () {
            move();
        },200);
        startPauseBool = false;


    }else{
        startP.setAttribute("src","../img/start.png");
        clearInterval(snakeMove);
        document.onkeydown = function (e) {
            e.returnValue = false;
            return false;
        };
        startPauseBool = true;
    }
}
