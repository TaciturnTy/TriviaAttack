
//USE THIS TO ALTER THE QUIZ LENGTH.
//IF 'numberOfQuestions = -1' THEN ALL QUESTIONS IN THE QUIZ WILL BE USED.
//IF 'numberOfQuestions > THE LENGTH OF THE QUIZ' THEN ALL QUESTIONS WILL BE USED.
var numberOfQuestions = 6;
var score = 0;
var correctAnswers = 0;
var incorrectAnswers = 0;
var totalTimeBonus = 0;
var started = false;
var quizArray;
var idArray;
var quiz;
var data;
var gameIsReady = false;
var playing = false;
var randomQuiz = document.createElement('script');
var isIE = false || !!document.documentMode;

//audio: correct answers
var CA_ting = new Audio('sounds/CA_ting.mp3');

//audio: incorrect answers
var IA_buzzer = new Audio('sounds/IA_buzzer.mp3');
var IA_clown_horn = new Audio('sounds/IA_clown_horn.mp3');
var IA_doink = new Audio('sounds/IA_doink.mp3');
var IA_kick = new Audio('sounds/IA_kick.mp3');
var IA_wilhelm = new Audio('sounds/IA_wilhelm.mp3');
var IA_needle = new Audio('sounds/IA_needle.mp3');
var IA_horse = new Audio('sounds/IA_horse.mp3');
var IA_oink = new Audio('sounds/IA_oink.mp3');

//audio: other
var O_applause = new Audio('sounds/O_applause.mp3');
var O_drum_roll_faster = new Audio('sounds/O_drum_roll_faster.mp3');
var O_dun_dun_dun = new Audio('sounds/O_dun_dun_dun.mp3');
var O_tada = new Audio('sounds/O_tada.mp3');
var O_wahwahwah = new Audio('sounds/O_wahwahwah.mp3');
var O_yay = new Audio('sounds/O_yay.mp3');
var O_theme = new Audio('sounds/O_theme.mp3');
var O_theme_longer = new Audio('sounds/O_theme_longer.mp3');
O_theme.loop=true;
O_theme_longer.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);


_browser = {};
function detectBrowser() {
    var uagent = navigator.userAgent.toLowerCase(),
        match = '',
        browser='';

    _browser.chrome  = /webkit/.test(uagent)  && /chrome/.test(uagent) && !/edge/.test(uagent);
    _browser.firefox = /mozilla/.test(uagent) && /firefox/.test(uagent);
    _browser.msie    = /msie/.test(uagent) || /trident/.test(uagent) || /edge/.test(uagent);
    _browser.safari  = /safari/.test(uagent)  && /applewebkit/.test(uagent) && !/chrome/.test(uagent);
    _browser.opr     = /mozilla/.test(uagent) && /applewebkit/.test(uagent) &&  /chrome/.test(uagent) && /safari/.test(uagent) && /opr/.test(uagent);
    _browser.version = '';

    for (x in _browser) {
        if (_browser[x]) {

            // microsoft is "special"
            match = uagent.match(new RegExp("(" + (x === "msie" ? "msie|edge" : x) + ")( |\/)([0-9]+)"));

            if (match) {
                _browser.version = match[3];
            } else {
                match = uagent.match(new RegExp("rv:([0-9]+)"));
                _browser.version = match ? match[1] : "";
            }

            browser=((x === "opr" ? "Opera" : x) + " " + (_browser.version ? _browser.version : "N/A"));
            break;
        }
    }
    _browser.opera = _browser.opr;
    delete _browser.opr;
    console.log(browser);
    if(x == 'msie' && _browser.version < 11) {
        window.location.href = "not_compatible.html";
    }
}
detectBrowser();

$(document).ready(function() {
    quiz = JSON.stringify(jsonQuizList);
    quiz = JSON.parse(quiz);
    quizArray = generateQuizList();
    console.log(quizArray[0]);

    randomQuiz.setAttribute('src','javascripts/json/' + quizArray[0]);
    document.head.appendChild(randomQuiz);
});

randomQuiz.onload = function()
{
    data = JSON.stringify(jsonData);
    data = JSON.parse(data);
    idArray = generateIDList();
    addSlideRight();
    addSlideUp();
};

window.addEventListener('keydown', startGame, false);


//RESIZE TEXT BASED ON DIV SIZE
window.onresize = resizeBoth;

function resizeBoth()
{
    if(playing)
    {
        resizeQuestion();
        resizeAnswer();
    }
}

