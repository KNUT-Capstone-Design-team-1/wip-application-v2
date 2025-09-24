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

  return (dotProd / (magX * magY)) * 100;
};

const calcOtherSimilarity = (input: string, target: string) => {
  const inputUpper = input.toUpperCase();
  const targetUpper = target.toUpperCase();

  let logicScore = 0;

  // 검색어 연속성 검사
  const continuousIndex = targetUpper.indexOf(inputUpper);
  if (continuousIndex !== -1) {
    logicScore = 1000 - continuousIndex * 10;
  }

  // 필요한 규칙의 경우 해당 위치에 추가

  logicScore = Math.max(0, logicScore);

  return logicScore;
};

const maxTextLength = 29;

const textToVector = (text: string) => {
  const vector = new Array<number>(maxTextLength).fill(0);

  for (let i = 0; i < text.length; i++) {
    vector[i] = text.charCodeAt(i);
  }

  return vector;
};

export { calcCosineSimilarity, textToVector, calcOtherSimilarity };
