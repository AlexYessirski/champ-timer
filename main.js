//HTML/CSS connections
const timer = document.querySelector('.timer');

const ufc_bar = document.querySelector('.ufc-bar');
const bar1 = document.querySelector('.bar-1')
const bar2 = document.querySelector('.bar-2')
const bar3 = document.querySelector('.bar-3')
const bar4 = document.querySelector('.bar-4')
const bar5 = document.querySelector('.bar-5')

const start_button = document.querySelector('.start-button');
const pause_button = document.querySelector('.pause-button');
const resume_button = document.querySelector('.resume-button');
const reset_button = document.querySelector('.reset-button');

const title = document.querySelector('.title');
const belt_container = document.querySelector('.belt-container');

//time variables
//podmoro timer of 25 mins = 25 * 60 secs
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let timerID = null;
var roundCompleted = false; // One Round = Work Timer + Break Timer
var ufcRound = 0;
var matchCount = 0;
var paused = false;
var justResumed = false;

var boxing_bell = document.getElementById("myAudio");


window.onload = () => {
   Notification.requestPermission();
}

//Function to update ufc bar
const updateBar = (round) => {
   bar1.textContent = "";
   bar2.textContent = "";
   bar3.textContent = "";
   bar4.textContent = "";
   bar5.textContent = "";

   bar1.setAttribute("class", "bar-1");
   bar2.setAttribute("class", "bar-2");
   bar3.setAttribute("class", "bar-3");
   bar4.setAttribute("class", "bar-4");
   bar5.setAttribute("class", "bar-5");

   let bar = document.querySelector('.bar-' + round);
   bar.setAttribute("class", "bar-" + round + " active-round")
   bar.textContent = "R" + round;
}

//Function to count down the timer
const countDown = (time) => {
   return () => {
      const mins = Math.floor(time/60).toString().padStart(2, '0');
      const secs = Math.floor(time % 60).toString().padStart(2, '0');
      timer.textContent = `${mins}:${secs}`;
      time--;
      if (time < 0){
         stopTimer();
         if (roundCompleted === false && timer.style.backgroundColor !== "rgba(0, 255, 0, 0.5)") {
            timerID = startTimer(BREAK_TIME);
            roundCompleted = true;
         } else {
            new Notification("BREAK OVER");
            title.textContent = "END OF BREAK";
         }
      }
   }
}

//Arrow Function to start timer
const startTimer = (startTime) => {
   //if we start the timer at there is a previous count left (timerID != null), reset the timer and do not
   //count this start button press as an additional "round"
   if (timerID !== null) {
      roundCompleted = false;
      stopTimer();
      ufcRound--;
   }

   roundCompleted = false;
   //if we are starting the break timer
   //log it
   //change the timer to green
   //change the title text to say break
   if (startTime == BREAK_TIME) {
      console.log("Break Started!");

      //play alert
      boxing_bell.play();

      new Notification("PODMORO OVER");
      
      timer.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
      title.textContent = "BREAK";
   } else {
      //if we are starting a podmoro timer
      //add a ufc round and update the bar
      //if we are over 5 rounds in, we have earned a matchCount & reset the ufc bar
      //log it to console
      //change timer to red
      //change title to say podmoro
      if (justResumed == false) {
         ufcRound++;
      }
      if (ufcRound > 5) {
         ufcRound = 1;
         matchCount++;
         let belt = document.createElement("div");
         belt_container.appendChild(belt);
         belt.textContent = "C";
      }
      updateBar(ufcRound);
      console.log("Podmoro Started!");
      if (startTime == WORK_TIME){
         timer.style.backgroundColor = "rgba(0, 0, 0, 0)";
      }
      title.textContent = "PODMORO";
   }

   //return a countdown from startTime over 1000 interval 
   return setInterval(countDown(startTime), 1000);
}

const stopTimer = () => {
   console.log("Timer Stopped");
   clearInterval(timerID);
   timerID = null;
}

const getTimeInSeconds = (timeString) => {
   const[minutes, seconds] = timeString.split(":");
   return parseInt(minutes * 60) + parseInt(seconds) ;
}

// Adding event listener to the start button
start_button.addEventListener('click', ()=> {
   timerID = startTimer(WORK_TIME);
})

pause_button.addEventListener('click', ()=> {
   stopTimer();
   paused = true;
   title.textContent = "PAUSED";
})

resume_button.addEventListener('click', () => {
   if (paused == true) {
      justResumed = true;
      title.textContent = "PODMORO";
      pause_button.textContent = "PAUSE";

      const currentTime = getTimeInSeconds(timer.textContent);
      timerID = startTimer(currentTime);
      justResumed = false;
      paused = false;
   }
})

reset_button.addEventListener('click', ()=> {
   roundCompleted = false;
   stopTimer();
   timer.style.backgroundColor = "rgba(0, 0, 0, 0)";
   timer.textContent = "25:00";
   title.textContent = "PRESS START";
   ufcRound = 0;
   matchCount = 0;
   while (belt_container.hasChildNodes()) {
      belt_container.removeChild(belt_container.firstChild);
   }
   updateBar(ufcRound);
   roundCompleted = false;
   paused = false;
})