function resizeQuestion()
{
    while (($('#questionShakeDiv div').height() > $('#questionShakeDiv').height()) || ($('#questionShakeDiv div').width() > $('#questionShakeDiv').width())) {
        console.log('question shrunk');
        $('#questionShakeDiv div').css('font-size', (parseInt($('#questionShakeDiv div').css('font-size')) - 1) + "px");
    }

    while (($('#questionShakeDiv div').height() < $('#questionShakeDiv').height()) || ($('#questionShakeDiv div').width() < $('#questionShakeDiv').width())) {
        console.log('question grew');
        $('#questionShakeDiv div').css('font-size', (parseInt($('#questionShakeDiv div').css('font-size')) + 1) + "px");
    }
}
function resizeAnswer()
{
    while (($('#answerShakeDiv div').height() > $('#answerShakeDiv').height()) || ($('#answerShakeDiv div').width() > $('#answerShakeDiv').width())) {
        console.log('answer shrunk');
        $('#answerShakeDiv div').css('font-size', (parseInt($('#answerShakeDiv div').css('font-size')) - 1) + "px");
    }

    while (($('#answerShakeDiv div').height() < $('#answerShakeDiv').height()) || ($('#answerShakeDiv div').width() < $('#answerShakeDiv').width())) {
        console.log('answer grew');
        $('#answerShakeDiv div').css('font-size', (parseInt($('#answerShakeDiv div').css('font-size')) + 1) + "px");
    }
}

function startGame(e)
{
    e.preventDefault(); //Normally, spacebar scrolls down a page, this disables that

    if(e.keyCode == '32' && gameIsReady)
    {
        //Don't allow first question to be answered by holding down space on start
        document.body.onkeyup = function (e)
        {
            if (e.keyCode == 32)
            {
                allowed = true;
            }
        };

        if(started == false)
        {
            started = true;
            startSlideOut();
            var game = document.getElementById('game');
            var start = document.getElementById('start');
            $("#prompt").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                noHide('game');
                $("#prompt").addClass('invisible');
                $("#prompt").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
            });

            O_theme_longer.play();

            setTimeout(function()
            {
                addRotateIn();
                $("#card").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                    $("#card").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
                    addTurnY();
                   play();
                });
            }, 1000);
        }
    }
}

function addRotateIn()
{
    var card = $("#card");
    var card2 = $("#card2");
    var card3 = $("#card3");

    card.removeClass('invisible');
    card.removeClass('card-start');
    card.addClass('rotateInY');
    card2.removeClass('invisible');
    card2.removeClass('card-start');
    card2.addClass('rotateInY2');
    card3.removeClass('invisible');
    card3.removeClass('card-start');
    card3.addClass('rotateInY3');
}
function addRotateOut()
{
    var card = $("#card");
    var card2 = $("#card2");
    var card3 = $("#card3");

        document.getElementById("card").style.animation = "";
        document.getElementById("card2").style.animation = "";
        document.getElementById("card3").style.animation = "";

        setTimeout(function()
        {
            card.addClass('card-end');
            card.addClass('invisible');
            card2.addClass('card-end');
            card2.addClass('invisible');
            card3.addClass('card-end');
            card3.addClass('invisible');
        },0);
}

function getTime()
{
    var start = new Date().getTime();
    return start;
}

function getTimeBonus(startTime, endTime)
{
    var difference =  endTime - startTime;
    var divide = difference / 2000;
    var bonus = 101 - (100 * divide);

    return Math.floor(bonus);
}

//Title animation
function addSlideRight()
{
    var title1 = document.getElementById('title1');
    var title2 = document.getElementById('title2');

    title1.setAttribute('class','slide-right');
    title2.setAttribute('class','slide-right-slower');
    $("#title2").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
        title1.setAttribute('class','slide-right-done');
        title2.setAttribute('class','slide-right-done');
        $("#title2").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
    });
}
//Spacebar prompt animation
function addSlideUp()
{
    var prompt = document.getElementById('prompt');
    prompt.setAttribute('class','slide-up');

    $("#prompt").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function()
    {
        var prom = $("#prompt");
        prom.addClass('flash');
        prom.addClass('slide-up-done');
        prom.removeClass('slide-up');
        gameIsReady = true;

        $("#prompt").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
    });
}

function startSlideOut()
{
    var prompt = document.getElementById('prompt');
    var title1 = document.getElementById('title1');
    var title2 = document.getElementById('title2');
    title1.setAttribute('class','slide-left');
    title2.setAttribute('class','slide-left');
    prompt.setAttribute('class','slide-down');
}

