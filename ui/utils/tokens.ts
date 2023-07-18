import { Transaction } from "../types/transaction";

/**
 * Formats a number of CKBytes to a string with 8 decimal places.
 * @param amount amount of CKBtc
 */
export function formatCkBtc(amount: number | undefined) {
  if (!amount) return "0";
  const integerPart = amount / 100000000;
  const fractionalPart = amount % 100000000;
  const fractionalPartString = fractionalPart.toString().padStart(8, "0");
  const fractionalPartTrimmed = fractionalPartString.replace(/0+$/, ""); // Removes trailing zeroes
  return `${integerPart.toLocaleString()}.${fractionalPartTrimmed}`;
}

export function isTxCkBtc(tx: Transaction) {
  if (tx.ticker.toLowerCase() === "ckbtc") {
    return true;
  } else {
    return false;
  }
}
