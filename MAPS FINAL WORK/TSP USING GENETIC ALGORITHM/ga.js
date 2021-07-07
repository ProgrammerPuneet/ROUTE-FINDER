// Traveling Salesperson with Genetic Algorithm

function calculateFitness() {
  var currentRecord = Infinity;
  for (var i = 0; i < population.length; i++) {
    var d = calcDistance(cities, population[i]);
    if (d < recordDistance) {
      recordDistance = d;
      bestEver = population[i]; //that order of population
    }
    if (d < currentRecord) {
      currentRecord = d;
      currentBest = population[i]; //this is current best and prev is overall best
    }

    fitness[i] = 1 / (pow(d, 8) + 1);
    //if distance between them is more so they have less fitness

  }
}

function normalizeFitness() {
  //normal normalization function 
  var sum = 0;
  for (var i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }
  for (var i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;
  }
}

function nextGeneration() {
  var newPopulation = [];
  for (var i = 0; i < population.length; i++) {
    var orderA = pickOne(population, fitness);
    var orderB = pickOne(population, fitness);
    var order = crossOver(orderA, orderB);
    mutate(order, 0.01);
    newPopulation[i] = order;
  }
  population = newPopulation;
}

function pickOne(list, prob) {
  //this function is used to pickup the best population 
  //as per fitness value from total population
  var index = 0;
  var r = random(1);
  //RANDOM POOL SELECTION

  //since we normalized the fitness value 
  //so max chances are there if we pick a random 
  //number it must land in the more fitness group only 
  // because all are from 0-1 and number we picking also in 0-1
  // fitness =0.7 has more probability to pickup  
  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function crossOver(orderA, orderB) {
  //this crossover is making a hybrid child from two parents
  var start = floor(random(orderA.length));
  var end = floor(random(start + 1, orderA.length));
  var neworder = orderA.slice(start, end);
  // var left = totalCities - neworder.length;
  for (var i = 0; i < orderB.length; i++) {
    var city = orderB[i];
    if (!neworder.includes(city)) {
      neworder.push(city);
    }
  }
  return neworder;
}

function mutate(order, mutationRate) {
  //this mutation is channging inside a single parent
  for (var i = 0; i < totalCities; i++) {
    if (random(1) < mutationRate) {
      var indexA = floor(random(order.length));
      var indexB = (indexA + 1) % totalCities;
      swap(order, indexA, indexB);
    }
  }
}


//pickOne function 
//crossOver function
//store the distance as improvements