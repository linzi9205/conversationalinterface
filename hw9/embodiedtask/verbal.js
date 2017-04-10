/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "zh-CN";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js

      var bot_response = decide_response(user_said)
      speak(bot_response)

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
var response;
    var play_re1 = /xia'yi'liang\s(.+)\sgong'jiao'che/i;  // creating a regular expression
    var play_re2 = /xia'yi'liang\s(.+)\sgong'jiao'che'kai'wang'shi'nei/i;  // creating a regular expression
    var play_re3 = /xia'yi'liang\s(.+)\sgong'jiao'che'kai'wang'shi'wai/i;  // creating a regular expression
    var play_re4 = /xia'yi'liang\s(.+)\she\s(.+)\sgong'jiao'che/i;  // creating a regular expression

    var play_parse_array1 = user_said.match(play_re1) // parsing the input string with the regular expression
    var play_parse_array2 = user_said.match(play_re2) // parsing the input string with the regular expression
    var play_parse_array3 = user_said.match(play_re3) // parsing the input string with the regular expression
    var play_parse_array4 = user_said.match(play_re4) // parsing the input string with the regular expression

    console.log(play_parse_array1) // let's print the array content to the console log so we understand 
    console.log(play_parse_array2) // let's print the array content to the console log so we understand 
    console.log(play_parse_array3) // let's print the array content to the console log so we understand 
    console.log(play_parse_array4) // let's print the array content to the console log so we understand 
                           // what's inside the array.

    if (play_parse_array1 && state === "initial") {
      response = "hao'de,xia'yi'liang" + play_parse_array1[1]+"gong'jiao'che'zai'5'fen'zhong'hou";
    } else if (play_parse_array2 && state === "initial") {
      response = "hao'de,xia'yi'liang" + play_parse_array2[1]+"gong'jiao'che'kai'wang'shi'nei'zai'5'fen'zhong'hou";
    } else if (play_parse_array3 && state === "initial") {
      response = "hao'de,xia'yi'liang" + play_parse_array3[1]+"gong'jiao'che'kai'wang'shi'wai'zai'5'fen'zhong'hou";
    } else if (play_parse_array4 && state === "initial") {
      response = "hao'de,xia'yi'liang" + play_parse_array4[1]+"gong'jiao'che'zai'5'fen'zhong'hou"+"xia'yi'liang" + play_parse_array2[2]+"gong'jiao'che'zai'10'fen'zhong'hou";
    } else if (user_said.toLowerCase().includes("zai'jian")) {
      response = "zai'jian";
      state = "initial";
    }else {
      response = "ni'zai'shuo'sha";
    }
    return response;
}

/* Load and print voices */
function printVoices() {
  // Fetch the available voices.
  var voices = speechSynthesis.getVoices();
  
  // Loop through each of the voices.
  voices.forEach(function(voice, i) {
        console.log(voice.name)
  });
}

printVoices();

/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  console.log("Voices: ")
  printVoices();

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';
  u.volume = 0.5 //between 0.1
  u.pitch = 2.0 //between 0 and 2
  u.rate = 1.0 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Ting-Ting"; })[0]; //pick a voice

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}