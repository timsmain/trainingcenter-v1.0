var on = addEventListener
              , $ = function(q) {
                return document.querySelector(q)
            }
              , $$ = function(q) {
                return document.querySelectorAll(q)
            }
              , $body = document.body
              , $inner = $('.inner')
              , browser = (function() {
                if (navigator.userAgent.match(/Android ([0-9\.]+)/))
                    return 'android';
                if (navigator.userAgent.match(/([0-9_]+) like Mac OS X/) || navigator.userAgent.match(/CPU like Mac OS X/))
                    return 'ios';
                if (navigator.userAgent.match(/(MSIE|rv:11\.0)/))
                    return 'ie';
                return 'other';
            })()
              , trigger = function(t) {
                if (browser == 'ie') {
                    var e = document.createEvent('Event');
                    e.initEvent(t, false, true);
                    dispatchEvent(e);
                } else
                    dispatchEvent(new Event(t));
            };
            on('load', function() {
                setTimeout(function() {
                    $body.className = $body.className.replace(/\bis-loading\b/, 'is-playing');
                    setTimeout(function() {
                        $body.className = $body.className.replace(/\bis-playing\b/, 'is-ready');
                    }, 2000);
                }, 100);
            });
            var h, id, ee, k, locked = false;
            if ('scrollRestoration'in history)
                history.scrollRestoration = 'manual';
            h = location.hash;
            id = h && $('section[id="' + h.substr(1) + '-section"]') ? h.substr(1) : 'home';
            ee = $$('section:not([id="' + id + '-section"])');
            for (k = 0; k < ee.length; k++) {
                ee[k].className = 'inactive';
                ee[k].style.display = 'none';
            }
            setTimeout(function() {
                $body.scrollTop = document.documentElement.scrollTop = 0;
            }, 75);
            on('hashchange', function(event) {
                var h, e, ce, eh, ceh, k;
                h = (location.hash ? location.hash : '#home');
                e = $(h + '-section');
                if (!e || e.className != 'inactive')
                    return false;
                if (locked)
                    return false;
                locked = true;
                if (h == '#home')
                    history.replaceState(null, null, '#');
                ce = $('section:not(.inactive)');
                if (ce) {
                    ceh = ce.offsetHeight;
                    ce.className = 'inactive';
                    setTimeout(function() {
                        ce.style.display = 'none';
                    }, 250);
                }
                setTimeout(function() {
                    $inner.style.overflow = 'hidden';
                    e.style.display = '';
                    trigger('resize');
                    $body.scrollTop = document.documentElement.scrollTop = 0;
                    eh = e.offsetHeight;
                    if (eh > ceh) {
                        e.style.maxHeight = ceh + 'px';
                        e.style.minHeight = '0';
                    } else {
                        e.style.maxHeight = '';
                        e.style.minHeight = ceh + 'px';
                    }
                    setTimeout(function() {
                        e.className = '';
                        e.style.minHeight = eh + 'px';
                        e.style.maxHeight = eh + 'px';
                        setTimeout(function() {
                            e.style.transition = 'none';
                            e.style.minHeight = '';
                            e.style.maxHeight = '';
                            setTimeout(function() {
                                e.style.transition = '';
                                $inner.style.overflow = '';
                                locked = false;
                            }, 75);
                        }, 500);
                    }, 75);
                }, 250);
                return false;
            });
            var style, sheet, rule;
            style = document.createElement('style');
            style.appendChild(document.createTextNode(''));
            document.head.appendChild(style);
            sheet = style.sheet;
            if (browser == 'android') {
                (function() {
                    sheet.insertRule('body::after { }', 0);
                    rule = sheet.cssRules[0];
                    var f = function() {
                        rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
                    };
                    on('load', f);
                    on('orientationchange', f);
                    on('touchmove', f);
                })();
            } else if (browser == 'ios') {
                (function() {
                    sheet.insertRule('body::after { }', 0);
                    rule = sheet.cssRules[0];
                    rule.style.cssText = '-webkit-transform: scale(1.0)';
                })();
                (function() {
                    sheet.insertRule('body.ios-focus-fix::before { }', 0);
                    rule = sheet.cssRules[0];
                    rule.style.cssText = 'height: calc(100% + 60px)';
                    on('focus', function(event) {
                        $body.classList.add('ios-focus-fix');
                    }, true);
                    on('blur', function(event) {
                        $body.classList.remove('ios-focus-fix');
                    }, true);
                })();
            } else if (browser == 'ie') {
                (function() {
                    var t, f;
                    f = function() {
                        var x = $('#wrapper');
                        x.style.height = 'auto';
                        if (x.scrollHeight <= innerHeight)
                            x.style.height = '100vh';
                    }
                    ;
                    (f)();
                    on('resize', function() {
                        clearTimeout(t);
                        t = setTimeout(f, 250);
                    });
                    on('load', f);
                })();
            }
            (function() {
                var items = $$('.deferred'), f;
                if (!('forEach'in NodeList.prototype))
                    NodeList.prototype.forEach = Array.prototype.forEach;
                items.forEach(function(p) {
                    var i = p.firstChild;
                    p.style.backgroundImage = 'url(' + i.src + ')';
                    p.style.backgroundSize = '100% auto';
                    p.style.backgroundPosition = 'top left';
                    p.style.backgroundRepeat = 'no-repeat';
                    i.style.opacity = 0;
                    i.style.transition = 'opacity 0.375s ease-in-out';
                    i.addEventListener('load', function(event) {
                        if (i.dataset.src !== 'done')
                            return;
                        if (Date.now() - i._startLoad < 375) {
                            p.classList.remove('loading');
                            p.style.backgroundImage = 'none';
                            i.style.transition = '';
                            i.style.opacity = 1;
                        } else {
                            p.classList.remove('loading');
                            i.style.opacity = 1;
                            setTimeout(function() {
                                p.style.backgroundImage = 'none';
                            }, 375);
                        }
                    });
                });
                f = function() {
                    var height = document.documentElement.clientHeight
                      , top = (browser == 'ios' ? document.body.scrollTop : document.documentElement.scrollTop)
                      , bottom = top + height;
                    items.forEach(function(p) {
                        var i = p.firstChild;
                        if (i.offsetParent === null)
                            return true;
                        if (i.dataset.src === 'done')
                            return true;
                        var x = i.getBoundingClientRect(), imageTop = top + Math.floor(x.top) - height, imageBottom = top + Math.ceil(x.bottom) + height, src;
                        if (imageTop <= bottom && imageBottom >= top) {
                            src = i.dataset.src;
                            i.dataset.src = 'done';
                            p.classList.add('loading');
                            i._startLoad = Date.now();
                            i.src = src;
                        }
                    });
                }
                ;
                on('load', f);
                on('resize', f);
                on('scroll', f);
            })();