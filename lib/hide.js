define(function() {
    return {
        _list: null,
        _conf: {
            liveRangeOffset: 20,
            liveRange: 60
        },
        _cache: {
            scrollPosition: 0,
            hIndex: [],
            pIndex: [],
            vIndex: []
        },
        _preBlank: null,
        _subBlank: null,
        _initBlank: function() {
            var blankStyle = 'width:100%;height:0;padding:0;border:0;margin:0;';
            this._preBlank = document.createElement('div');
            this._subBlank = document.createElement('div');
            this._preBlank.setAttribute('style', blankStyle);
            this._subBlank.setAttribute('style', blankStyle);
            this._list.insertBefore(this._preBlank, this._list.childNodes[0]);
            this._list.appendChild(this._subBlank);
        },
        init: function(list, conf) {
            // debugger
            var children = list.childNodes;
            if(!children || !children.length) {
                return;
            }

            this._conf.liveRangeOffset = conf.offset || 20;
            this._conf.liveRange = conf.range || 60;

            this._list = list;

            this._initBlank();

            this.initIndex();
        },
        initIndex: function() {
            var children = this._list.childNodes;
            var len = children.length;
            var h = 0;
            for(var i = 1; i < len; i++) {
                this._cache.hIndex[i] = children[i].offsetHeight;
                this._cache.pIndex[i] = h;
                h += this._cache.hIndex[i];
                this._cache.vIndex[i] = true;
            }
        },
        update: function(pos) {
            // debugger
            if(pos < 0) pos = -pos;
            var children = this._list.childNodes;
            var len = children.length;
            var begin = 0;
            for(var i = 1; i < len - 1; i++) {
                if(this._cache.pIndex[i] >= pos) { // 第i个元素到达了pos
                    if(i > this._conf.liveRangeOffset + 1) begin = i - this._conf.liveRangeOffset;
                    else begin = 1;
                    break;
                }
            }
            for(var i = 1; i < begin; i++) {
                children[i].style.display = 'none';
                this._cache.vIndex[i] = false;
            }
            this._preBlank.style.height = this._cache.pIndex[begin] + 'px';
            for(var i = begin; i < begin + this._conf.liveRange && i < len - 1; i++) {
                children[i].style.display = 'block';
                this._cache.vIndex[i] = true;
            }
            var subHeight = 0;
            for(var i = begin + this._conf.liveRange; i < len - 1; i++) {
                children[i].style.display = 'none';
                this._cache.vIndex[i] = false;
                subHeight += this._cache.hIndex[i];
            }
            this._subBlank.style.height = subHeight + 'px';
        }
    }
});
