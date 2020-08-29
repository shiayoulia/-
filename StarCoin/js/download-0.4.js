/**
 *
 * Created by huangjinsheng468 on 2017/3/7.
 */

var testUrl = 'https://test-elis-smp-ubas-new.lifeapp.pingan.com.cn:11143/smp-ubas-dmz/mobile/infoReport.do';
var prodUrl = 'https://elis-smp-ubas-new.lifeapp.pingan.com.cn:443/smp-ubas-dmz/mobile/infoReport.do'

var iOSDownloadUrl = 'https://apps.apple.com/cn/app/id549421060';
var androidDownloadUrl = 'https://download.lifeapp.pingan.com.cn/PALifeApp.apk';

var u = navigator.userAgent.toLowerCase();
var browserTypes = {
    weixin: {
        j: /micromessenger/.test(u),
        id: 0
    },
    weibo: {
        j: /weibo/.test(u),
        id: 1
    },
    safari: {
        j: /safari/.test(u) && !/chrome/.test(u),
        id: 2
    }, //是否为safai
    others: {
        j: true,
        id: 99
    }
}

function browserList() {
    var u = navigator.userAgent.toLowerCase();
    var app = navigator.appVersion.toLowerCase();
    return {
        txt: u, // 浏览器版本信息
        version: (u.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1], // 版本号
        msie: /msie/.test(u) && !/opera/.test(u), // IE内核
        mozilla: /mozilla/.test(u) && !/(compatible|webkit)/.test(u), // 火狐浏览器
        safari: /safari/.test(u) && !/chrome/.test(u), //是否为safair
        chrome: /chrome/.test(u), //是否为chrome
        opera: /opera/.test(u), //是否为oprea
        presto: u.indexOf('presto/') > -1, //opera内核
        webKit: u.indexOf('applewebkit/') > -1, //苹果、谷歌内核
        gecko: u.indexOf('gecko/') > -1 && u.indexOf('khtml') == -1, //火狐内核
        mobile: !!u.match(/applewebkit.*mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/), //ios终端
        android: u.indexOf('android') > -1, //android终端
        iPhone: u.indexOf('iphone') > -1, //是否为iPhone
        iPad: u.indexOf('ipad') > -1, //是否iPad
        webApp: !!u.match(/applewebkit.*mobile.*/) && u.indexOf('safari/') == -1 //是否web应该程序，没有头部与底部
    };
}

var browser = Object.keys(browserTypes).filter(function (e) {
    return browserTypes[e].j
})[0]
var browserId = browserTypes[browser].id || '99';

var isTest = /stg/.test(location.href) || /localhost/.test(location.href);

(function () {
    var copy = function (val) {
        if (!document.execCommand) return

        var input = document.createElement('input');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', val);
        document.body.appendChild(input);
        input.focus()
        input.setSelectionRange(0, 9999);

        document.execCommand('copy');

        document.body.removeChild(input);
    }

    var getUrlParams = function (uri) {
        var search = uri ? (uri + '').split('#')[0].split('?')[1] : window.location.search.substring(1)
        var urlParams = search ? search.split('&') : []
        var result = {}

        urlParams.forEach(function (urlParam) {
            var urlParamArr = urlParam.split('=')
            result[urlParamArr[0]] = decodeURIComponent(urlParamArr[1])
        })

        return result
    }


    function sendTrackData(labelId) {
        var eventId = '2011202_web'
        // 获取埋点统计数据
        var urlParams = getUrlParams()
        var extInfo = {}
        if (urlParams.s_sign) {
            extInfo.s_sign = urlParams.s_sign
            extInfo.s_pid = urlParams.s_pid
            extInfo.s_uid = urlParams.s_uid
            extInfo.s_no = urlParams.s_no
        }
        extInfo = JSON.stringify(extInfo)
        var data = {
            appID: '10003',
            devId: getGuid(),
            data: [
                '100|' + getGuid().substring(0, 11) + '|' + eventId + '|' + labelId + '|' + new Date().getTime() + '|' + encodeURIComponent(extInfo)
            ]
        }
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: isTest ? testUrl : prodUrl,
            data: JSON.stringify(data),
            contentType: 'application/json',
        })
    }

    //set first page background
    if($(window).width()/$(window).height() >= 320/400){
        $('.page1 .bg-img').attr('src', './img/fp-bg-2.jpg')
    }

    var curPage = 0;
    $('.download-btn').click(function (e) {
        // 当url中包含 empNoOrPhone 以及 shareSource 等相关信息时，需拷贝相关信息到系统剪切板
        var urlParams = getUrlParams()
        if (urlParams.empNoOrPhone && urlParams.shareSource) {
            copy('#' + JSON.stringify({
                empNoOrPhone: urlParams.empNoOrPhone,
                shareSource: urlParams.shareSource
            }) + '#')
        }

        var pageIndex = $('.cur')[0].className.match(/page[0-9]/)[0].slice(-1);
        _smq.push(['custom','Mob','Mob_' + (pageIndex)]);
        // var clickItem = this
        // $('.download-btn').each(function(i,v){
        //     if (clickItem === this) {
        //         _smq.push(['custom','Mob','Mob_' + (i+1)]);
        //     }
        // })

        sendTrackData('2011202_web_03-' + browserId + '-' + curPage);
        if (browserTypes.weixin.j) {
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.pingan.lifeinsurance';
        } else {
            if (browserList().ios || browserList().iPhone || browserList().iPad) {
                window.location.href = iOSDownloadUrl;
            } else {
                window.location.href = androidDownloadUrl;
            }
        }
    })

    var countMap = {
        1: 4814214,
        2: 15774934,
        3: 28312555,
        4: 18322671,
        5: 51020175
    }
    var duration = 0.5; //by second

    var setting = {
        // loop: true,
        drag: true,
        change: function (e) {
            // 移除动画属性
            $('.page').eq(e.cur).find('.animated').each(function () {
                if (!$(this).hasClass('stick')) {
                    $(this).removeClass($(this).data('animate')).hide();
                } else {
                    $(this).removeClass($(this).data('animate'));
                }
            });

            sendTrackData('2011202_web_01-' + browserId + '-' + e.cur);
            if (e.prev > 0) {
                sendTrackData('2011202_web_02-' + browserId + '-' + (e.prev));
            }
        },
        afterChange: function (e) {
            curPage = e.cur;
            // 添加动画属性
            var i = -1;
            $('.page').eq(e.cur).find('.animated')
                .each(
                    function () {
                        if (!$(this).hasClass('no-waiting')) {
                            i++;
                        }

                        setTimeout(function (ctx) {
                            var self = ctx;
                            return function () {
                                $(self).addClass($(self).data('animate')).show();

                                if (countMap[e.cur] !== void 0 && $(self).find('.count-ren').length > 0) {
                                    var options = {
                                        useEasing: true,
                                        useGrouping: true,
                                        separator: ',',
                                        decimal: '.',
                                        prefix: '',
                                        suffix: ''
                                    };
                                    var demo = new CountUp($(self).find('.count')[0], 0, countMap[e.cur], 0, 1.5, options);
                                    demo.start();
                                }
                            }
                        }(this), duration * 1000 * i)
                    })
        }
    };

    $(window).on('load', function () {
        sendTrackData('201120_web_show')
        $('.wp-inner').fullpage(setting);
    })
})()
