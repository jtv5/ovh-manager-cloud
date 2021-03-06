/*
 * Define some useful statistical functions on arrays of numbers
 */

Array.prototype.sum = function () {
  let i; let
    sum = 0;
  for (i = 0; i < this.length; i++) {
    sum += this[i];
  }
  return sum;
};

Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

Array.prototype.min = function () {
  return Math.min.apply(null, this);
};

Array.prototype.mean = function () {
  return this.sum() / this.length;
};
Array.prototype.average = Array.prototype.mean;

Array.prototype.median = function () {
  const sorted = this.sort((a, b) => a - b);


  const len = sorted.length;
  if (len % 2) {
    return sorted[Math.floor(len / 2)]; // Odd
  }
  return (sorted[len / 2 - 1] + sorted[len / 2]) / 2; // Even
};

Array.prototype.stdDev = function (sample) {
  let i; let sumSqr = 0; const mean = this.mean(); let
    N;

  if (sample) {
    // Population correction if this is a sample
    N = this.length - 1;
  } else {
    // Standard deviation of just the array
    N = this.length;
  }

  for (i = 0; i < this.length; i++) {
    sumSqr += Math.pow(this[i] - mean, 2);
  }

  return Math.sqrt(sumSqr / N);
};
