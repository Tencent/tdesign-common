export const hasUnit = (value: string): boolean => {
    return /px|rpx|em|rem|%|vh|vw/.test(value);
};

export const addUnit = (value: string | number): string => {
    const strValue = value.toString();
    return hasUnit(strValue) ? strValue : `${value}px`;
};