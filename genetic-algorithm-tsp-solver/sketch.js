// Traveling Salesperson with Genetic Algorithm

var cities = [];
var totalCities = 12;

var popSize = 5;
var population = [];
var fitness = [];  //for every element of population we put fitness score of that population
//at that particular i

var recordDistance = Infinity;
var bestEver;
var currentBest;

var statusP;

function setup() {
  createCanvas(800, 800);
  var order = [];
  
  for (var i = 0; i < totalCities; i++) {
    var v = createVector(random(width), random(height / 2)); //just to {x,y} point
    cities[i] = v;    //a vector
    order[i] = i;     // this is for preserving the order of visiting these cities
  }

  for (var i = 0; i < popSize; i++) {
    population[i] = shuffle(order); //it is vector<vector<int>>
    //created  so many populations from the same points 
  }
  //console.log(population);
  statusP = createP('').style('font-size', '32pt');
}

function draw() {
  background(0);

  // GA
  calculateFitness();
  normalizeFitness();
  nextGeneration();

  stroke(255);
  strokeWeight(4);
  noFill();
  beginShape();
  for (var i = 0; i < bestEver.length; i++) {
    var n = bestEver[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  endShape();

  translate(0, height / 2);
  stroke(255);
  strokeWeight(4);
  noFill();
  beginShape();
  for (var i = 0; i < currentBest.length; i++) {
    var n = currentBest[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  endShape();
}

function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function calcDistance(points, order) {
  var sum = 0;
  for (var i = 0; i < order.length - 1; i++) {
    var cityAIndex = order[i];
    var cityA = points[cityAIndex];
    var cityBIndex = order[i + 1];
    var cityB = points[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}
