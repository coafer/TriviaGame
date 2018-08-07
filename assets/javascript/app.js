$(document).ready(function() {
  //Set global variables for correct, unanswered and incorrect answers
  var questionsRight = 0;
  var questionsWrong = 0;
  var questionsNotAnswered = 0;
  var userChoice;
  var correct_answer;
  var intervalId;
  var clockRunning = false;
  var time = 180;

  var listenR = [];

  var lineCreator = function(obj) {
    console.log(obj);

    //Create jQuery Objects
    var quest_cont = $("#quest_cont");
    var quest_label = $("<label>");

    //Create jQuery through loop
    for (var i = 0; i < 10; i++) {
      //Attach questions on HTML element container
      var q_id = $("<p>")
        .attr("data-id", i)
        .html(obj.results[i].question);
      var question_p = quest_cont
        .append(q_id)
        .addClass("text-center d-block p-2 bg-primary text-white");

      //add form
      var quest_form = $("<form>").appendTo(question_p);
      //Joining answers wrong and right
      var joined = obj.results[i].incorrect_answers.concat(
        obj.results[i].correct_answer
      );
      //Shuffling answers for not placing them on the same spot
      var answerToDisplay = shuffle(joined);
      $.each(answerToDisplay, function(index, el) {
        var answerData = obj.results[i];
        //Set radio btn correct attribute or incorrect attribute
        function stampId(val) {
          if (answerData.correct_answer === val) {
            return "1";
          } else {
            return "0";
          }
        }
        //Add input radio button
        var answer = $(
          '<input type="radio" name="quest" id="' +
            el +
            '" data-reference="' +
            stampId(el) +
            '" value="' +
            el +
            '"><label for =' +
            el +
            ">" +
            el +
            "</label>"
        ).attr("data-id", i);
        quest_form.append(answer);
      });
    }
  };

  //Ajax call to get the questions from API
  function loadTrivia() {
    var data = "https://opentdb.com/api.php?amount=10&type=multiple";
    $.ajax({
      url: data,
      method: "GET"
    }).then(lineCreator);
  }

  //https://bost.ocks.org/mike/shuffle/
  //Fisher–Yates shuffle, use it for shuffling
  var shuffle = function(array) {
    var i = 0,
      j = 0,
      temp = null;
    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  //Set btn attributes
  var btnToggle = function(a) {
    $(".btn").text(a);
    $(".btn").attr("name", a);
  };

  // =================== Timer start here ===================

  var timeConverter = function(t) {
    var minutes = Math.floor(t / 60);
    var seconds = t - minutes * 60;

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes <= 0) {
      minutes = "00";
    } else if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
  };

  var count = function() {
    // Decrement time by 1
    time--;

    if (time === 0) {
      stop();
      reset();
      $("#quest_cont").empty();
      btnToggle("Play again");
      results();
    }
    // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
    //       and save the result in a variable.
    var converted = timeConverter(time);

    // DONE: Use the variable we just created to show the converted time in the "display" div.
    $("#clock-display").text(converted);
  };

  var stop = function() {
    // DONE: Use clearInterval to stop the count here and set the clock to not be running.
    clearInterval(intervalId);
    clockRunning = false;
  };

  var start = function() {
    // DONE: Use setInterval to start the count here and set the clock to running.
    if (!clockRunning) {
      intervalId = setInterval(count, 1000);
      clockRunning = true;
    }
  };

  var reset = function() {
    time = 180;

    // DONE: Change the "display" div to "00:00."
    $("#clock-display").text("03:00");
  };

  // =================== Timer finish here ===================

  //Button text changer
  var startPlaying = $(".btn").on("click", function() {
    var btn = $(this);
    if (btn.prop("name") == "lets-play") {
      //Load questions and btns from API function
      loadTrivia();
      //Change btn to the other behavior
      btnToggle("I am done");
      //set the timer on
      start();
    } else if (btn.prop("name") == "Play again") {
      $("#quest_cont").empty();
      $("#quest_cont")
        .append("<div>")
        .attr("id", "quest_cont")
        .addClass("text-center d-block p-2 bg-primary text-white");
      loadTrivia();
      btnToggle("I am done");
      reset();
      start();
    } else {
      $("#quest_cont").empty();
      stop();
      btnToggle("Play again");
      //show results
      console.log(listenR);
      results();
    }
  });

  $(document).on("change", "input", function() {
    var countChecked = $("input:checked").data("reference");
    console.log(countChecked + "chequeado");
    // var customAttributeData = $(this).data("reference");
    // console.log(customAttributeData + " is checked!");
    // if (customAttributeData == 1) {
    //   questionsRight++;
    //   console.log(questionsRight);
    // } else {
    //   questionsWrong++;
    //   console.log(questionsWrong);
    // }
  });

  //Calculate results
  var results = function() {
    var notAnswered = 10 - (questionsWrong + questionsRight);
    var c = $("<div>");
    var p_2 = c
      .append(
        "<p>You have responded correctly:" +
          " " +
          questionsRight +
          " " +
          " answers.</p>"
      )
      .append(
        "<p>You have not responded correctly:" +
          " " +
          questionsWrong +
          " " +
          "answers.</p>"
      )
      .append(
        "<p>You have not answered:" + " " + notAnswered + " " + "answers.</p>"
      );

    $("#quest_cont").prepend(p_2);
    questionsRight = 0;
    questionsWrong = 0;
  };
});
