import type { BaseInfoRow } from "../../types/csvData";

export function adaptBaseInfoForInternalStability(rows: BaseInfoRow[]) {
  return {
    prices: rows.map((r) => r.marketPrice),
    volumes: rows.map((r) => r.marketVolume),
    staking: rows.map((r) => ({
      bonded: r.tokenBonded,
      supply: r.tokenSupply,
    })),
    activeAccounts: rows.map((r) => r.activeAccountCount),
    validators: rows.map((r) => ({
      active: r.validatorsActive,
      total: r.validatorsTotal,
    })),
  };
}
