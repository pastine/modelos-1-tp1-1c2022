const input = require('./input.json');
const fs = require('fs');

const OUTPUT_FILE = 'solution-3.out';

const parseInput = () => {
  const maxCapacity = input.CAPACIDAD;
  const banks = [];
  Object.keys(input.DEMANDAS).forEach((id) => {
    banks.push({
      demand: input.DEMANDAS[id].demanda,
      id,
      x: input.NODE_COORD_SECTION[id].x,
      y: input.NODE_COORD_SECTION[id].y,
    })
  });
  return { maxCapacity, banks };
}

const getStartingBank = (banks) => {
  return banks.filter(({demand}) => demand >= 0)[0];
}

const sortBanksByDistanceTo = (bank, banksById) => {
  const origin_x = bank.x;
  const origin_y = bank.y;
  const distanceToOrigin = (b) => {
    const distanceOnX = origin_x - b.x;
    const distanceOnY = origin_y - b.y;
    return Math.sqrt(Math.pow(distanceOnX, 2) + Math.pow(distanceOnY, 2));
  }

  return Object.values(banksById).sort((bank1, bank2) => distanceToOrigin(bank1) - distanceToOrigin(bank2));
}

const getFinalPath = () => {
  // We split the banks into positive and negative demand.
  // We'll visit positive demand banks until the current capacity of the truck is about to reach the maximum.
  // If the capacity is about to be passed, then we take a bank with negative demand.
  // We repeat this steps until we finish processing the bank list.

  const { banks } = parseInput();
  let banksById = banks.reduce((acc, { demand, id, x, y }) => {
    acc[id] = { demand, x, y, id};
    return acc;
  }, {});
  let currentBank = getStartingBank(banks);
  let currentCapacity = currentBank.demand;
  const route = [currentBank];
  delete banksById[currentBank.id];
  
  for (let i = 0; i < banks.length - 1; i++){
    // We sort all visitable banks by the distance to the current bank.
    const sortedBanks = sortBanksByDistanceTo(currentBank, banksById);

    const nextBank = sortedBanks[0];

    console.log(`\n\nCurrent status ${i + 1}`);
    console.log({currentBank, nextBank, top3SortedBanks: sortedBanks.slice(0, 3)});
    // Remove the next bank from the list of banks to visit.
    delete banksById[nextBank.id];
    // Add the bank to the path array.
    route.push(nextBank);
    // Update capacity of the truck
    currentCapacity += nextBank.demand;
  
    currentBank = nextBank;
  }
  return route;
}

const main = () => {
  const solution = getFinalPath();
  let strSolution = '';
  solution.forEach(({id}) => {
    strSolution += `${id}, `;
  });
  fs.writeFileSync(OUTPUT_FILE, strSolution);
}

main();
