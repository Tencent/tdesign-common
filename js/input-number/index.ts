/**
 * 大数加法，仅支持整数
 * @param num1 被加数
 * @param num2 加数
 */
export function largeIntNumberAdd(num1: string, num2: string, decimal = false): string {
  // 去除数字最前面的无效数 0
  const number1 = num1 && num1 !== '0' ? num1.replace(/^0+/, '') : '0';
  const number2 = num2 && num2 !== '0' ? num2.replace(/^0+/, '') : '0';
  const isFirstLarger = number1.length > number2.length;
  const maxNumber = isFirstLarger ? number1 : number2;
  const minNumber = isFirstLarger ? number2 : number1;
  const newNumber = [];
  const step = [];
  const diff = decimal ? 0 : maxNumber.length - minNumber.length;
  const len = decimal ? minNumber.length : maxNumber.length;
  for (let i = len - 1; i >= 0; i--) {
    const minIndex = i - diff;
    // 第一个数，加第二个数，加进位
    const count = Number(maxNumber[i]) + (Number(minNumber[minIndex]) || 0) + (step[i] || 0);
    if (count >= 10) {
      step[i - 1] = 1;
    }
    newNumber.unshift(count % 10);
  }
  // 999 + 1 = 1000，之类的进位
  if (step[-1]) {
    newNumber.unshift(1);
  }
  if (decimal) {
    return newNumber.concat(maxNumber.slice(len, maxNumber.length)).join('');
  }
  return newNumber.join('');
}

/**
 * 大数加法，支持小数和整数
 * @param num1 被加数
 * @param num2 加数
 */
export function largeNumberAdd(num1: string, num2: string): string {
  const [intNumber1, decimalNumber1 = '0'] = num1.split('.');
  const [intNumber2, decimalNumber2 = '0'] = num2.split('.');
  const integerSum = largeIntNumberAdd(intNumber1, intNumber2);
  // 如果不存在小数，则直接返回整数相加结果
  if (decimalNumber1 === '0' && decimalNumber2 === '0') return integerSum;
  // 小数点相加
  const decimalNumberSum = largeIntNumberAdd(decimalNumber1, decimalNumber2, true);
  // 组合整数部分和小数部分
  const decimalLength = decimalNumberSum.length;
  if (decimalLength <= decimalNumber1.length && decimalLength <= decimalNumber2.length) {
    return [integerSum, decimalNumberSum].join('.');
  }
  return [largeIntNumberAdd(integerSum, '1'), decimalNumberSum.slice(1)].join('.');
}

/**
 * 大数保留 N 位小数
 * @param {String} number 大数（只能使用字符串表示）
 * @param {Number} decimalPlaces 保留的小数位数
 */
export function largeNumberToFixed(number: string, decimalPlaces: number = 0): string {
  if (typeof number !== 'string') return number;
  const [num1, num2] = number.split('.');
  // 如果不存在小数点，则补足位数
  if (!num2) {
    return decimalPlaces ? number + (new Array(decimalPlaces).fill(0).join('')) : number;
  }
  // 存在小数点，保留 0 位小数，四舍五入
  if (decimalPlaces === 0) {
    return Number(num2[0]) >= 5 ? largeNumberAdd(num1, '1') : num1;
  }
  // 存在小数点，保留 > 0 位小数，四舍五入（此时，整数位不会发生任何变化，只需关注小数位数）
  let decimalNumber = num2.slice(0, decimalPlaces);
  if (num2.length < decimalPlaces) {
    decimalNumber += (new Array(decimalPlaces - num2.length).fill(0).join(''));
  } else {
    decimalNumber = Number(num2[decimalPlaces]) > 5
      ? largeNumberAdd(decimalNumber, '1')
      : decimalNumber;
  }
  return num1 + decimalNumber;
}
