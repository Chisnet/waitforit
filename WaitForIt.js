(function (root, factory){
    'use strict';

    var WaitForIt = {};
    root.WaitForIt = WaitForIt;
    var define = root.define;
    factory(WaitForIt);

    if (typeof define === 'function' && define.amd){
        // AMD support
        define(function() { return WaitForIt; });
    } else if (typeof exports === 'object'){
        // Node support
        if (module !== undefined && module.exports) {
            exports = module.exports = WaitForIt;
        }
        // CommonJS support
        exports.WaitForIt = WaitForIt;
        module.exports = exports = WaitForIt;
    }
}(( typeof window === 'object' && window ) || this, function (WaitForIt){
    'use strict';

    var waiters = [];
    var fired_triggers = [];
    var watcher_interval = null;

    function check_waiters() {
        var fired_total = 0;
        for (let index = 0; index < waiters.length; index++) {
            const waiter = waiters[index];
            if(waiter.has_fired) {
                fired_total += 1;
            }
            else {
                if(Date.now() > waiter.timeout) {
                    waiter.callback(false);
                    waiter.has_fired = true;
                    fired_total += 1;
                }
                else {
                    var canFireNow = waiter.events.every(function(val) {
                        return fired_triggers.indexOf(val) >= 0;
                    });
                    if(canFireNow) {
                        waiter.callback(true);
                        waiter.has_fired = true;
                        fired_total += 1;
                    }
                }
            }
        }
        // Stop checking, everything has fired
        if(fired_total == waiters.length) {
            clearInterval(watcher_interval);
            watcher_interval = null;
        }
    }

    function poke_watcher() {
        if(watcher_interval === null) {
            watcher_interval = setInterval(function(){
                check_waiters();
            }, 100);
        }
    }

    WaitForIt.wait_for = function(events, callback, timeout) {
        var canFireImmediately = events.every(function(val) {
            return fired_triggers.indexOf(val) >= 0;
        });
        if(canFireImmediately) {
            callback(true);
        }
        else {
            waiters.push({
                'events': events,
                'callback': callback,
                'has_fired': false,
                'timeout': Date.now() + timeout,
            });
            poke_watcher();
        }
    };

    WaitForIt.await_for = async function(events, timeout) {
        var canFireImmediately = events.every(function(val) {
            return fired_triggers.indexOf(val) >= 0;
        });
        if(canFireImmediately) {
            return Promise.resolve(true);
        }
        else {
            var resolver_func;
            var promise = new Promise(function(resolve, reject){
                resolver_func = resolve;
            });
            waiters.push({
                'events': events,
                'callback': resolver_func,
                'has_fired': false,
                'timeout': Date.now() + timeout,
            });
            poke_watcher();
            return promise;
        }
    };

    WaitForIt.trigger = function(event) {
        if(fired_triggers.indexOf(event) === -1) {
            fired_triggers.push(event);
        }
        check_waiters();
    };
}));
