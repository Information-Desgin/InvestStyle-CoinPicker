export type InvestStyle =
  | "aggressive" // 공격형
  | "stable" // 안정형
  | "cautious" // 신중형
  | "neutral" // 중립형
  | "marketCap"; // 시가총액순

export type ChainCoin = {
  chain: string;
  coin: string;
  internalStability: number;
  externalStability: number;
  netFlow: number;
  color: string;
  imgSrc: string;
};

export type ChainCoinList = ChainCoin[];
