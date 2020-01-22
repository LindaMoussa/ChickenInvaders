var x;
var y = 0;
var row = 4;
var col = 9;
var counter = 0;
var rocketX = 40;
var rocketY = 80;
let count = 0;
var lives = 2;
let countFire = 0;
let countMeat = 0;
let isCrashed = false;
let score = 0;
var Eggs = [];
var chickens = [];
var fires = [];
var level2Counter = 0;
var timer;
var resultScore = 0;
var step = 0;
var whistle;

function eggsDropLevel2() {
    let leftRand = Math.floor(Math.random() * (80 - 30) + 30) + 1;
    // Handler for .ready() called.

    var bchickenTop = $("#bigChick").offset().top + 150;
    var bchickenLeft = $("#bigChick").offset().left + Number(leftRand);

    $("#gameContainer").append(
        '<svg class="egg" id="egg' +
        count +
        '" ><image data-type="egg" id="eggImg" href="../imgs/egg.png"></image></svg>'
    );
    $("#egg" + count).css("top", "" + bchickenTop + "px");
    $("#egg" + count).css("left", "" + bchickenLeft + "px");
    $("#egg" + count).animate({
            top: "580px"
        },
        1500
    );
    Eggs.push("egg" + count);

    count++;
}

function drawGame() {
    for (let i = 0; i < row; i++) {
        x = 13;
        for (let j = 0; j < col; j++) {
            if (j % 2 == 0) {
                $(".container").append(
                    '<svg ><image data-type="chicken" id="chicken' +
                    i +
                    j +
                    '" href="../imgs/Red.gif"></image></svg>'
                );
                chickens.push("chicken" + i + j);
            } else {
                $(".container").append(
                    '<svg ><image  data-type="chicken" id="chicken' +
                    i +
                    j +
                    '" href="../imgs/Blue.gif"></image></svg>'
                );
                chickens.push("chicken" + i + j);
            }

            $("#chicken" + i + j).css(
                "transform",
                "translate(" + x + "% ," + y + "% "
            );
            x += 8;
        }
        y += 15;
    }

    drawRocket();
}

function drawRocket() {
    $("#gameContainer").append(
        '<svg id="svgRocket" ><image data-type="rocket" id="rocket" xlink:href="https://images.vexels.com/media/users/3/152291/isolated/preview/b24e3a7a428ffa5e38104ef0b9a67202-arcade-spaceship-icon-by-vexels.png"></image></svg>'
    );

    $("#rocket").css("transform", "translate(40%,80%) ");
}

