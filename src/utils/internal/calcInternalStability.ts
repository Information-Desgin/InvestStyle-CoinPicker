import { calcPriceStability } from "./priceStability";
import { calcVolumeStability } from "./volumeStability";
import { calcStakingStability } from "./stakingStability";
import { calcActiveAccountStability } from "./activeAccountStability";
import { calcValidatorStability } from "./validatorStability";

export type InternalStabilityResult = {
  price: number;
  onchain: number;
  staking: number;
  active: number;
  validator: number;
};

export function calcInternalStability(input: {
  prices: number[];
  volumes: number[];
  staking: { bonded: number; supply: number }[];
  activeAccounts: number[];
  validators: { active: number; total: number }[];
}): InternalStabilityResult {
  return {
    price: calcPriceStability(input.prices),
    onchain: calcVolumeStability(input.volumes),
    staking: calcStakingStability(input.staking),
    active: calcActiveAccountStability(input.activeAccounts),
    validator: calcValidatorStability(input.validators),
  };
}
