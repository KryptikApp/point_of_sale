import { Principal } from "@dfinity/principal";

// input principal and shorten it to a readable format
export function trimPrincipal(principal: string) {
  if (principal.length > 20) {
    return `${principal.slice(0, 3)}...${principal.slice(-3)}`;
  }
  return principal;
}

export function isValidPrincipal(principal: string) {
  try {
    const p = Principal.fromText(principal);
    return true;
  } catch (error) {
    return false;
  }
}

export function formatPrincipalInput(principal: string): string {
  return Principal.fromText(principal).toText();
}
