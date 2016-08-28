define(function () {
    var nodify = {
        tag: function(dom) {
            return dom.nodeName;
        },
        key: function(dom, key) {
            return key || 0;
        },
        value: function(dom) {
            return dom.nodeName === '#text' ? dom.nodeValue : null;
        },
        attr: function(dom) {
            var a = dom.attributes;
            if(!a || (!a.length && 0 !== a.length)) return null;
            var r = {};
            for(var i = 0, len = a.length; i < len; i++) {
                r[a[i].name] = a[i].value;
            }
            return r;
        },
        class: function(dom) {
            if(!dom.classList) return null;
            return Array.prototype.slice.call(dom.classList, 0);
        },
        style: function(dom) {
            var s = dom.style;
            if(!s || (!s.length && 0 !== s.length)) return null;
            var r = {};
            for(var i = 0, len = s.length; i < len; i++) {
                r[s[i]] = s[s[i]];
            }
            return r;
        },
        children: function(dom) {
            if(dom.nodeName === '#text') return null;
            var children = dom.childNodes;
            if(!children) return null;
            var r = [];
            for(var i = 0, len = children.length; i < len; i++) {
                r.push(milk(children[i], i));
            }
            return r;
        }
    };
    var domify = [
        function (node, dom) {
            var a = node.attr;
            if(!a) return;
            for(var i in a) {
                dom.setAttribute(i, a[i]);
            }
        },
        function (node, dom) {
            if(!node.attr || !node.attr.class) return;
            dom.className = node.attr.class;
        },
        function (node, dom) {
            if(!node.attr || !node.attr.style) return;
            dom.style.cssText = node.attr.style;
        },
        function (node, dom) {
            var c = node.children;
            if(!c || !c.length) return;
            for(var i = 0, len = c.length; i < len; i++) {
                dom.appendChild(grow(c[i]));
            }
        }
    ];
    var cssSet = {
        'display': '|block|inline-block|flex|none',
        'position': '|relative|absolute|fixed',
        'top': '|0px',
        'right': '|0px',
        'bottom': '|0px',
        'left': '|0px',
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
    var milk = function (dom, key) { // return a node
        var node = {};
        for(var i in nodify) {
            node[i] = nodify[i](dom, key);
        }
        return node;
    };
    var diff = function (node1, node2) { // return a node
        // TODO
    };
    var grow = function (node) { // return a dom
        var dom = (node.tag === '#text') ? document.createTextNode(node.value) : document.createElement(node.tag);
        for(var i = 0, len = domify.length; i < len; i++) {
            domify[i](node, dom);
        }
        return dom;
    };
    return {
        nodify: milk,
        nodiff: diff,
        domify: grow
    };
});
