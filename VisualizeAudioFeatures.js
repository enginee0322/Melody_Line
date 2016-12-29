var context;
var source = null;
var myAudioBuffer = null;

var sourceNode = null;
var mediaSourceNode = null;
var analyser = null;


var loudness_view;
var loudness_value;

var pitch_view;
var pitch_value;

var sc_view;
var sc_value;

var WIDTH = 900;
var HEIGHT = 450;


var micOn = false;
var filePlayOn = false;


var pitch_ani_id;


// load demo audio feils
var demo_buffer;

window.onload=function(){

    var mic = document.getElementById("micInput");
    mic.addEventListener("click", playMic, false);

    var demoAudio = document.getElementById("demoAudio");
    demoAudio.addEventListener("click", playFile, false);



    pitch_view = document.getElementById("pitchView");
    pitch_value = document.getElementById("pitchValue");
    pitch_periodicity = document.getElementById("pitchPeriodicity");
    pitch_view.width =  WIDTH;
    pitch_view.height = HEIGHT;



    // create audio context
    context = new AudioContext();

    // analyzer
    analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0;


    var demoReq = new XMLHttpRequest();
    demoReq.open("Get","demo1.wav",true);
    demoReq.responseType = "arraybuffer";
    demoReq.onload = function(){
        context.decodeAudioData(demoReq.response, function(buffer){demo_buffer = buffer;});
    }
    demoReq.send();
}







var prev_pitch_level = 0;
var pitch_env = 0;
var drawing= new Array(2*WIDTH/3);
for (var i=0; i <2*WIDTH/3;i++ ) {
    drawing[i] = 0;
}




function draw_pitch() {

    // get samples
    var data_array = new Float32Array(analyser.frequencyBinCount*2);
    analyser.getFloatTimeDomainData(data_array);

    // call pitch detection algorithm
    var pitch_array = detect_pitch(data_array)
    pitch = pitch_array[0];
    periodicity = pitch_array[1];



    if (pitch >= prev_pitch_level) {
        pitch_env = pitch;

        prev_pitch_level = pitch;

    }else {
        prev_pitch_level= prev_pitch_level*0.95;

        pitch_env = prev_pitch_level;
    }

    // display the pitch value
    if (pitch > 0 ) {
        pitch_value.innerHTML = 'Pitch: ' + pitch_env + ' Hz'
    }
    else {
        pitch_value.innerHTML = 'No Pitch'
    }












    for (var i=0; i <2*WIDTH/3;i++ ){

        drawing[i] = drawing[i+1]



    }
    drawing[2*WIDTH/3] = pitch_env




    // 2d canvas context
    var drawContext = pitch_view.getContext('2d');

    // fill rectangular
    drawContext.fillStyle = 'rgb(200, 200, 200)';
    drawContext.fillRect(0, 0, WIDTH, HEIGHT);


    drawContext.beginPath();
    for (var i=0; i <2*WIDTH/3;i++ ){
        //drawContext.rect(i, HEIGHT, 5, -HEIGHT*(drawing[i]-55)/1705)

        drawContext.rect(i, HEIGHT, 15, -HEIGHT*(Math.log(drawing[i])-Math.log(55))/(Math.log(1760)-Math.log(55)))
    }
    drawContext.fillStyle = 'rgb(0,0,0)' ;
    drawContext.fill();


    var dist = new Array(60);
    for (var i=0; i <60;i++ ) {
        dist[i] = 0;
    }
    min = 300000;
    for (var i=0; i<60; i++) {
        dist[i] = Math.abs(55 * Math.pow(1.0594630943592952645618252949463, i) - pitch)

        if(dist[i]<min){
            min = dist[i]
            index = i;


        }
    }



    if(index % 12 == 0 ){
        not = "A"
        if(Math.floor(index / 12) == 0){
            octave = 1}
        if(Math.floor(index / 12) == 1){
            octave = "2"}
        if(Math.floor(index / 12) == 2){
            octave = "3"}
        if(Math.floor(index / 12) == 3){
            octave = "4"}
        if(Math.floor(index / 12) == 4){
            octave = "5"}
        if(Math.floor(index / 12) == 5){
            octave = "6"}


    }

    if(index % 12 == 1 ) {
        not = "A#"
        if (Math.floor(index / 12) == 0) {
            octave = 1
        }
        if (Math.floor(index / 12) == 1) {
            octave = "2"
        }
        if (Math.floor(index / 12) == 2) {
            octave = "3"
        }
        if (Math.floor(index / 12) == 3) {
            octave = "4"
        }
        if (Math.floor(index / 12) == 4) {
            octave = "5"
        }
        if (Math.floor(index / 12) == 5) {
            octave = "6"
        }
    }
    if(index % 12 == 2 ){
        not = "B"
        if(Math.floor(index / 12) == 0){
            octave = 1}
        if(Math.floor(index / 12) == 1){
            octave = "2"}
        if(Math.floor(index / 12) == 2){
            octave = "3"}
        if(Math.floor(index / 12) == 3){
            octave = "4"}
        if(Math.floor(index / 12) == 4){
            octave = "5"}
        if(Math.floor(index / 12) == 5){
            octave = "6"}
    }
    if(index % 12 == 3 ){
        not = "C"
        if(Math.floor(index / 12 )== 0){
            octave = 2}
        if(Math.floor(index / 12 )== 1){
            octave = 3}
        if(Math.floor(index / 12 )== 2){
            octave = 4}
        if(Math.floor(index / 12 )== 3){
            octave = 5}
        if(Math.floor(index / 12) == 4){
            octave = 6}

    }
    if(index % 12 == 4 ){
        not = "C#"
        if(Math.floor(index / 12 )== 0){
            octave = 2}
        if(Math.floor(index / 12 )== 1){
            octave = 3}
        if(Math.floor(index / 12 )== 2){
            octave = 4}
        if(Math.floor(index / 12 )== 3){
            octave = 5}
        if(Math.floor(index / 12) == 4){
            octave = 6}

    }
    if(index % 12 == 5 ){
        not = "D"
        if(Math.floor(index / 12 )== 0){
            octave = 2}
        if(Math.floor(index / 12 )== 1){
            octave = 3}
        if(Math.floor(index / 12 )== 2){
            octave = 4}
        if(Math.floor(index / 12 )== 3){
            octave = 5}
        if(Math.floor(index / 12) == 4){
            octave = 6}

    }
    if(index % 12 == 6 ){
        not = "D#"
        if(Math.floor(index / 12 )== 0){
            octave = 2}
        if(Math.floor(index / 12 )== 1){
            octave = 3}
        if(Math.floor(index / 12 )== 2){
            octave = 4}
        if(Math.floor(index / 12 )== 3){
            octave = 5}
        if(Math.floor(index / 12) == 4){
            octave = 6}

    }
    if(index % 12 == 7 ){
        not = "E"
        if(Math.floor(index / 12 )== 0){
            octave = 2}
        if(Math.floor(index / 12 )== 1){
            octave = 3}
        if(Math.floor(index / 12 )== 2){
            octave = 4}
        if(Math.floor(index / 12 )== 3){
            octave = 5}
        if(Math.floor(index / 12) == 4){
            octave = 6}

    }
    if(index % 12 == 8 ){
        not = "F"
        if(Math.floor(index / 12 )== 0){
            octave = 2}
        if(Math.floor(index / 12 )== 1){
            octave = 3}
        if(Math.floor(index / 12 )== 2){
            octave = 4}
        if(Math.floor(index / 12 )== 3){
            octave = 5}
        if(Math.floor(index / 12) == 4){
            octave = 6}

    }
    if(index % 12 == 9 ){
        not = "F#"
        if(Math.floor(index / 12 )== 0){
            octave = 2}
        if(Math.floor(index / 12 )== 1){
            octave = 3}
        if(Math.floor(index / 12 )== 2){
            octave = 4}
        if(Math.floor(index / 12 )== 3){
            octave = 5}
        if(Math.floor(index / 12) == 4){
            octave = 6}

    }
    if(index % 12 == 10 ){
        not = "G"
        if(Math.floor(index / 12 )== 0){
            octave = 2}
        if(Math.floor(index / 12 )== 1){
            octave = 3}
        if(Math.floor(index / 12 )== 2){
            octave = 4}
        if(Math.floor(index / 12 )== 3){
            octave = 5}
        if(Math.floor(index / 12) == 4){
            octave = 6}

    }
    if(index % 12 == 11){
        not = "G#"
        if(Math.floor(index / 12 )== 0){
            octave = 2}
        if(Math.floor(index / 12 )== 1){
            octave = 3}
        if(Math.floor(index / 12 )== 2){
            octave = 4}
        if(Math.floor(index / 12 )== 3){
            octave = 5}
        if(Math.floor(index / 12) == 4){
            octave = 6}

    }



    if (index==0){

        note.innerHTML = 'No Note'
    }
    else {
        note.innerHTML = 'Note is ' + not + octave

    }














    //drawContext.beginPath();
    //drawContext.rect(WIDTH/2, HEIGHT, 10,-HEIGHT*(pitch_env-55)/1705);

    //drawContext.fillStyle = 'rgb(0,0,0)' ;
    //drawContext.fill();

    // queue for next callback
    pitch_ani_id = window.requestAnimationFrame(draw_pitch);
}


