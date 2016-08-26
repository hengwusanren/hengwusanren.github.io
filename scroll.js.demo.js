requirejs.config({
    paths: {
        mock: 'http://mockjs.com/dist/mock',
        scroll: './lib/scroll',
        hide: './lib/hide'
    }
});

requirejs(['scroll', 'hide'], function(Scroll, Hide) {
    var getUrlParameter = function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    };
    var getUrlHash = function () {
        var url = window.location.href;
        if (url.indexOf('#') < 0) return '';
        return url.substring(url.indexOf('#') + 1);
    };
    var test_listLength = parseInt(getUrlParameter('size') || '1000', 10);
    var test_addScrollContent = function(div) {
        for (var i = 0; i < test_listLength; i++) {
            var child = document.createElement('div');
            child.className = 'test-div';
            child.innerHTML = div.childNodes.length + 1;
            div.appendChild(child);
        }
    };
    var test_targetDom = document.getElementById('div1');
    var test_choice = getUrlParameter('hide'),
        test_offset = parseInt(getUrlParameter('offset'), 10),
        test_range = parseInt(getUrlParameter('range'), 10);

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
        if(test_choice === 'true') Hide.update(scrollPosition, scrollDir);
    });
    if(test_choice === 'true') Hide.init(test_targetDom, {
        offset: test_offset,
        range: test_range
    });
});
