import { Intake, RateContext } from './types';
import { DEFAULTS } from './negotiation';

export function computeInitialRate(intake: Intake): RateContext {
  const base = DEFAULTS.baselineAPR;
  let offer = DEFAULTS.initialOffer;

  if ((intake.assets ?? 0) > 100_000) offer -= 0.03; // tiny asset-based adj
  if (intake.firstTimeBuyer) offer -= 0.02;           // loyalty-esque adj
  offer = +offer.toFixed(2);
  return {
    baselineAPR: base,
    offeredAPR: offer,
    floorAPR: DEFAULTS.floorAPR,
    stepDown: DEFAULTS.stepDown,
    accepted: false,
    notaryDone: false,
  };
}
