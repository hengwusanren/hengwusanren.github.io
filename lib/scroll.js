var scrollControl = function(el, callback) {
    var page = el,
        startX,
        startY,
        startTop,
        thenX, thenY, nowX, nowY,
        lastMoveTime,
        lastLastMoveTime,
        distX,
        distY,
        threshold = 150, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        thresholdTime = 100,
        acceleration = 3000,
        startTime,
        handleScroll = callback || function() {};

    page.addEventListener('touchstart', function(e) {
        var touchobj = e.changedTouches[0];
        thenX = nowX = startX = touchobj.pageX;
        thenY = nowY = startY = touchobj.pageY;
        startTime = lastLastMoveTime = lastMoveTime = Date.now();
        startTop = scrollHelp.scrollPosition = scrollHelp.stopTranslate(this, scrollHelp.choice);

        e.preventDefault();
    }, false);

    page.addEventListener('touchmove', function(e) {
        var touchobj = e.changedTouches[0];

        var newY = startTop + touchobj.pageY - startY;
        if(newY > 0) newY = 0;
        var maxTranslateY = scrollHelp.getMaxTranslate(this);
        if(newY < maxTranslateY) newY = maxTranslateY;
        scrollHelp.scrollPosition = scrollHelp.setTranslate(this, newY, scrollHelp.choice);

        thenX = nowX;
        nowX = touchobj.pageX;
        thenY = nowY;
        nowY = touchobj.pageY;
        lastLastMoveTime = lastMoveTime;
        lastMoveTime = Date.now();

        e.preventDefault(); // prevent scrolling when inside DIV
    }, false);

    page.addEventListener('touchend', function(e) {
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        var elapsedTime = Date.now() - startTime;
        var scrollDir = null;
        if (elapsedTime <= allowedTime) {
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                scrollDir = (distX < 0) ? 'left' : 'right';
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
                scrollDir = (distY < 0) ? 'up' : 'down';
            }
        }

        var endTime = Date.now();

        if(endTime - lastMoveTime >= thresholdTime) return;
        var _timeDur = lastMoveTime - lastLastMoveTime;
        if(!_timeDur) _timeDur = 0;
        var initialSpeed = _timeDur ? ((nowY - thenY) * 1000 / _timeDur) : 0;
        scrollHelp.updateTransition(this, initialSpeed, acceleration, scrollHelp.scrollPosition, 0, scrollHelp.getMaxTranslate(this), scrollHelp.choice);

        handleScroll(this, scrollDir, elapsedTime, distX, distY, nowX - thenX, nowY - thenY, _timeDur, endTime - lastMoveTime, thresholdTime, acceleration);

        e.preventDefault();
    }, false);
};

var scrollHelp = {
    choice: 0, // 0: transform, 1: top
    scrollPosition: 0,
    scrollStyle: null,
    getMaxTranslate: function(el) {
        return (el.parentElement ? el.parentElement.clientHeight : 0) - el.clientHeight;
    },
    setTranslate: function (el, d, chc) {
        var t = d || 0;
        if(t > 0) t = 0;
        else if(t < this.getMaxTranslate(el)) t = this.getMaxTranslate(el);

        var tt = t;

        if(chc == 0) {
            t = 'translate3d(0,' + t + 'px,0)';
            el.style.transform = t;
            el.style.WebkitTransform = t;
        } else if(chc == 1) {
            el.style.top = t + 'px';
        }

        return tt;
    },
    calTranslate: function (s0, v, a) {
        return parseFloat(s0) + (v > 0 ? 1 : -1) * v * v / (2 * Math.abs(a));
    },
    setTransitionClass: function(el, time, x1, y1, x2, y2) {
        if(scrollHelp.scrollStyle) document.getElementsByTagName('head')[0].removeChild(scrollHelp.scrollStyle);
        scrollHelp.scrollStyle = document.createElement('style');
        scrollHelp.scrollStyle.type = 'text/css';
        var t = 'transition:  all ' + time + 's cubic-bezier(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ');';
        t = '-webkit-' + t + t;
        scrollHelp.scrollStyle.innerHTML = '.scroll-transition { ' + t + ' }';
        document.getElementsByTagName('head')[0].appendChild(scrollHelp.scrollStyle);

        el.className = 'scroll-transition';
    },
    updateTransition: function(el, v, a, p, _b0, _b1, chc) {
        if(a > 0) a = -a;
        var b0 = _b0 || 0,
            b1 = _b1 || this.getMaxTranslate(el),
            newP = this.calTranslate(p, v, a),
            d = 0;

        if(newP > b0) d = b0 - p;
        else if(newP < b1) d = p - b1;
        else d = Math.abs(newP - p);

        v = Math.abs(v);

        var foo = v * v + 2 * a * d;
        if(foo < 0) foo = 0;
        var time = (Math.sqrt(foo) - v) / a,
            x1 = 1/3,
            y1 = v * time / d / 3,
            x2 = x1 + 1/3,
            y2 = y1 + 1/3;

        console.log({
            v0: v,
            t: time,
            s: d,
            p0: p,
            p1: newP
        });

        this.setTransitionClass(el, time, x1, y1, x2, y2);

        this.setTranslate(el, newP, chc);
    },
    stopTranslate: function(el, chc) {
        var computedStyle = window.getComputedStyle(el);
        var t;

        if(chc == 0) {
            t = computedStyle.getPropertyValue('transform');
            el.style.transform = t;
            el.style.WebkitTransform = t;

            if(t != 'none') {
                t = t.substring(t.lastIndexOf(', ') + 2, t.length - (t.endsWith('px)') ? 3 : 1));
            }
        } else if(chc == 1) {
            t = computedStyle.getPropertyValue('top');
            el.style.top = t;

            if(t != 'none') {
                t = t.substring(0, t.length - (t.endsWith('px') ? 2 : 0));
            }
        }
        if(t == 'none') {
            t = 0;
        }

        el.className = '';

        return parseFloat(t);
    }
};