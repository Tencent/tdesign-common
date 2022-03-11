/* eslint-disable */
/**
 * eslint-ignore
 * 简易的事件添加方法（项目中暂未真实使用，仅用作测试）
 * thanks to https://www.zhangxinxu.com/wordpress/2013/04/js-mousewheel-dommousescroll-event/
 */
const addScrollEvent = (function (window, undefined) {
  let _eventCompat = function (event) {
    let type = event.type;
    if (type == 'DOMMouseScroll' || type == 'mousewheel') {
      event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
      event.X = (event.wheelDeltaX) ? event.wheelDeltaX / 120 : -(event.detail || 0) / 3;
      event.Y = (event.wheelDeltaY) ? event.wheelDeltaY / 120 : -(event.detail || 0) / 3;
    }
    if (event.srcElement && !event.target) {
      event.target = event.srcElement;
    }
    if (!event.preventDefault && event.returnValue !== undefined) {
      event.preventDefault = function () {
        event.returnValue = false;
      };
    }
    return event;
  };
  if (window.addEventListener) {
    return function (el: HTMLElement, type: string, fn: Function, capture?: any) {
      // @ts-ignore
      if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
        type = 'DOMMouseScroll';
      }
      el.addEventListener(type, function (event) {
        fn.call(this, _eventCompat(event));
      }, capture || false);
    }
  // @ts-ignore
  } else if (window.attachEvent) {
    return function (el: HTMLElement, type: string, fn: Function, capture?: any) {
      // @ts-ignore
      el.attachEvent('on' + type, function (event) {
        event = event || window.event;
        fn.call(el, _eventCompat(event));
      });
    }
  }
  return function () { };
})(window);        

export default addScrollEvent;
