var canvas;
var stage;

//Initial mole position
var molePosX = new Array();
var molePosY = new Array();
var moleShowing = new Array();
var moleStep = new Array();
var moleShowTime;
var numberOfMoles;
var maxMoleCols = 3;
var maxMoleRows = 1;
var moleShape = new Array();
var init
var imgSeq = new Image();		// The image for the sparkle animation
var bmpAnim;
var oldX = 0;
var score = 0;
var scoreText;
var moleCount = 0;

function init() {
    canvas = document.getElementById("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    stage = new createjs.Stage(canvas);

    scoreText = new createjs.Text("Mole Kills: " + score, "36px Arial", "#777");
    stage.addChild(scoreText);

    imgSeq.onload = handleImageLoad();
    imgSeq.src = "images/sparkle_21x25.png";

    initialiseMolePosition();

    createjs.Ticker.addListener(window);
};

function tick() {

    handleSparkles();
    moleShowTime--;
    if (moleShowTime <= 0) {
        showNewMole()
        moleShowTime = Math.floor(Math.random() * 10 + 1);
    }


    // 'Move' the moles
    for (idx = 0; idx < numberOfMoles; idx++) {
        if (moleShowing[idx] > 0) {
            moleShape[idx].currentFrame += moleStep[idx]
            
            if (moleShape[idx].currentFrame == 9)
                moleStep[idx] = -1;

            if (moleShape[idx].currentFrame == 0)            {
                stage.removeChild(moleShape[idx]);
                moleShowing[idx] = 0;
            }
        }
    }

    stage.update();
}

function showNewMole() {
    var moleNum = Math.floor(Math.random() * numberOfMoles);

    if (moleCount < 50) {
        if (moleShowing[moleNum] == 0) {
            getMole2(moleNum);
            moleShowing[moleNum] = 1;
            moleCount++;
        }
    } else {
        endGame();
    }
}

function getMole2(moleIndex) {
    var data = {
        images: ["images/moledudesprite.png"],
        frames: { width: 300, height: 242 },
        animations: { run: [0, 9] }
    }

    var spriteSheet = new createjs.SpriteSheet(data);
    moleShape[moleIndex] = new createjs.BitmapAnimation(spriteSheet);
    moleShape[moleIndex].x = molePosX[moleIndex] - 121; // Deduct half the width from the x position
    moleShape[moleIndex].y = molePosY[moleIndex];
    moleShape[moleIndex].currentFrame = 0;
    moleShape[moleIndex].onClick = function (evt) { clickCanvas(evt); moleStep[moleIndex] = -1; moleShape[moleIndex].visible = false; }
    moleStep[moleIndex] = 1;

    stage.addChild(moleShape[moleIndex]);
}

function initialiseMolePosition() {
    var stepX = canvas.width / (maxMoleCols + 1);
    var curX = stepX;
    var stepY = canvas.height / (maxMoleRows + 1);
    var curY = stepY;

    var idx = 0;
    for (y = 0; y < maxMoleRows; y++) {
        for (x = 0; x < maxMoleCols; x++) {
            molePosX[idx] = curX;
            molePosY[idx] = curY;
            moleShowing[idx] = 0;

            curX += stepX;
            idx++;
        }

        curY += stepY;
        curX = stepX;
    }

    numberOfMoles = idx;
    moleShowTime = Math.floor(Math.random() * 10 + 1);
}

function endGame() {
    createjs.Ticker.removeAllListeners();
    var message = "You murdered " + score + " moles!";
    PopupMessage(message);
    window.open("default.html", "_self");
}