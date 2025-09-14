import { RateContext } from './types';

export const DEFAULTS = {
  baselineAPR: 6.8,
  initialOffer: 6.62,
  floorAPR: 6.45,
  stepDown: 0.03,
};

export function initRate(): RateContext {
  return {
    baselineAPR: DEFAULTS.baselineAPR,
    offeredAPR: DEFAULTS.initialOffer,
    floorAPR: DEFAULTS.floorAPR,
    stepDown: DEFAULTS.stepDown,
    accepted: false,
    notaryDone: false,
  };
}

export function counterOffer(rate: RateContext): RateContext {
  if (rate.accepted) return rate;
  const next = { ...rate };
  if (next.offeredAPR && next.floorAPR && next.stepDown) {
    const decreased = +(next.offeredAPR - next.stepDown).toFixed(2);
    next.offeredAPR = Math.max(decreased, next.floorAPR);
  }
  return next;
}

export function isAtFloor(rate: RateContext): boolean {
  if (rate.offeredAPR == null || rate.floorAPR == null) return false;
  return rate.offeredAPR <= rate.floorAPR + 1e-9;
}
