define(function() {
    return {
        control: function(el, callback) {
            var page = el,
                startX,
                startY,
                startTop,
                thenX, thenY, nowX, nowY,
                lastMoveTime,
                lastLastMoveTime,
                totalDistX,
                totalDistY,
                threshold = 150, //required min distance traveled to be considered swipe
                restraint = 100, // maximum distance allowed at the same time in perpendicular direction
                allowedTime = 300, // maximum time allowed to travel that distance
                thresholdTime = 100,
                acceleration = 5000,
                startTime,
                handleScroll = callback || function() {},
                scrollPosition = 0,
                transitionId = 'scroll-transition-' + Date.now(),
                distXIntervals = [],
                distYIntervals = [],
                timeIntervals = [],
                ScrollHelp = {
                    choice: 0, // 0: transform, 1: top
                    calSpeed: function(dists, times, dist, time) {
                        // var t = times[times.length - 1];
                        // if (!t) t = 0;
                        // var v = t ? (dists[dists.length - 1] * 1000 / t) : 0;

                        var len = dists.length;
                        if(len <= 0) return 0;
                        if(len == 1) {
                            if(times[0] <= 0) return 0;
                            return dists[0] / times[0];
                        }
                        if(len <= 3) {
                            return dist / time;
                        }
                        if(len <= 5) {
                            return ((dists[len - 1] + dists[len - 2]) / (times[len - 1] + times[len - 2])) * 2
                                - (dists[len - 3] + dists[len - 4]) / (times[len - 3] + times[len - 4]);
                        }
                        return ((dists[len - 1] + dists[len - 2] + dists[len - 3]) / (times[len - 1] + times[len - 2] + times[len - 3])) * 2
                            - (dists[len - 4] + dists[len - 5] + dists[len - 6]) / (times[len - 4] + times[len - 5] + times[len - 6]);
                    },
                    getMaxTranslate: function(el) {
                        return (el.parentElement ? el.parentElement.clientHeight : 0) - el.clientHeight;
                    },
                    setTranslate: function(el, d, chc) {
                        var t = d || 0;
                        if (t > 0) t = 0;
                        else if (t < this.getMaxTranslate(el)) t = this.getMaxTranslate(el);

                        var tt = t;

                        if (chc == 0) {
                            t = 'translate3d(0,' + t + 'px,0)';
                            el.style.transform = t;
                            el.style.WebkitTransform = t;
                        } else if (chc == 1) {
                            el.style.top = t + 'px';
                        }

                        return tt;
                    },
                    _calTranslate: function(s0, v, a) {
                        return parseFloat(s0) + (v > 0 ? 1 : -1) * v * v / (2 * Math.abs(a));
                    },
                    _setTransitionClass: function(el, time, x1, y1, x2, y2, className) {
                        if (this[className]) document.getElementsByTagName('head')[0].removeChild(this[className]);
                        this[className] = document.createElement('style');
                        this[className].type = 'text/css';
                        var t = 'transition: all ' + time + 's cubic-bezier(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ');';
                        t = '-webkit-' + t + t;
                        this[className].innerHTML = '.' + className + ' { ' + t + ' }';
                        document.getElementsByTagName('head')[0].appendChild(this[className]);

                        el.className = className;
                    },
                    updateTransition: function(el, v, a, p, _b0, _b1, chc, className) {
                        if (a > 0) a = -a;
                        var b0 = _b0 || 0,
                            b1 = _b1 || this.getMaxTranslate(el),
                            newP = this._calTranslate(p, v, a),
                            d = 0;

                        if (newP > b0) d = b0 - p;
                        else if (newP < b1) d = p - b1;
                        else d = Math.abs(newP - p);

                        v = Math.abs(v);

                        var foo = v * v + 2 * a * d;
                        if (foo < 0) foo = 0;
                        var time = (Math.sqrt(foo) - v) / a,
                            x1 = 1 / 3,
                            y1 = v * time / d / 3,
                            x2 = x1 + 1 / 3,
                            y2 = y1 + 1 / 3;

                        // console.log({
                        //     v0: v,
                        //     t: time,
                        //     s: d,
                        //     p0: p,
                        //     p1: newP
                        // });

                        this._setTransitionClass(el, time, x1, y1, x2, y2, className);

                        return this.setTranslate(el, newP, chc);
                    },
                    stopTranslate: function(el, chc) {
                        var computedStyle = window.getComputedStyle(el);
                        var t;

                        if (chc == 0) {
                            t = computedStyle.getPropertyValue('transform');
                            el.style.transform = t;
                            el.style.WebkitTransform = t;

                            if (t != 'none') {
                                t = t.substring(t.lastIndexOf(', ') + 2, t.length - (t.endsWith('px)') ? 3 : 1));
                            }
                        } else if (chc == 1) {
                            t = computedStyle.getPropertyValue('top');
                            el.style.top = t;

                            if (t != 'none') {
                                t = t.substring(0, t.length - (t.endsWith('px') ? 2 : 0));
                            }
                        }
                        if (t == 'none') {
                            t = 0;
                        }

                        el.className = '';

                        return parseFloat(t);
                    }
                };

            page.addEventListener('touchstart', function(e) {
                var touchobj = e.changedTouches[0];
                thenX = nowX = startX = touchobj.pageX;
                thenY = nowY = startY = touchobj.pageY;
                startTime = lastLastMoveTime = lastMoveTime = Date.now();
                startTop = scrollPosition = ScrollHelp.stopTranslate(this, ScrollHelp.choice);

                distXIntervals = [],
                distYIntervals = [],
                timeIntervals = [];

                e.preventDefault();
            }, false);

            page.addEventListener('touchmove', function(e) {
                var touchobj = e.changedTouches[0];

                var newY = startTop + touchobj.pageY - startY;
                if (newY > 0) newY = 0;
                var maxTranslateY = ScrollHelp.getMaxTranslate(this);
                if (newY < maxTranslateY) newY = maxTranslateY;
                scrollPosition = ScrollHelp.setTranslate(this, newY, ScrollHelp.choice);

                thenX = nowX;
                nowX = touchobj.pageX;
                thenY = nowY;
                nowY = touchobj.pageY;
                lastLastMoveTime = lastMoveTime;
                lastMoveTime = Date.now();

                distXIntervals.push(nowX - thenX);
                distYIntervals.push(nowY - thenY);
                timeIntervals.push(lastMoveTime - lastLastMoveTime);

                e.preventDefault(); // prevent scrolling when inside DIV
            }, false);

            page.addEventListener('touchend', function(e) {
                var touchobj = e.changedTouches[0];
                totalDistX = touchobj.pageX - startX;
                totalDistY = touchobj.pageY - startY;
                var elapsedTime = Date.now() - startTime;
                var scrollDir = null;
                if (elapsedTime <= allowedTime) {
                    if (Math.abs(totalDistX) >= threshold && Math.abs(totalDistY) <= restraint) {
                        scrollDir = (totalDistX < 0) ? 'left' : 'right';
                    } else if (Math.abs(totalDistY) >= threshold && Math.abs(totalDistX) <= restraint) {
                        scrollDir = (totalDistY < 0) ? 'up' : 'down';
                    }
                }

                var endTime = Date.now();
                if (endTime - lastMoveTime >= thresholdTime) return;

                var initialSpeed = 1000 * ScrollHelp.calSpeed(distYIntervals, timeIntervals, totalDistY, elapsedTime);
                // console.log(initialSpeed);
                var transBoundary = ScrollHelp.getMaxTranslate(this);
                var curPosition = ScrollHelp.updateTransition(this, initialSpeed, acceleration, scrollPosition, 0, transBoundary, ScrollHelp.choice, transitionId);

                handleScroll(this, scrollDir, totalDistX, totalDistY, elapsedTime, distXIntervals, distYIntervals, timeIntervals, curPosition, transBoundary);

                e.preventDefault();
            }, false);
        }
    };
});