function playAgainAnim()
{
    var playAgain = document.getElementById('playAgain');
    playAgain.setAttribute('class','slide-right-play-again');

    $("#playAgain").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function()
    {
        $("#playAgain").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");

        var temp = $("#playAgain");
        temp.removeClass('class','slide-right-play-again');
        temp.addClass('slide-right-play-again-done flash');
        temp.click(function()
        {
            location.reload();
        });
        temp.hover(function()
        {
            temp.removeClass('flash');
            $('#playAgain').css( 'cursor', 'pointer' );
        });
        temp.mouseout(function()
        {
            temp.addClass('flash');
        });

        window.addEventListener('keydown', spaceToReplay, false);
        function spaceToReplay(e) {
            e.preventDefault(); //Normally, spacebar scrolls down a page, this disables that

            if (e.keyCode == '32')
            {
                location.reload();
            }
        }
    });
}

var allowed;
var i = 0; //Counts categories
var j = 0; //Counts answers for each category
function play()
{
    playing=true;
    var divbottom = $("#div-bottom");
    divbottom.removeClass('invisible');

    //If more questions are asked for than what are on the list, then all of the questions will be played.
    //If the user sets the number of questions to -1, then all of the questions will be used
    if(numberOfQuestions >= Object.keys(jsonData.questionList).length)
        numberOfQuestions = Object.keys(jsonData.questionList).length - 1;
    else if(numberOfQuestions == -1)
        numberOfQuestions = Object.keys(jsonData.questionList).length - 1;

    j = 0; //Counts answers for each category
    if(i < numberOfQuestions)
    {
        var randInt = idArray[i];
        var alreadyAnswered = false;
        nextCategory(data.questionList[randInt].category);
            addCategoryAnim();

        //function must receive question number on list (i) and then return a random array of answer numbers for j
        var randomAnswerArray = getRandomAnswerArray(i);
        nextAnswer(data.questionList[randInt].answerList[randomAnswerArray[j]].answer); //j is instead randomAnswerArray[j]
        addAnswerAnim();

        var startTime = getTime();

        i++;

        //At end of previous answer anim, play next
        //Use off to kill this function otherwise it will execute everytime an animation ends
        $("#answerShakeDiv").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
            j++;
            nextAnswer(data.questionList[randInt].answerList[randomAnswerArray[j]].answer);
            addAnswerAnim();
            alreadyAnswered = false;

            startTime = getTime();

            if(j >= Object.keys(jsonData.questionList[randInt].answerList).length - 1)
            {
                $("#answerShakeDiv").off("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd");
            }
        });
        document.body.onkeyup = function (e)
        {
            e.preventDefault();
            if (e.keyCode == 32)
            {
                allowed = true;
            }
        };

        document.body.onkeydown = function (e)
        {
            e.preventDefault();
            if (e.keyCode == 32) {
                if (data.questionList[randInt].answerList[randomAnswerArray[j]].value == 'correct' && !alreadyAnswered && allowed) {
                    //time bonus
                    allowed=false;
                    var endTime = getTime();
                    var bonus = getTimeBonus(startTime, endTime);
                    totalTimeBonus += bonus;
                    bonus += 100;

                    playPoints('+ ' + bonus, bonus);
                    playAudioCA();

                    alreadyAnswered = true;
                    changeScore(bonus);
                }
                else if (data.questionList[randInt].answerList[randomAnswerArray[j]].value == 'incorrect' && !alreadyAnswered && allowed) {
                    allowed=false;
                    playPoints('- 200', -200);
                    playAudioIA();

                    alreadyAnswered = true;
                    changeScore(-200);
                }
            }
        };
    }
    if(i < numberOfQuestions)
    {
        $("#questionShakeDiv").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function ()
        {
            $("#questionShakeDiv").off("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd");
            play();
        });
    }
    else
    {
        $("#questionShakeDiv").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function ()
        {
            hide('answerShakeDiv');
            hide('category');
            hide('score');
            alreadyAnswered=true;
            addRotateOut();
            $("#card").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                $("#card").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
                playing=false;
                playSummary();
            });
        });
    }
}

function playAudioCA()
{
    if(CA_ting.paused)
        CA_ting.play();
    else
        CA_ting.currentTime=0;
}

