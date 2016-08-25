requirejs.config({
    paths: {
        mock: 'http://mockjs.com/dist/mock',
        scroll: './lib/scroll',
        html2canvas: './lib/html2canvas'
    }
});

requirejs(['scroll'], function(Scroll) {
    var test_listLength = 1000;
    var test_addScrollContent = function(div) {
        for (var i = 0; i < test_listLength; i++) {
            var child = document.createElement('div');
            child.className = 'test-div';
            child.innerHTML = div.childNodes.length + 1;
            div.appendChild(child);
        }
    };
    var test_zumbieChildren = function(div, offset, number) {
        var blankDiv = document.createElement('div');
        var height = 0;
        blankDiv.setAttribute('style', 'width:100%;height:0;padding:0;border:0;margin:0;');
        div.insertBefore(blankDiv, div.childNodes[offset]);
        for (var i = 1; i <= number; i++) {
            var curNode = div.childNodes[offset + i];
            height += curNode.clientHeight;
            blankDiv.style.height = height + 'px';
            curNode.style.display = 'none';
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
    });

    test_zumbieChildren(test_targetDom, 0, 10);
});
