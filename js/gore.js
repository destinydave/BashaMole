function handleImageLoad() {
    // attach mouse handlers directly to the source canvas.
    // better than calling from canvas tag for cross browser compatibility:
    // stage.onMouseMove = moveCanvas;
    //stage.onMouseDown = clickCanvas;

    // this prevents the stage from automatically clearing itself each tick.
    // in this demo, it results in the star trails, as the previous draws remain on screen.
    stage.autoClear = true;

    // define simple sprite sheet data specifying the image(s) to use, the size of the frames,
    // and the registration point of the frame
    // it will auto-calculate the number of frames from the image dimensions and loop them
    var data = {
        images: ["/images/sparkle_21x25.png"],
        frames: { width: 21, height: 23, regX: 10, regY: 11 }
    }

    // set up an animation instance, which we will clone
    bmpAnim = new createjs.BitmapAnimation(new createjs.SpriteSheet(data));

    // start the tick and point it at the window so we can do some work before updating the stage:
    createjs.Ticker.addListener(window);
}

function handleSparkles() {
    var h = canvas.height;
    var w = canvas.width;

    // loop through all of the active sparkles on stage:
    var l = stage.getNumChildren();
    for (var i = l - 1; i > 0; i--) {
        var sparkle = stage.getChildAt(i);
        
        if (sparkle.name == "sparkle") {

            // apply gravity and friction
            sparkle.vY += 2;
            sparkle.vX *= 0.98;

            // update position, scale, and alpha:
            sparkle.x += sparkle.vX;
            sparkle.y += sparkle.vY;
            sparkle.alpha += sparkle.vA;


            // remove sparkles that are no longer visible or are stalled:
            if (sparkle.alpha <= 0 || sparkle.y >= h && sparkle.vY < 10) {
                stage.removeChildAt(i);
            }

            //bounce sparkles off the bottom
            if (sparkle.y > h) {
                sparkle.vY *= -(Math.random() * 0.4 + 0.4);
                sparkle.y -= sparkle.y % h;
            }
            if (sparkle.x >= w || sparkle.x <= 0) { sparkle.vX *= -1; }
        }
    }
}

// sparkle explosion
function clickCanvas(evt) {
    addSparkles(Math.random() * 100 + 100 | 0, evt.stageX, evt.stageY, 2, 0);
    score++;
    stage.removeChild(scoreText);
    scoreText = new createjs.Text("Mole Kills: " + score, "36px Arial", "#777");
    stage.addChild(scoreText);
}

//sparkle trail
function moveCanvas(evt) {
    addSparkles(Math.random() * 2 + 1 | 0, evt.stageX, evt.stageY, 1, evt.stageX - oldX);
    oldX = evt.stageX;
}

function addSparkles(count, x, y, speed, velX) {
    //create the specified number of sparkles
    for (var i = 0; i < count; i++) {
        // clone the original sparkle, so we don't need to set shared properties:
        var sparkle = bmpAnim.clone();

        // set display properties:
        sparkle.name = "sparkle";
        sparkle.x = x;
        sparkle.y = y;
        sparkle.alpha = Math.random() * 0.5 + 0.5;
        sparkle.scaleX = sparkle.scaleY = Math.random() + 0.3;
        sparkle.compositeOperation = "darker";

        // set up velocities:
        var a = Math.PI * 2 * Math.random();
        var v = (Math.random() - 0.5) * 30 * speed;
        sparkle.vX = Math.cos(a) * v + velX;
        sparkle.vY = Math.sin(a) * v;
        sparkle.vA = -Math.random() * 0.05 - 0.01; // alpha

        // start the animation on a random frame:
        sparkle.gotoAndPlay(Math.random() * sparkle.spriteSheet.getNumFrames() | 0);

        // add to the display list:
        stage.addChild(sparkle);
    }
}