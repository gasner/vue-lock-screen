/*!
 * vue-lock-screen v0.0.1
 * (c) Elad Gasner
 * Released under the MIT License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var __vue_normalize__ = _interopDefault(require('vue-runtime-helpers/dist/normalize-component.js'));
var __vue_create_injector__ = _interopDefault(require('vue-runtime-helpers/dist/inject-style/browser.js'));

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: "lock-screen",
  props: {
    success: {
      "default": null
    },
    freeze: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      matrix: [//0:
      [5, 5], //1:
      [15, 5], //2:
      [25, 5], //3:
      [5, 15], //4:
      [15, 15], //5:
      [25, 15], //6:
      [5, 25], //7:
      [15, 25], //8:
      [25, 25]],
      path: [],
      trackMouseMove: false,
      screenX: 0,
      screenY: 0
    };
  },
  created: function created() {
    this.$nextTick(function () {
      this.addEventListener();
    });
  },
  destroyed: function destroyed() {
    this.removeEventListener();
  },
  computed: {
    successOrErrorClass: function successOrErrorClass() {
      if (!this.trackMouseMove) {
        if (this.isSuccess) {
          return "success";
        } else if (this.isFail) {
          return "error";
        }
      }

      return "";
    },
    isSuccess: function isSuccess() {
      return this.success;
    },
    isFail: function isFail() {
      //only if success is false to user fail but if is falsy the user not try;
      return this.success === false;
    },
    glowMatrix: function glowMatrix() {
      var _this = this;

      return this.matrix.map(function (n, i) {
        return _this.path.includes(i);
      });
    },
    pathToSvg: function pathToSvg() {
      if (!this.path.length) return "";
      if (this.screenX && this.screenY && this.trackMouseMove) var svgB = this.$refs.svg.getBoundingClientRect();
      return this.path.map(function (n, i) {
        return (i ? " L " : "M ") + this.matrix[n][0] + " " + this.matrix[n][1];
      }.bind(this)).join("") + (this.screenX && this.screenY && this.trackMouseMove ? " L " + (this.screenX - svgB.left) * 30 / svgB.width + " " + (this.screenY - svgB.top) * 30 / svgB.width : "");
    }
  },
  methods: {
    addEventListener: function addEventListener() {
      var template = this.$refs.svg;
      template.addEventListener("touchmove", this.mousemoveANDtouchmove);
      template.addEventListener("mousemove", this.mousemoveANDtouchmove);
      template.addEventListener("mouseup", this.touchendANDmouseup);
      template.addEventListener("touchend", this.touchendANDmouseup);
      template.addEventListener("mousedown", this.touchstartANDmousedown);
      template.addEventListener("touchstart", this.touchstartANDmousedown);
    },
    removeEventListener: function removeEventListener() {
      if (this.$refs && this.$refs.touchArea) {
        var template = this.$refs.template;
        template.removeEventListener("mousedown", this.touchstartANDmousedown);
        template.removeEventListener("touchdown", this.touchstartANDmousedown);
        template.removeEventListener("mouseup", this.touchendANDmouseup);
        template.removeEventListener("touchend", this.touchendANDmouseup);
        template.removeEventListener("touchmove", this.mousemoveANDtouchmove);
        template.removeEventListener("mousemove", this.mousemoveANDtouchmove);
      }
    },
    touchstartANDmousedown: function touchstartANDmousedown(ev) {
      this.$emit("start");
      if (this.freeze) return false;
      this.trackMouseMove = true;
      this.path = []; // avoid scrolling when using touch
    },
    touchendANDmouseup: function touchendANDmouseup(ev) {
      this.trackMouseMove = false;
      document.body.style.overflow = "auto";
      this.login();
    },
    mousemoveANDtouchmove: function mousemoveANDtouchmove(ev) {
      if (!this.trackMouseMove) return false;

      if (ev.type === "mousemove") {
        var target = document.elementFromPoint(ev.clientX, ev.clientY);
        this.screenX = ev.clientX;
        this.screenY = ev.clientY;
      } else {
        var myLocation = ev.changedTouches[0];
        var target = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
        this.screenX = myLocation.clientX;
        this.screenY = myLocation.clientY;
      }

      if (!target) {
        console.log("fdsfdsf");
        return false;
      }

      var keyAsString = target.getAttribute("data-key");
      var key = undefined;
      if (keyAsString) key = Number(keyAsString);else return false;
      /*
         This part of the code is a little bit nasty.
         For performance reasons, when moving the finger or mouse fast enough,
         there was a chance that one would "skip" one of the touchable dots.
         So this code looks for the currently touched dot and the previus one
         and fill in the blank with the dot that may have left inbetween
      */

      document.body.style.overflow = "hidden";
      var last_key = this.path[this.path.length - 1];
      if (last_key == 0 && key == 2) this.path.push(1);
      if (last_key == 0 && key == 6) this.path.push(3);
      if (last_key == 0 && key == 8) this.path.push(4);
      if (last_key == 1 && key == 7) this.path.push(4);
      if (last_key == 2 && key == 1) this.path.push(1);
      if (last_key == 2 && key == 6) this.path.push(4);
      if (last_key == 2 && key == 8) this.path.push(5);
      if (last_key == 3 && key == 5) this.path.push(4); //4

      if (last_key == 5 && key == 3) this.path.push(4);
      if (last_key == 6 && key == 0) this.path.push(3);
      if (last_key == 6 && key == 8) this.path.push(7);
      if (last_key == 6 && key == 4) this.path.push(4);
      if (last_key == 7 && key == 1) this.path.push(4);
      if (last_key == 8 && key == 0) this.path.push(4);
      if (last_key == 8 && key == 2) this.path.push(5);
      if (last_key == 8 && key == 6) this.path.push(7);
      if (!this.path.includes(key)) this.path.push(key);
    },
    login: function login() {
      //	if (this.freeze) return false;
      if (!this.path.length) return false;
      this.$emit("finish", this.path);
    }
  }
};

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('main', {
    attrs: {
      "draggable": "false"
    }
  }, [_c('svg', {
    ref: "svg",
    "class": _vm.successOrErrorClass,
    attrs: {
      "id": "pattern-login",
      "viewBox": "0 0 30 30",
      "draggable": "false",
      "ondragstart": "return false;"
    }
  }, [_c('defs', [_c('defs', [_c('linearGradient', {
    attrs: {
      "id": "MyGradient"
    }
  }, [_c('stop', {
    attrs: {
      "offset": "5%",
      "stop-color": "rgba(241, 231, 103, 1)"
    }
  }), _vm._v(" "), _c('stop', {
    attrs: {
      "offset": "95%",
      "stop-color": "rgba(254, 182, 69, 1)"
    }
  })], 1)], 1), _vm._v(" "), _c('filter', {
    attrs: {
      "id": "glow",
      "width": "1.5",
      "height": "1.5",
      "x": "-.25",
      "y": "-.25"
    }
  }, [_c('feGaussianBlur', {
    attrs: {
      "stdDeviation": "0.25",
      "result": "coloredBlur"
    }
  }), _vm._v(" "), _c('feMerge', [_c('feMergeNode', {
    attrs: {
      "in": "coloredBlur"
    }
  }), _vm._v(" "), _c('feMergeNode', {
    attrs: {
      "in": "SourceGraphic"
    }
  })], 1)], 1)]), _vm._v(" "), _vm._l(_vm.matrix, function (coord, i) {
    return _c('circle', {
      key: i,
      ref: "circle",
      refInFor: true,
      "class": {
        'glow': _vm.glowMatrix[i]
      },
      staticStyle: {
        "-moz-user-select": "none",
        "-webkit-user-select": "none",
        "-ms-user-select": "none",
        "user-select": "none",
        "-webkit-user-drag": "none",
        "user-drag": "none"
      },
      attrs: {
        "draggable": "false",
        "ondragstart": "return false;",
        "cx": coord[0],
        "cy": coord[1],
        "r": "3",
        "data-key": i
      }
    });
  }), _vm._v(" "), _c('path', {
    ref: "indicator",
    staticStyle: {
      "-moz-user-select": "none",
      "-webkit-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
      "-webkit-user-drag": "none",
      "user-drag": "none"
    },
    attrs: {
      "draggable": "false",
      "ondragstart": "return false;",
      "id": "indicator",
      "d": _vm.pathToSvg,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }
  })], 2)]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-3fcf4abc_0", {
    source: "@keyframes fade-out-data-v-3fcf4abc{to{opacity:0}}main[data-v-3fcf4abc]{box-sizing:border-box;text-align:center;user-select:none}svg#pattern-login[data-v-3fcf4abc]{cursor:pointer;width:400px;height:400px;max-width:80vmin;max-height:80vmin;fill:transparent;stroke:#777;stroke-width:.3px;display:inline-block}svg#pattern-login circle.glow[data-v-3fcf4abc]{stroke:#37f}svg#pattern-login path#indicator[data-v-3fcf4abc]{stroke:#4d4d4d}.glow[data-v-3fcf4abc]{filter:url(#glow)}svg#pattern-login.success circle.glow[data-v-3fcf4abc]{stroke:#3f7}svg#pattern-login.success path#indicator[data-v-3fcf4abc]{stroke:#3f7}svg#pattern-login.error circle.glow[data-v-3fcf4abc],svg#pattern-login.error path#indicator[data-v-3fcf4abc]{stroke:#f33}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-3fcf4abc";
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject SSR */

var VueLockScreen = __vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, __vue_create_injector__, undefined);

var index = {
  install: function install(Vue, options) {
    // Let's register our component globally
    // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("vue-lock", VueLockScreen);
  }
};

module.exports = index;
