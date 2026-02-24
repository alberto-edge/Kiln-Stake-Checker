export function weiToEth(wei: string | number): number {
  return Number(BigInt(wei)) / 1e18;
}

export function formatEth(wei: string | number, decimals = 6): string {
  return weiToEth(wei).toFixed(decimals);
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function etherscanTxUrl(hash: string): string {
  return `https://etherscan.io/tx/${hash}`;
}

export function etherscanAddressUrl(address: string): string {
  return `https://etherscan.io/address/${address}`;
}
