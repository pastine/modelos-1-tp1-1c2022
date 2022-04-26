const input = require('./input.json');
const fs = require('fs');

const OUTPUT_FILE = 'solution.out';

const parseInput = () => {
  const maxCapacity = input.CAPACIDAD;
  const banks = [];
  input.DEMANDAS.forEach((bankDemand, i) => {
    banks.push({
      demand: bankDemand.demanda,
      id: bankDemand.id,
      x: input.NODE_COORD_SECTION[i].x,
      y: input.NODE_COORD_SECTION[i].y,
    })
  });
  return { maxCapacity, banks };
}

const getFinalPath = () => {
  // We split the banks into positive and negative demand.
  // We'll visit positive demand banks until the current capacity of the truck is about to reach the maximum.
  // If the capacity is about to be passed, then we take a bank with negative demand.
  // We repeat this steps until we finish processing the bank list.

  const { maxCapacity, banks } = parseInput();

  const banksWithPositiveDemand = banks.filter(({ demand }) => demand >= 0);
  const banksWithNegativeDemand = banks.filter(({ demand }) => demand < 0);

  let indexBanksWithPositiveDemand = 0;
  let indexBanksWithNegativeDemand = 0;

  let currentCapacity = 0;
  const route = [];

  for (let i = 0; i < banks.length; i++){
    if (
      (indexBanksWithPositiveDemand < banksWithPositiveDemand.length) &&
      (currentCapacity + banksWithPositiveDemand[indexBanksWithPositiveDemand].demand < maxCapacity)
    ) {
      console.log('Grabbing positive demand bank', {...banksWithPositiveDemand[indexBanksWithPositiveDemand]}, { currentCapacity });
      route.push(banksWithPositiveDemand[indexBanksWithPositiveDemand]);
      currentCapacity +=  banksWithPositiveDemand[indexBanksWithPositiveDemand].demand;
      indexBanksWithPositiveDemand++;

    } else if (
      (indexBanksWithNegativeDemand < banksWithNegativeDemand.length) &&
      (currentCapacity - banksWithNegativeDemand[indexBanksWithNegativeDemand].demand > 0)
    ) {
      console.log('Grabbing negative demand bank', {...banksWithNegativeDemand[indexBanksWithNegativeDemand]}, { currentCapacity });
      route.push(banksWithNegativeDemand[indexBanksWithNegativeDemand]);
      currentCapacity +=  banksWithNegativeDemand[indexBanksWithNegativeDemand].demand;
      indexBanksWithNegativeDemand++;
    } else {
      console.log('Cannot solve the problem this way', {
        totalBanksProcessed: i,
        totakPositiveDemand: indexBanksWithPositiveDemand,
        totalNegativeDemand: indexBanksWithNegativeDemand,
        currentCapacity,
        nextPositiveDemandToProcess: banksWithPositiveDemand[indexBanksWithPositiveDemand],
        nextWithNegativeDemandToProcess: banksWithNegativeDemand[indexBanksWithNegativeDemand],
        totalBanks: banks.length
      });
      break;
    }
  }
  return route;
}

const main = () => {
  const solution = getFinalPath();
  let strSolution = '';
  solution.forEach(({id}) => {
    strSolution += `${id} `;
  });
  fs.writeFileSync(OUTPUT_FILE, strSolution);
}

main();
