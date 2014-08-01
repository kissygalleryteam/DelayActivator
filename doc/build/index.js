/*
combined files : 

kg/DelayActivator/2.0.0/index

*/
/**
 * @fileoverview 
 * @author 义宇<yiyu.ljw@taobao.com>
 * @module DelayActivator
 **/
KISSY.add('kg/DelayActivator/2.0.0/index',function (S, oop) {
    
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

            // 别的在开启中，不允许同时开启多个，停止它
            if (self.__activation && self.__activation.activating) {
                self.stopActive();
            }

            self.__activation = activation;

            function active() {
                activation.active();
                activation.activating = false;
                activation.actived = true;
                self.actived++;
            }

            if (activation.deactivating) {
                self.stopDeactive();
            } else if (self.enableActiveMode && self.actived) {
                active();
            } else {
                activation.activating = setTimeout(active, self.activeWait);
            }
        },
        deactive: function(func) {
            var self = this;

            var activation = self.__activation;

            // 没有开启的
            if (!activation) {
                return;
            }

            activation.deactive = func;

            function deactive() {
                activation.deactive();
                activation.deactivating = false;
                activation.actived = false;
                self.actived--;
            }

            if (activation.activating) {
                self.stopActive();
            } else if (self.deactiveWait) {
                activation.deactivating = setTimeout(deactive, self.deactiveWait);
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
            clearTimeout(activation.activating);
            activation.activating = false;
        },
        stopDeactive: function() {
            var self = this;
            var activation = self.__activation;
            clearTimeout(activation.deactivating);
            activation.deactivating = false;
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
    requires: ['kg/oop/0.1/index']
});