function playAudioIA()
{
    var randInt = getRandomInt(0,7);
    var answerShakeDiv = document.getElementById('answerShakeDiv');
    switch (true)
    {
        case (randInt == 0):
            if(IA_buzzer.paused)
                IA_buzzer.play();
            else
                IA_buzzer.currentTime=0;
            break;
        case (randInt == 1):
            if(IA_clown_horn.paused)
                IA_clown_horn.play();
            else
                IA_clown_horn.currentTime=0;
            break;
        case (randInt == 2):
            if(IA_doink.paused)
                IA_doink.play();
            else
                IA_doink.currentTime=0;
            break;
        case (randInt == 3):
            if(IA_horse.paused)
                IA_horse.play();
            else
                IA_horse.currentTime=0;
            break;
        case (randInt == 4):
            if(IA_kick.paused)
                IA_kick.play();
            else
                IA_kick.currentTime=0;
            break;
        case (randInt == 5):
            if(IA_needle.paused)
                IA_needle.play();
            else
                IA_needle.currentTime=0;
            break;
        case (randInt == 6):
            if(IA_oink.paused)
                IA_oink.play();
            else
                IA_oink.currentTime=0;
            break;
        case (randInt == 7):
            if(IA_wilhelm.paused)
                IA_wilhelm.play();
            else
                IA_wilhelm.currentTime=0;
            break;
    }
}

function addTurnY()
{
    var card = $("#card");
    card.removeClass('rotateInY');
    card.addClass('turnY');
    noHide(score);
    document.getElementById("card").style.animation = "turnYAnimation 24150ms infinite";
    var card2 = $("#card2");
    card2.removeClass('rotateInY2');
    card2.addClass('turnY2');
    document.getElementById("card2").style.animation = "turnYAnimation2 24150ms infinite";
    var card3 = $("#card3");
    card3.removeClass('rotateInY3');
    card3.addClass('turnY3');
    document.getElementById("card3").style.animation = "turnYAnimation3 24150ms infinite";
}

var previousAnimation;
function addAnswerAnim()
{
    resizeAnswer();

    var answer = $("#answerShakeDiv");
    if(previousAnimation != null)
        answer.removeClass(previousAnimation);
    var randomAnimName = setAnswerAnimation();
    previousAnimation = randomAnimName;
    answer.addClass('invisible');

    window.setTimeout(function()
    {
        answer.removeClass('invisible');
        answer.addClass(randomAnimName);
    },25
    );
}

function addCategoryAnim()
{
    resizeQuestion();

    //Apparently it is possible to set a class too early and the animation won't play, hence the timeout
    $("#questionShakeDiv").on("animationstart webkitAnimationStart oAnimationStart MSAnimationStart", function ()
    {
        $("#questionShakeDiv").off("animationstart webkitAnimationStart oAnimationStart MSAnimationStart");
    });
    $("#questionShakeDiv").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function ()
    {
        $("#questionShakeDiv").off("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd");
        // clearInterval(timerId);
    });

    var questionShakeDiv = $("#questionShakeDiv");
    questionShakeDiv.removeClass('shrink-category');
    questionShakeDiv.addClass('invisible');

    window.setTimeout(function()
    {
        questionShakeDiv.removeClass('invisible');
        questionShakeDiv.addClass('shrink-category');
    },0
    );
}

function playSummary()
{
    O_theme_longer.pause();
    var game = document.getElementById('game');
    game.style.top = '100vh';
    var summary = document.getElementById('summary');
    summary.style.top = '0';
    var totalScore = document.getElementById('finalScore');
    totalScore.innerHTML = score;
    var correct = document.getElementById('correct');
    correct.innerHTML = correctAnswers;
    var incorrect = document.getElementById('incorrect');
    incorrect.innerHTML = incorrectAnswers;
    var timeBonus = document.getElementById('timeBonus');
    timeBonus.innerHTML = totalTimeBonus;
    noHide('summary');

    $("#summary").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function()
    {
        $("#summary").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
            O_drum_roll_faster.play();
    });
    O_drum_roll_faster.onended = function()
    {
        setRatingValue();
        addRatingAnim();
        playAgainAnim();
    };
}

function setRatingValue()
{
    var rating = document.getElementById('rating');

    switch (true)
    {
        case (score <= 0):
            rating.innerHTML="F";
            O_wahwahwah.play();
            break;
        case (score >= 1 && score < 300):
            rating.innerHTML="D";
            O_dun_dun_dun.play();
            break;
        case (score >= 300 && score < 600):
            rating.innerHTML="C";
            O_applause.play();
            break;
        case (score >= 600 && score < 900):
            rating.innerHTML="B";
            O_yay.play();
            break;
        case (score >= 900):
            rating.innerHTML="A";
            O_tada.play();
            break;
    }
}

