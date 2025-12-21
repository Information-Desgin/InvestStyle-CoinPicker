import { COINS } from "../data/coins";

// chain → coinId
export const CHAIN_TO_COIN_ID: Record<string, string> = Object.entries(
  COINS
).reduce((acc, [coinId, coin]) => {
  acc[coin.chain.toLowerCase()] = coinId;
  return acc;
}, {} as Record<string, string>);
