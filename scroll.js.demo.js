requirejs.config({
    paths: {
        mock: 'http://mockjs.com/dist/mock',
        scroll: './lib/scroll'
    }
});

requirejs(['mock', 'scroll'], function(Mock, Scroll) {
    var test_listLength = 100;
    var test_data = Mock.mock({
        'list|1-100': [{
            'id|+1': 1
        }]
    });

    console.log(test_data);

    var test_addScrollContent = function(div) {
        for (var i = 0; i < 100; i++) {
            var child = document.createElement('div');
            child.className = 'test-div';
            child.innerHTML = i;
            div.appendChild(child);
        }
    };

    test_addScrollContent(document.getElementById('div1'));
    new Scroll.control(document.getElementById('div1'), function(elem, scrollDir, totalDistX, totalDistY, elapsedTime, distXIntervals, distYIntervals, timeIntervals, scrollPosition, transBoundary) {
        // console.log({
        //     dist: totalDistX + ',' + totalDistY,
        //     time: elapsedTime,
        //     dists: distYIntervals,
        //     times: timeIntervals,
        //     pos: scrollPosition,
        //     bdr: transBoundary
        // });
    });

    test_addScrollContent(document.getElementById('div2'));
    new Scroll.control(document.getElementById('div2'), function(elem, scrollDir, totalDistX, totalDistY, elapsedTime, distXIntervals, distYIntervals, timeIntervals, scrollPosition, transBoundary) {
        //TODO
    });
});
