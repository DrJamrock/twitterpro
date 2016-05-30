// "use strict";

// function delayedLogger (delay, end, index) {
//   if (!end) {
//     var end = 10;
//   }
//   if (!index) {
//     var index = 0;
//   }
//   if (index === end) {
//     return;
//   }
//   console.log(index);
//   setTimeout(function () {
//      delayedLogger(delay, end, index + 1);
//   }, i * delay || i * 100 );
// }

// delayedLogger(100, 15);


for (var i = 0; i < 4; i++){
  function logger (input) {
    console.log(input);
  }

  (function (i) {
    setTimeout(function () {
      logger(i)
    },1000 * i)
  }(i));

}