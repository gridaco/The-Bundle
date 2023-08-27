const ascii = /^[ -~\n]+$/;

/**
 * check if text is all-ascii characters
 * @param str
 * @returns
 */
export const isAscii = (str: string) => ascii.test(str);

/**
 * check if text contains non-ascii characters
 * @param str
 * @returns
 */
export const isNotAscii = (str: string) => !isAscii(str);
