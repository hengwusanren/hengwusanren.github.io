define(function() {
    var _list = null,
        _conf = {
            liveRangeOffset: 40,
            liveRange: 80
        },
        _cache = {
            begin: 1,
            pos: 0,
            dir: 0, // 0: down, 1: up
            hIndex: [],
            pIndex: [],
            vIndex: []
        },
        _preBlank = null,
        _subBlank = null;

    var _initBlank = function() {
            var blankStyle = 'width:100%;height:0;padding:0;border:0;margin:0;';
            _preBlank = document.createElement('div');
            _preBlank.setAttribute('style', blankStyle);
            _list.insertBefore(_preBlank, _list.childNodes[0]);
            _subBlank = document.createElement('div');
            _subBlank.setAttribute('style', blankStyle);
            _list.appendChild(_subBlank);
        };

    var _initIndex = function() {
            var children = _list.childNodes;
            var len = children.length;
            var h = 0;
            for(var i = 1; i < len; i++) {
                _cache.hIndex[i] = children[i].offsetHeight;
                _cache.pIndex[i] = h;
                h += _cache.hIndex[i];
                _cache.vIndex[i] = true;
            }
        };

    var init = function(list, conf) {
            var children = list.childNodes;
            if(!children || !children.length) {
                return;
            }

            _conf.liveRangeOffset = conf.offset || 20;
            _conf.liveRange = conf.range || 60;

            _list = list;

            _initBlank();

            _initIndex();
        };

    var update = function(pos) {
            var children = _list.childNodes;
            var len = children.length;
            var begin = 1;
            if(pos < 0) pos = -pos;

            if(pos == _cache.pos) return;
            if(pos < _cache.pos) {
                _cache.dir = 0; // 向下移动
            } else {
                _cache.dir = 1; // 向上移动
            }
            _cache.pos = pos;

            // 找到begin {

            // for(var i = 1; i < len - 1; i++) {
            //     if(_cache.pIndex[i] >= pos) { // 第i个元素到达了pos
            //         if(i > _conf.liveRangeOffset + 1) begin = i - _conf.liveRangeOffset;
            //         else begin = 1;
            //         break;
            //     }
            // }

            // console.log('last begin: ' + _cache.begin);
            if(_cache.dir == 0) {
                for(var i = _cache.begin + _conf.liveRangeOffset; i >= 1; i--) {
                    if(_cache.pIndex[i] < pos) { // 第i个元素刚好没过pos
                        if(i > _conf.liveRangeOffset) begin = i + 1 - _conf.liveRangeOffset;
                        else begin = 1;
                        break;
                    }
                }
            } else {
                for(var i = _cache.begin + _conf.liveRangeOffset; i < len - 1; i++) {
                    if(_cache.pIndex[i] >= pos) { // 第i个元素到达了pos
                        if(i > _conf.liveRangeOffset + 1) begin = i - _conf.liveRangeOffset;
                        else begin = 1;
                        break;
                    }
                }
            }
            // console.log('pos: ' + pos);
            // console.log('begin: ' + begin);
            // console.log('dir: ' + (_cache.dir == 1 ? 'up' : 'down'));

            // }

            if(_cache.dir == 1) { // 如果是向上，则隐藏旧begin到新begin的item
                for(var i = _cache.begin; i < begin; i++) {
                    children[i].style.display = 'none';
                    _cache.vIndex[i] = false;
                }
            } else { // 如果是向下，则显示新begin到旧begin的item {
                for(var i = begin; i < _cache.begin; i++) {
                    children[i].style.display = 'block';
                    _cache.vIndex[i] = true;
                }
            }
            _preBlank.style.height = _cache.pIndex[begin] + 'px';

            // 显示新begin开始的range个item {
            for(var i = begin; i < begin + _conf.liveRange && i < len - 1; i++) {
                if(_cache.vIndex[i]) continue;
                children[i].style.display = 'block';
                _cache.vIndex[i] = true;
            }
            // }

            // 隐藏后面的item {
            var subHeight = 0;
            for(var i = begin + _conf.liveRange; i < len - 1; i++) {
                if(!_cache.vIndex[i]) break;
                children[i].style.display = 'none';
                _cache.vIndex[i] = false;
                subHeight += _cache.hIndex[i];
            }
            _subBlank.style.height = subHeight + 'px';
            // }

            _cache.begin = begin;
        };

    return {
        init: init,
        update: update
    }
});