function openFullscreen() {
    var elem = $("#container");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function moveChickens(left, right, time) {
    if (counter % 2 == 0) {
        $("#bigChick").animate({
                left: right
            },
            time
        );
        counter++;
    } else {
        $("#bigChick").animate({
                left: left
            },
            time
        );
        counter++;
    }
}

function nextLevel() {
    // $('.ChickensContainer').remove();
    $(".container").remove();
    count = 0;
    for (let i = 0; i < Eggs.length; i++) {
        Eggs[i].pop();
    }
    countFire = 0;
    for (let i = 0; i < fires.length; i++) {
        fires[i].pop();
    }
    countMeat = 0;
    chickens.push("bigChick");

    clearInterval(timer);
    $(".ChickensContainer").append(
        '<div class="bar deactivate "><div class="progress neon "data-width="0%"><div class="progress-text">0%</div><div class="progress-bar"><div class="progress-text">0%</div></div></div></div><div class="bigChick" id="bigChick"></div>'
    );
    $('.progress-bar').css('width', step + '%');
    setInterval(function () {
        eggsDropLevel2();
    }, 1600);

    window.setInterval(function () {
        moveChickens("65%", "-5%", 2500);
        bigChickenCrashed(chickens, fires);
    }, 200);
}

function chickenCrashed(chickens, fires) {
    isCrashed = false;
    if (chickens.length === 0) {
        nextLevel();
    }

    for (let i = 0; i < fires.length; i++) {
        let div1 = $("#" + fires[i]);
        if (div1.length != 0) {
            let res;

            let div2;

            for (let i = 0; i < row; i++) {
                for (let j = 0; j < col; j++) {
                    div2 = $("#chicken" + i + j);
                    if (div2.length != 0) {
                        res = collision(div1, div2);
                        if (res && isCrashed === false) {
                            isCrashed = true;
                            let leftPos = Math.floor(div1.offset().left);
                            let topPos = Math.floor(div1.offset().top);
                            if (leftPos != 0 && topPos != 0) {
                                $("#gameContainer").append(
                                    '<svg class="meat" id="meat' +
                                    countMeat +
                                    '" ><image id="meatImg" href="../imgs/meat2.png"></image></svg>'
                                );
                                $("#meat" + countMeat).css("top", "" + topPos + "px");
                                $("#meat" + countMeat).css("left", "" + leftPos + "px");
                                $("#meat" + countMeat).animate({
                                        top: "580px"
                                    },
                                    2000
                                );
                                id = "chicken" + i + j;
                                index = jQuery.inArray(id, chickens);

                                chickens.splice(index, 1);
                                $("#chickenAudio")[0].play();
                                $("#chickenAudio")[0].volume = 0.4;
                                div2.parent().remove();

                                countMeat++;
                                div1.remove();

                            }
                        }
                    }
                }
            }
        }
    }
}

function bigChickenCrashed(chickens, fires) {

    for (let i = 0; i < fires.length; i++) {
        let div1 = $('#' + fires[i]);
        if (div1.length != 0) {
            let res;

            let div2;


            div2 = $('#bigChick');
            if (div2.length != 0) {


                res = collision(div1, div2);

                if (res) {

                    let leftPos = Math.floor(div1.offset().left);
                    let topPos = Math.floor(div1.offset().top);
                    step += 10;
                    score += 20;
                    $("h1").text(score);

                    //3shan kol mra by-compare nfs l fire bl chicken
                    while (fires.length) {
                        fires.pop();
                    }

                    $('.progress-text').text(step + '%')
                    $('.progress-bar').css('width', step + '%');


                    if (step == 30) {



                        if (leftPos != 0 && topPos != 0) {
                            for (let i = 0; i < 20; i++) {

                                $('#gameContainer').append('<svg class="meat" id="meat' + countMeat + '" ><image id="meatImg" href="../imgs/meat2.png"></image></svg>');
                                $('#meat' + countMeat).css('top', '' + topPos + 'px');
                                $('#meat' + countMeat).css('left', '' + leftPos + ((i + 1) * 20) + 'px');
                                $('#meat' + countMeat).animate({
                                    top: '580px',

                                }, (i + 1) * 500);
                                countMeat++;
                            }

                            $('#chickenAudio')[0].play();
                            $('#chickenAudio')[0].volume = 0.4;
                            div2.parent().remove();




                        }

                    }


                    $('#gameContainer').append('<svg class="meat" id="meat' + countMeat + '" ><image id="meatImg" href="../imgs/meat2.png"></image></svg>');
                    $('#meat' + countMeat).css('top', '' + topPos + 'px');
                    $('#meat' + countMeat).css('left', '' + leftPos + 'px');
                    $('#meat' + countMeat).animate({
                        top: '580px',

                    }, 2000)
                    clearInterval(whistle);
                    $('#chickenAudio')[0].play();
                    $('#chickenAudio')[0].volume = 0.4;
                    div1.remove();
                    countMeat++;


                }



            }




        }


    }



}

function eggsDrop(chickens) {
    let i = Math.floor(Math.random() * (chickens.length - 0) + 0) + 1;

    if (typeof chickens[i] != "undefined") {
        var chickenTop = $("#" + chickens[i]).offset().top;
        var chickenLeft = $("#" + chickens[i]).offset().left;
        if ($("#" + chickens[i]).length != 0) {
            $("#gameContainer").append(
                '<svg class="egg" id="egg' +
                count +
                '" ><image data-type="egg" id="eggImg" href="../imgs/egg.png"></image></svg>'
            );
            Eggs.push("egg" + count);
            $("#egg" + count).css("top", "" + chickenTop + "px");
            $("#egg" + count).css("left", "" + chickenLeft + "px");
            $("#egg" + count).animate({
                    top: "580px"
                },
                5000
            );

            count++;
        }
    }
}

function rocketStart() {
    //   $("#rockTrack")[0].play();
    $("#rockSvg").animate({
            top: "-70%"
        },
        3500
    );
    $("#fogSvg").animate({
            top: "30%"
        },
        3500
    );
}
rocketStart();
setTimeout(function () {
    $(".background").addClass("deactivate");
    $("#gameContainer").css("background-image", "url(../imgs/background4.png)");
    document.getElementById("gameContainer").classList.toggle("deactivate");

    //   drawGame();
    drawRocket();
    window.setInterval(function () {
        eggsDrop(chickens);
    }, 3000);
    window.setInterval(function () {
        EggCrashed(Eggs);
        MeatCollision();
    }, 50);
    whistle = window.setInterval(function () {
        $("#whistle")[0].play();
    }, 2000);
    timer = window.setInterval(function () {
        moveChickens("10%", "-10%", 1500);
        chickenCrashed(chickens, fires);
    }, 200);
}, 4000);
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 37 && rocketX > 0) {
        rocketX -= 3;

        $("#rocket").css(
            "transform",
            "translate(" + rocketX + "%," + rocketY + "%) "
        );
        RocketCrashed(chickens);
    } else if (event.keyCode == 38 && rocketY > 0) {
        rocketY -= 3;

        $("#rocket").css(
            "transform",
            "translate(" + rocketX + "%," + rocketY + "%) "
        );
        RocketCrashed(chickens);
    } else if (event.keyCode == 40 && rocketY < 81) {
        rocketY += 3;

        $("#rocket").css(
            "transform",
            "translate(" + rocketX + "%," + rocketY + "%) "
        );
        RocketCrashed(chickens);
    } else if (event.keyCode == 39 && rocketX < 91) {
        rocketX += 3;

        $("#rocket").css(
            "transform",
            "translate(" + rocketX + "%," + rocketY + "%) "
        );
        RocketCrashed(chickens);
    }
    if (event.keyCode == 32) {
        $("#gameContainer").append(
            '<audio  id="startGame" autoplay ><source src="../sounds/fire-5.mp3"   type="audio/ogg"  ></audio>'
        );

        let rocketTop = $("#rocket").offset().top;
        let rocketLeft = $("#rocket").offset().left;
        $("#gameContainer").append(
            '<svg class="fireAsset" id="fireAsset' +
            countFire +
            '" ><image id="fireAssetImg" href="../imgs/fireAsset.png"></image></svg>'
        );
        //  fires.push('fireAsset' + countFire);
        $("#fireAsset" + countFire).css("top", "" + rocketTop + "px");
        rocketLeft += 13;
        $("#fireAsset" + countFire).css("left", "" + rocketLeft + "px");
        $("#fireAsset" + countFire).animate({
                top: "-580px"
            },
            3000
        );

        fires.push("fireAsset" + countFire);

        //        setTimeout(function () {
        //            for (let i = 0; i < fires.length; i++) {
        //                debugger
        //                console.log(fires.length +" "+fires[i])
        //
        //                if(typeof( fires[i])!='undefined')
        //
        //                {     console.log($('#'+fires[i]).offset().top)
        //
        //
        //                    if ($('#' + fires[i]).offset().top <= -500) {
        //                        fireId = jQuery.inArray(fires[i], fires);
        //                        fires.splice(fireId, 1);
        //
        //                    }
        //                }
        //
        //            }
        //
        //            }, 1000);
        countFire++;
    }
});

