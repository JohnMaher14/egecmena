// ! function (s) {
//   "use strict";
//   s(document).ready(function () {
//     var e = document.querySelector(".progress-wrap path");
//     var  t = e.getTotalLength();
//     e.style.transition = e.style.WebkitTransition = "none", e.style.strokeDasharray = t + " " + t, e.style.strokeDashoffset = t, e.getBoundingClientRect(), e.style.transition = e.style.WebkitTransition = "stroke-dashoffset 10ms linear";
//     var o = function () {
//       var o = s(window).scrollTop();
//       var  r = s(document).height() - s(window).height()
//       var  i = t - o * t / r;
//       e.style.strokeDashoffset = i
//     };
//     o(), s(window).scroll(o);

//   })
// }(jQuery);
$(document).ready(function(){
        var e = document.querySelector(".progress-wrap path");
        var  t = e?.getTotalLength();
        e.style.transition = e.style.WebkitTransition = "none",
         e.style.strokeDasharray = t + " " + t,
          e.style.strokeDashoffset = t, e.getBoundingClientRect(),
           e.style.transition = e.style.WebkitTransition = "stroke-dashoffset 10ms linear";
        var o = function () {
          var o = $(window).scrollTop();
          var  r = $(document).height() - $(window).height()
          var  i = t - o * t / r;
          e.style.strokeDashoffset = i
        };
        o(), $(window).scroll(o);


  $('.progress-wrap').on('click', function () {
      $("html, body").animate({
          scrollTop: 0
      }, 600);
      return false;
    });
    $(document).scroll(function(){
      var footerSelector = $('#footer');
      var socialBarSelector = $('#sidebar');

      var bottomViewPort = $(window).scrollTop()+$(window).height();
      var footerTop = $(footerSelector).offset().top;
      if( bottomViewPort>=footerTop){
        $(socialBarSelector).addClass('active_none')
      }else{
        $(socialBarSelector).removeClass('active_none')
      }
    });

  });

