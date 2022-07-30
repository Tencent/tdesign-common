/**
 * 大数加法，仅支持正整数（没有精度问题）
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
 * 大数加法，支持小数和整数（没有精度问题）
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
  if (decimalLength > decimalNumber1.length && decimalLength > decimalNumber2.length) {
    return [largeIntNumberAdd(integerSum, '1'), decimalNumberSum.slice(1).replace(/0+$/, '')].join('.');
  }
  return [integerSum, decimalNumberSum].join('.');
}

/**
 * 比较两个大数的大小，仅正整数有效
 */
function compareLargeIntegerNumber(num1, num2, decimal = false): 1 | -1 | 0 {
  const number1 = num1 && num1 !== '0' ? num1.replace(/^0+/, '') : '0';
  const number2 = num2 && num2 !== '0' ? num2.replace(/^0+/, '') : '0';
  if (number1.length === number2.length) {
    for (let i = 0, len = number1.length; i < len; i++) {
      if (number1[i] > number2[i]) return 1;
      if (number1[i] < number2[i]) return -1;
    }
    return 0;
  }
  return number1.length > number2.length ? 1 : -1;
}

function compareLargeDecimalNumber(num1, num2) {
  const number1 = num1 && num1 !== '0' ? num1.replace(/0+$/, '') : '0';
  const number2 = num2 && num2 !== '0' ? num2.replace(/0+$/, '') : '0';
  const maxLength = Math.max(number1.length, number2.length);
  for (let i = 0, len = maxLength; i < len; i++) {
    if ((number1[i] || 0) > (number2[i] || 0)) return 1;
    if ((number1[i] || 0) < (number2[i] || 0)) return -1;
  }
  return 0;
}

/**
 * 比较两个大数的大小
 */
export function compareLargeNumber(num1: string, num2: string): 1 | -1 | 0 {
  const [integer1, decimal1] = num1.split('.');
  const [integer2, decimal2] = num2.split('.');
  const result = compareLargeIntegerNumber(integer1, integer2);
  if (result === 0) {
    return compareLargeDecimalNumber(decimal1, decimal2);
  }
  return result;
}

/**
 * 大数减法，仅支持整数
 * @param num1 被减数
 * @param num2 减数
 * @param decimal 是否为小数位相减
 */
export function largeIntegerNumberSubtract(
  num1: string, num2: string, p?: { decimal?: boolean, stayZero?: boolean }
): string {
  if (num1 === num2) return '0';
  const { decimal, stayZero } = p || {};
  // 去除数字最前面的无效数 0
  const number1 = num1 && num1 !== '0' ? num1.replace(/^0+/, '') : '0';
  const number2 = num2 && num2 !== '0' ? num2.replace(/^0+/, '') : '0';
  const isFirstLarger = compareLargeIntegerNumber(number1, number2) > 0;
  const maxNumber = isFirstLarger ? number1 : number2;
  const minNumber = isFirstLarger ? number2 : number1;
  const newNumber = [];
  // step 存储借位信息
  const step = [];
  const diff = decimal ? 0 : maxNumber.length - minNumber.length;
  const len = decimal ? minNumber.length : maxNumber.length;
  for (let i = len - 1; i >= 0; i--) {
    const minIndex = i - diff;
    // 第一个数，减第二个数，减借位
    let count = Number(maxNumber[i]) - (Number(minNumber[minIndex]) || 0) - (step[i] || 0);
    if (count < 0) {
      step[i - 1] = 1;
      count += 10;
    }
    newNumber.unshift(count);
  }
  if (decimal) {
    return newNumber.concat(maxNumber.slice(len, maxNumber.length)).join('');
  }
  let finalNumber = newNumber.join('');
  if (!stayZero) {
    finalNumber = finalNumber.replace(/^0+/, '');
  }
  return isFirstLarger ? finalNumber : `-${finalNumber}`;
}

/**
 * 大数减法，支持整数和小数（无精度问题）
 * @param num1 被减数
 * @param num2 减数
 * @param decimal 是否为小数位相减
 */
export function largeNumberSubtract(num1: string, num2: string): string {
  if (num1 === num2) return '0';
  const isFirstLarger = compareLargeNumber(num1, num2) > 0;
  const maxNumber = isFirstLarger ? num1 : num2;
  const minNumber = isFirstLarger ? num2 : num1;
  // 整数部分和小数部分分开处理
  const [intNumber1, decimalNumber1 = '0'] = maxNumber.split('.');
  const [intNumber2, decimalNumber2 = '0'] = minNumber.split('.');
  let integerNumber = largeIntegerNumberSubtract(intNumber1, intNumber2);
  // 如果不存在小数，则直接返回整数相加结果
  if (decimalNumber1 === '0' && decimalNumber2 === '0') {
    return isFirstLarger ? integerNumber : `-${integerNumber}`;
  }
  // 小数点相减
  let decimalNumber = '';
  let addOneNumber = decimalNumber1;
  if (decimalNumber1.length < decimalNumber2.length) {
    addOneNumber = `${decimalNumber1}${new Array(decimalNumber2.length - decimalNumber1.length).fill(0).join('')}`;
  }
  if (compareLargeDecimalNumber(decimalNumber1, decimalNumber2) >= 0) {
    decimalNumber = largeIntegerNumberSubtract(addOneNumber, decimalNumber2, { decimal: true });
  } else {
    if (decimalNumber1.length < decimalNumber2.length) {
      decimalNumber = largeIntegerNumberSubtract(`1${addOneNumber}`, decimalNumber2, { stayZero: true }).slice(1);
    } else {
      decimalNumber = largeIntegerNumberSubtract(decimalNumber1, decimalNumber2, { decimal: true });
    }
    integerNumber = largeIntegerNumberSubtract(integerNumber, '1');
  }
  const finalNumber = decimalNumber ? [integerNumber, decimalNumber].join('.') : integerNumber;
  return isFirstLarger ? finalNumber : `-${finalNumber}`;
}

/**
 * 大数保留 N 位小数（没有精度问题）
 * @param {String} number 大数（只能使用字符串表示）
 * @param {Number} decimalPlaces 保留的小数位数
 */
export function largeNumberToFixed(number: string, decimalPlaces: number = 0): string {
  if (typeof number !== 'string') return number;
  const [num1, num2] = number.split('.');
  // 如果不存在小数点，则补足位数
  if (!num2) {
    return decimalPlaces ? [number, (new Array(decimalPlaces).fill(0).join(''))].join('.') : number;
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
  return [num1, decimalNumber].join('.');
}