function MeatCollision() {
    var meats = $(".meat");
    for (let i = 0; i < meats.length; i++) {
        let div1 = $("#meat" + i);

        if (div1.length != 0) {
            let res;

            let div2;

            div2 = $("#rocket");
            if (div2.length != 0) {
                res = collision(div1, div2);
                if (res) {
                    let leftPos = Math.floor(div2.offset().left);
                    let topPos = Math.floor(div2.offset().top);
                    if (leftPos != 0 && topPos != 0) {
                        score += 10;
                        $("h1").text(score);

                        div1.hide();

                        //$('#meat'+countMeat).hide();

                        $("#bite")[0].play(); // checkLives();
                    }
                } else {
                    setTimeout(function () {


                        div1.remove();
                    }, 3000)

                }

            }
        }
    }
    //requestAnimationFrame(chickenCrashed);
}

function EggCrashed(Eggs) {
    var rockeDiv = $("#rocket");
    if (rockeDiv.length != 0) {
        for (let i = 0; i < Eggs.length; i++) {
            eggDiv = $("#" + Eggs[i]);

            if (eggDiv.offset().top >= 580) {
                let eggTop = eggDiv.offset().top;
                let eggLeft = eggDiv.offset().left;


                $("#gameContainer").append(
                    '<svg class="brokenEgg" id="brokenEgg' +
                    i +
                    '" ><image  id="brokenEggImg" href="../imgs/brokenEgg.png"></image></svg>'
                );
                $("#brokenEgg" + i).css("top", "" + eggTop + "px");
                $("#brokenEgg" + i).css("left", "" + eggLeft + "px");
                setTimeout(function () {
                    $("#brokenEgg" + i).remove();
                }, 2000);

                $("#EggAudio")[0].play();
                if ($("#" + Eggs[i]).offset().top > 580) {
                    eggId = jQuery.inArray(Eggs[i], Eggs);
                    $("#" + Eggs[i]).remove();
                    Eggs.splice(eggId, 1);
                }
            }

            let res = collision(rockeDiv, eggDiv);
            if (res) {
                let leftPos = $("#rocket").offset().left;
                let topPos = $("#rocket").offset().top;
                $("#rocket").remove();
                eggDiv.css("display", "none");
                $(".fire").css("display", "block");
                $(".fire").offset({
                    left: leftPos,
                    top: topPos
                });
                $("#rocket").remove();
                $("#explosion")[0].play();
                $(".fire").hide(2000);

                checkLives();
            }

        }
    }

}

