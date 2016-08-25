requirejs.config({
    paths: {
        mock: 'http://mockjs.com/dist/mock',
        scroll: './lib/scroll',
        hide: './lib/hide'
    }
});

requirejs(['scroll', 'hide'], function(Scroll, Hide) {
    var test_listLength = 1000;
    var test_choice = window.location.hash;
    var test_addScrollContent = function(div) {
        for (var i = 0; i < test_listLength; i++) {
            var child = document.createElement('div');
            child.className = 'test-div';
            child.innerHTML = div.childNodes.length + 1;
            div.appendChild(child);
        }
    };
    var test_targetDom = document.getElementById('div1');

    // window.setInterval(function() {
        test_addScrollContent(test_targetDom);
    // }, 2000);

    new Scroll.control(test_targetDom, function(elem, scrollDir, totalDistX, totalDistY, elapsedTime, distXIntervals, distYIntervals, timeIntervals, scrollPosition, transBoundary) {
        // console.log({
        //     dist: totalDistX + ',' + totalDistY,
        //     time: elapsedTime,
        //     dists: distYIntervals,
        //     times: timeIntervals,
        //     pos: scrollPosition,
        //     bdr: transBoundary
        // });
        if(test_choice === '#1') Hide.update(scrollPosition);
    });
    if(test_choice === '#1') Hide.init(test_targetDom);
});
