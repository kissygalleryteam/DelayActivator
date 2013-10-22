/**
 * @fileoverview 
 * @author 义宇<yiyu.ljw@taobao.com>
 * @module DelayActivator
 **/
KISSY.add(function (S, oop) {

    var DelayActivator = new oop.Class({
        __activation: null,
        __activations: {},
        actived: 0,
        enableActiveMode: false,
        active: function(func, id) {
            var self = this;

            var activation;
            if (id) {
                if (typeof id == 'object') {
                    activation = id.activation || {};
                    id.activation = activation;
                } else {
                    activation = self.__activations[id] || {};
                    self.__activations[id] = activation;
                }
            } else {
                activation = {};
            }
            activation.active = func;
            self.__activation = activation;

            function active() {
                activation.active();
                activation.activeTimer = null;
                if (self.enableActiveMode) {
                    self.actived++;
                }
            }

            if (activation.deactiveTimer) {
                self.stopDeactive();
            } else if (self.actived) {
                active();
            } else {
                activation.activeTimer = setTimeout(active, self.activeWait);
            }
        },
        deactive: function(func) {
            var self = this;

            var activation = self.__activation;
            activation.deactive = func;

            function deactive() {
                activation.deactive();
                activation.deactiveTimer = null;
                if (self.enableActiveMode) {
                    self.actived--;
                }
            }

            if (activation.activeTimer) {
                self.stopActive();
            } else if (self.deactiveWait) {
                activation.deactiveTimer = setTimeout(deactive, self.deactiveWait);
            } else {
                deactive();
            }
        },
        hold: function() {
            var self = this;
            self.stopDeactive();
        },
        release: function() {
            var self = this;
            var activation = self.__activation;
            self.deactive(activation.deactive);
        },
        stopActive: function() {
            var self = this;
            var activation = self.__activation;
            clearTimeout(activation.activeTimer);
            activation.activeTimer = null;
        },
        stopDeactive: function() {
            var self = this;
            var activation = self.__activation;
            clearTimeout(activation.deactiveTimer);
            activation.deactiveTimer = null;
        },
        activate: function(wait) {
            var self = this;
            self.activeWait = wait;
            return function(func) {
                return function(id) { 
                    var context = this;
                    var args = arguments;
                    self.active(function() {
                        func.apply(context, args);
                    }, id);
                }
            }
        },
        deactivate: function(wait) {
            var self = this;

            var func;

            function _deactivate() {
                var context = this;
                var args = arguments;
                self.deactive(function() {
                    func.apply(context, args);
                });
            }

            if (typeof wait == 'function') {
                func = wait;
                return _deactivate;
            } else {
                self.deactiveWait = wait;
                return function(f) {
                    func = f;
                    return _deactivate;
                }
            }
        }
    });

    return DelayActivator;
}, {
    requires: ['gallery/oop/0.1/index']
});