function checkLives() {
    if (lives > 0) {
        $("#" + lives).remove();
        lives--;

        $(".fire").hide(2000);
        // $('.fire').css("display", 'none');
        rocketX = 40;

        rocketY = 80;
        setTimeout(function () {
            drawRocket();
        }, 1000);
    } else {
        $("#" + lives).remove();
        lives = 0;
        $(".ChickensContainer").remove();
        $("#gameContainer").append('<div class="gameOver"> </div>');
        $("#gameContainer").append('<div class="gameOver2"> Game Over </div>');
        $(".fire").hide(2000);
    }
}

function RocketCrashed(chickens) {
    div1 = $("#rocket");
    if (div1.length != 0) {
        let res;

        for (let i = 0; i < chickens.length; i++) {
            let div2 = $("#" + chickens[i]);

            res = collision(div1, div2);
            if (res) {
                let leftPos = Math.floor($("#rocket").offset().left);
                let topPos = Math.floor($("#rocket").offset().top);
                $(".fire").css("display", "block");
                $(".fire").offset({
                    left: leftPos,
                    top: topPos
                });
                $("#rocket").remove();
                $(".fire").hide(2000);
                $("#explosion")[0].play();
                checkLives();
            }
        }
    }
}

function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    else {
        return true;
    }
}