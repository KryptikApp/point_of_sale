/**
 * Converts a number to a big int
 * @param num number to convert
 * @returns big int
 * @note automatically runs ckBtc unit conversions
 */
export function convertToBigInt(num: number): bigint {
  // applies conversion to 8 decimal places (for ckbtc
  return BigInt(Math.round(num * 100_000_000));
}
