const dotProduct = (x: number[], y: number[]) => {
  let sum: number = 0;

  for (let i = 0; i < x.length; i++) {
    sum += x[i] * y[i];
  }

  return sum;
};

const magnitude = (x: number[], y: number[]) => {
  let xSum: number = 0;
  let ySum: number = 0;

  for (let i = 0; i < x.length; i++) {
    xSum += x[i] * x[i];
    ySum += y[i] * y[i];
  }

  return { magX: Math.sqrt(xSum), magY: Math.sqrt(ySum) };
};

const calcCosineSimilarity = (initXVector: number[], yVector: number[]) => {
  let xVector: number[];
  if (initXVector.length !== yVector.length) {
    const diff = yVector.length - initXVector.length;
    xVector = initXVector.concat(new Array(diff).fill(0));
  } else {
    xVector = initXVector;
  }

  const dotProd = dotProduct(xVector, yVector);
  const { magX, magY } = magnitude(xVector, yVector);

  return dotProd / (magX * magY);
};

const maxTextLength = 29;

const textToVector = (text: string) => {
  const vector = new Array<number>(maxTextLength).fill(0);

  for (let i = 0; i < text.length; i++) {
    vector[i] = text.charCodeAt(i);
  }

  return vector;
};

export { calcCosineSimilarity, textToVector };
