var getUrlParameter = function (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
};
var getUrlHash = function () {
    var url = window.location.href;
    if (url.indexOf('#') < 0) return '';
    return url.substring(url.indexOf('#') + 1);
};

requirejs.config({
    paths: {
        renode: './lib/renode',
        domini: './lib/domini',
        domock: './lib/domock'
    }
});

requirejs(['domini', 'domock'], function(Domini, Domock) {
    var test_generateContent1 = function(div, levels) {
        Domock(div, levels);
    };

    var test_targetDom = document.getElementById('div1');

    test_generateContent1(test_targetDom, [2, 1, 1, 1]);
});
