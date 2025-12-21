export interface BaseInfoRow {
  date: string;
  chain: string;
  marketPrice: number;
  marketVolume: number;
  validatorsActive: number;
  validatorsTotal: number;
  tokenBonded: number;
  tokenSupply: number;
  activeAccountCount: number;
}

export interface RelayerFlowRow {
  date: string;
  source: string;
  target: string;
  outflow_usd: number;
}