function playMic()
{
    if (filePlayOn) {
        turnOffFileAudio();
    }

    if (micOn) {
        turnOffMicAudio();
        return;
    }

    if (!navigator.getUserMedia)
        navigator.getUserMedia = (navigator.getUserMedia({audio: true}) || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    if (!navigator.getUserMedia)
        alert("Error: getUserMedia not supported!");

    // get audio input streaming
    navigator.getUserMedia({audio: true}, onStream, onStreamError)

    micOn = true;

    var mic = document.getElementById("micInput");
    mic.innerHTML = 'Mic Off'
}


// success callback
function onStream(stream) {
    mediaSourceNode = context.createMediaStreamSource(stream);

    // Connect graph
    mediaSourceNode.connect(analyser);

    // visualize audio

    draw_pitch();








}

// errorCallback
function onStreamError(error) {
    console.error('Error getting microphone', error);

    micOn = false;
}


function playFile() {
    if (filePlayOn) {
        turnOffFileAudio();
        return;
    }

    if (micOn) {
        turnOffMicAudio();
    }

    sourceNode = context.createBufferSource();

    sourceNode.buffer = demo_buffer;
    sourceNode.connect(context.destination);
    sourceNode.start(0);

    sourceNode.connect(analyser);

    // visualize audio

    draw_pitch();


    filePlayOn = true;

    var demoAudio = document.getElementById("demoAudio");
    demoAudio.innerHTML = 'Demo Audio Stop'
}


function turnOffMicAudio() {
    var mic = document.getElementById("micInput");
    mic.innerHTML = 'Mic On'
    mediaSourceNode = null;
    micOn = false;

    stopAnimation();
}

function turnOffFileAudio() {
    var demoAudio = document.getElementById("demoAudio");
    demoAudio.innerHTML = 'Demo Audio Play'
    sourceNode.stop(0);
    sourceNode = null;
    filePlayOn = false;

    stopAnimation();
}

function stopAnimation() {
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = window.webkitCancelAnimationFrame;


    window.cancelAnimationFrame(pitch_ani_id);

}