function addRatingAnim()
{
    var ratingHead = document.getElementById('ratingHead');
    ratingHead.setAttribute('class','animated zoomInRight');
    var ratingRing = document.getElementById('rating-ring');
    ratingRing.setAttribute('class','animated zoomInRight');
}

function nextCategory(categoryText)
{
    var category = document.getElementById('category');
    category.innerHTML = categoryText;
}

function nextAnswer(answerText)
{
    var answer = document.getElementById('answer');
    answer.innerHTML = answerText;
}

function changeScore(value)
{
    if(value > 0)
    {
        score+=value;
        correctAnswers++;
    }
    else
    {
        score+=value;
        incorrectAnswers++;
    }
    var points = document.getElementById('score');
    points.innerHTML = 'Score: ' + score;
}

//Get a random value between or including min and max
//Use that value in a case statement to select the position for the answer (multiple non random locations
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setAnswerAnimation()
{
    var randInt = getRandomInt(0,7);
    var answerShakeDiv = document.getElementById('answerShakeDiv');
    switch (true)
    {
        case (randInt == 0):
            return 'slideHighLeftRight';
            break;
        case (randInt == 1):
            return 'slideHighRightLeft';
            break;
        case (randInt == 2):
            return 'slideLowLeftRight';
            break;
        case (randInt == 3):
            return 'slideLowRightLeft';
            break;
        case (randInt == 4):
            return 'slideHighTopBottom';
            break;
        case (randInt == 5):
            return 'slideHighBottomTop';
            break;
        case (randInt == 6):
            return 'slideLowTopBottom';
            break;
        case (randInt == 7):
            return 'slideLowBottomTop';
            break;
        default:
            return 'slideTopLeftRight';
            break;
    }
}

//Animation for spinning points, creates a new header for each points animation, sets location for each point header
function playPoints(theText, thePoints)
{
    var div = document.getElementById('pointsDiv');
    var node = document.createElement("h3");
    node.innerHTML = theText;
    div.appendChild(node);

    var posx = (Math.random() * $('#pointsDiv').width()).toFixed();
    var posy = (Math.random() * $('#pointsDiv').height()).toFixed();

    node.style.left = posx+'px';
    node.style.top = posy+'px';

    if(thePoints < -1)
    {
        node.style.color = 'red';
        node.setAttribute('class','animated fadeInOutDown points');
    }
    else if(thePoints > 0)
    {
        node.style.color = 'limegreen';
        node.setAttribute('class','animated fadeInOutUp points');
    }

    //Should use code below to remove html elements BUT doing this cuts the points animation off early if multiple points animations are running
    $(".points").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function ()
    {
        $(".points").off("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd");
    });
}

//Create random array of answers without repeats
//Call after page load
function getRandomAnswerArray(questionNumber)
{
    var size = Object.keys(jsonData.questionList[questionNumber].answerList).length;
    var idList = [], shuffledList;

    //Generate an array of id values
    for(var i = 0; i < size; i++)
    {
        idList[i] = i;
    }

    shuffledList = shuffle(idList);
    return shuffledList;
}

function generateQuizList()
{
    var max = Object.keys(jsonQuizList.quizList).length;
    var quiz = JSON.stringify(jsonQuizList);
    quiz = JSON.parse(quiz);
    var quizList = [], shuffledList;

    //Generate an array of id values
    for(var i = 0; i < max; i++)
    {
        quizList[i] = quiz.quizList[i].fileName;
    }

    shuffledList = shuffle(quizList);
    return shuffledList;
}

//Generate a list of random ids from those available without redundancy
function generateIDList()
{
    var max = Object.keys(jsonData.questionList).length;
    var data = JSON.stringify(jsonData);
    data = JSON.parse(data);
    var idList = [], shuffledList;

    //Generate an array of id values
    for(var i = 0; i < max; i++)
    {
        idList[i] = data.questionList[i].id;
    }

    shuffledList = shuffle(idList);
    return shuffledList;
}

function shuffle(array)
{
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex)
    {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function hide(idName)
{
    var answer = $("#" + idName);
    answer.addClass('hidden', 'invisible');
}

function noHide(idName)
{
    var answer = $("#" + idName);
    answer.removeClass('hidden', 'invisible');
}