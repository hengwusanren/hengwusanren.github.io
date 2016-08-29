define(['domini'], function(domini) {
    var cssSet = {
        'display': '|block|inline-block|flex|none',
        'position': '|relative|absolute|fixed',
        'top': '|0px',
        'right': '|0px',
        'bottom': '|0px',
        'left': '|0px',
        'float': '|right|left',
        'margin': '|0px',
        'border': '|0px',
        'padding': '|0px',
        'width': '|0px',
        'min-width': '|0px',
        'max-width': '|0px',
        'height': '|0px',
        'min-height': '|0px',
        'max-height': '|0px',
        'text-align': '|left|center|right',
        'white-space': '|nowrap',
        'word-wrap': '|break-word',
        'font-size': '|12px',
        'color': '|#000',
        'background': '|#000',
        'overflow': '|auto|visible|hidden',
        'opacity': '|0.5',
        'visibility': '|visible|hidden',
        'z-index': '|1'
    };
    var tagSet = ['#text', 'DIV', 'IMG', 'A'];
    var imgSet = [];
    var txtSet = [];
    var nodeSet = [{
        tag: 'DIV',
        class: 'test-div'
    }, {
        tag: 'DIV',
        style: {}
    }, {
        tag: 'DIV',
        style: {}
    }, [{
        tag: 'IMG',
        attr: {
            src: 'http://img4.duitang.com/uploads/blog/201309/14/20130914171430_CanSx.jpeg'
        }
    }, {
        tag: '#text',
        value: 'qwe asd zxc'
    }]];
    var ranode = function(d) {
        var n = nodeSet[d];
        if(n instanceof Array) {
            n = n[Math.floor(Math.random() * n.length)];
        }
        return n;
    };
    var depth = 0;
    var random = function(levels) {
        if(levels.length == 0) return [];
        var r = [];
        for(var i = 0, len = levels[0]; i < len; i++) {
            var n = ranode(depth - levels.length);
            n.children = random(levels.slice(1));
            r.push(n);
        }
        return r;
    };
    return function(container, levels) {
        if(!(levels instanceof Array)) return null;
        depth = levels.length;
        var doms = random(levels);
        for(var i = 0, len = doms.length; i < len; i++) {
            container.appendChild(domini.domify(doms[i]));
        }
    };
});
