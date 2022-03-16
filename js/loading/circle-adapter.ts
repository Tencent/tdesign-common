import setStyle from '../utils/set-style';
import { getIEVersion } from '../utils/helper';

export default function circleAdapter(circleElem: HTMLElement) {
  let basicStyle = {};

  if (!circleElem) {
    return;
  }

  const { color, fontSize } = window?.getComputedStyle?.(circleElem);

  // to fix the browser compat of foreignObject in Safari,
  // https://bugs.webkit.org/show_bug.cgi?id=23113
  const ua = window?.navigator?.userAgent;
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  if (isSafari) {
    basicStyle = {
      transformOrigin: '-1px -1px',
      transform: `scale(${parseInt(fontSize, 10) / 14})`,
    };
  }
  // 添加：判断是否为IE浏览器
  if (color && getIEVersion() > 11) {
    const matched = color.match(/[\d.]+/g);
    const endColor = matched ? `rgba(${matched[0]}, ${matched[1]}, ${matched[2]}, 0)` : '';
    setStyle(circleElem, {
      ...basicStyle,
      background: `conic-gradient(from 90deg at 50% 50%,${endColor} 0deg, ${color} 360deg)`,
    });
  } else {
    setStyle(circleElem, {
      ...basicStyle,
      background: '',
    });
  }
}
