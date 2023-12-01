const REG_SPECIAL_CODE = /(\\|\*|\+|\?|\(|\)|\[|\])/g;

export function createRegExp(str: string, modifier?: string): RegExp {
  let newStr = str;
  if (REG_SPECIAL_CODE.test(str)) {
    newStr = newStr.replace(REG_SPECIAL_CODE, '\\$1');
  }
  return new RegExp(newStr, modifier);
}

export default createRegExp;
