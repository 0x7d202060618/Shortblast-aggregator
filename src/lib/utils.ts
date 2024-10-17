import Decimal from 'decimal.js';

export const INITIAL_EXPONENT = new Decimal(0.000000003606);
export const INITIAL_PROPORTION = 0.6015;

export const calcTokenPrice = (supply: Decimal, solPrice: number) => {
  return (
    ((INITIAL_PROPORTION *
      Math.exp(
        INITIAL_EXPONENT.mul(supply)
          .div(10 ** 9)
          .toNumber(),
      )) /
      10 ** 7) *
    solPrice
  );
};

export const calcTokenPrice1 = (supply: Decimal, solPrice: number) => {
  return new Decimal(
    INITIAL_EXPONENT.mul(supply)
      .div(10 ** 9)
      .toExponential(),
  )
    .mul(INITIAL_PROPORTION)
    .div(10 ** 7)
    .mul(solPrice);
};
