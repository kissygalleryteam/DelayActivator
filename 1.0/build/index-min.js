/*!build time : 2013-10-25 5:42:41 PM*/
KISSY.add("gallery/DelayActivator/1.0/index",function(a,b){var c=new b.Class({__activation:null,__activations:{},actived:0,enableActiveMode:!1,active:function(a,b){function c(){d.active(),d.activating=!1,d.actived=!0,e.actived++}var d,e=this;b?"object"==typeof b?(d=b.activation||{},b.activation=d):(d=e.__activations[b]||{},e.__activations[b]=d):d={},d.active=a,e.__activation&&e.__activation.activating&&e.stopActive(),e.__activation=d,d.deactivating?e.stopDeactive():e.enableActiveMode&&e.actived?c():d.activating=setTimeout(c,e.activeWait)},deactive:function(a){function b(){d.deactive(),d.deactivating=!1,d.actived=!1,c.actived--}var c=this,d=c.__activation;d&&(d.deactive=a,d.activating?c.stopActive():c.deactiveWait?d.deactivating=setTimeout(b,c.deactiveWait):b())},hold:function(){var a=this;a.stopDeactive()},release:function(){var a=this,b=a.__activation;a.deactive(b.deactive)},stopActive:function(){var a=this,b=a.__activation;clearTimeout(b.activating),b.activating=!1},stopDeactive:function(){var a=this,b=a.__activation;clearTimeout(b.deactivating),b.deactivating=!1},activate:function(a){var b=this;return b.activeWait=a,function(a){return function(c){var d=this,e=arguments;b.active(function(){a.apply(d,e)},c)}}},deactivate:function(a){function b(){var a=this,b=arguments;d.deactive(function(){c.apply(a,b)})}var c,d=this;return"function"==typeof a?(c=a,b):(d.deactiveWait=a,function(a){return c=a,b})}});return c},{requires:["gallery/oop/0.1/index"]});