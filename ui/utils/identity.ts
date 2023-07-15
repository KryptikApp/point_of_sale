// input principal and shorten it to a readable format
export function trimPrincipal(principal: string) {
  if (principal.length > 20) {
    return `${principal.slice(0, 3)}...${principal.slice(-3)}`;
  }
  return principal;
}
