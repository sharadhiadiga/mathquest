interface Question {
  question: string;
  answer: number;
  options?: number[];
  type: 'input' | 'multiple-choice';
}

// Utility functions for random generation
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateMultipleChoiceOptions(correct: number, type: 'integer' | 'float' = 'integer'): number[] {
  const options = [correct];
  const range = Math.max(Math.abs(correct * 0.5), 5);
  
  while (options.length < 4) {
    let wrongAnswer: number;
    if (type === 'float') {
      wrongAnswer = Number((correct + randomFloat(-range, range)).toFixed(2));
    } else {
      wrongAnswer = correct + randomInt(-Math.floor(range), Math.floor(range));
    }
    
    if (!options.includes(wrongAnswer) && wrongAnswer !== correct) {
      options.push(wrongAnswer);
    }
  }
  
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return options;
}

// Algebra question generators
function generateLinearEquation(): Question {
  const a = randomInt(2, 8);
  const b = randomInt(1, 15);
  const x = randomInt(1, 10);
  const result = a * x + b;
  
  return {
    question: `Solve for x: ${a}x + ${b} = ${result}`,
    answer: x,
    type: 'input'
  };
}

function generateQuadraticFactoring(): Question {
  const a = randomInt(1, 3);
  const root1 = randomInt(1, 5);
  const root2 = randomInt(1, 5);
  
  // (ax - root1)(x - root2) = ax² - (a*root2 + root1)x + root1*root2
  const b = -(a * root2 + root1);
  const c = root1 * root2;
  
  const solutions = a === 1 ? [root1, root2] : [root1/a, root2];
  const answer = Math.max(...solutions);
  
  return {
    question: `Find the larger root of: ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
    answer: answer,
    options: generateMultipleChoiceOptions(answer, 'float'),
    type: 'multiple-choice'
  };
}

function generateSystemOfEquations(): Question {
  const x = randomInt(1, 8);
  const y = randomInt(1, 8);
  const a1 = randomInt(1, 4);
  const b1 = randomInt(1, 4);
  const a2 = randomInt(1, 4);
  const b2 = randomInt(1, 4);
  
  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;
  
  return {
    question: `Solve the system: ${a1}x + ${b1}y = ${c1} and ${a2}x + ${b2}y = ${c2}. Find x + y.`,
    answer: x + y,
    type: 'input'
  };
}

// Geometry question generators
function generateAreaRectangle(): Question {
  const length = randomInt(5, 15);
  const width = randomInt(3, 12);
  
  return {
    question: `Find the area of a rectangle with length ${length} units and width ${width} units.`,
    answer: length * width,
    type: 'input'
  };
}

function generateCircleArea(): Question {
  const radius = randomInt(3, 10);
  const area = Number((Math.PI * radius * radius).toFixed(2));
  
  return {
    question: `Find the area of a circle with radius ${radius} units. (Use π ≈ 3.14159)`,
    answer: area,
    options: generateMultipleChoiceOptions(area, 'float'),
    type: 'multiple-choice'
  };
}

function generateTriangleArea(): Question {
  const base = randomInt(4, 12);
  const height = randomInt(3, 10);
  const area = (base * height) / 2;
  
  return {
    question: `Find the area of a triangle with base ${base} units and height ${height} units.`,
    answer: area,
    type: 'input'
  };
}

function generatePythagoreanTheorem(): Question {
  // Generate a Pythagorean triple or close to it
  const triples = [[3,4,5], [5,12,13], [8,15,17], [7,24,25], [6,8,10]];
  const triple = triples[randomInt(0, triples.length - 1)];
  const [a, b, c] = triple.map(x => x * randomInt(1, 3));
  
  const missingType = randomInt(0, 2);
  
  if (missingType === 0) {
    return {
      question: `In a right triangle, if one leg is ${a} and the hypotenuse is ${c}, find the other leg.`,
      answer: b,
      type: 'input'
    };
  } else if (missingType === 1) {
    return {
      question: `In a right triangle, if the legs are ${a} and ${b}, find the hypotenuse.`,
      answer: c,
      type: 'input'
    };
  } else {
    return {
      question: `In a right triangle, if one leg is ${b} and the hypotenuse is ${c}, find the other leg.`,
      answer: a,
      type: 'input'
    };
  }
}

// Trigonometry question generators
function generateBasicTrig(): Question {
  const angles = [0, 30, 45, 60, 90];
  const functions = ['sin', 'cos', 'tan'];
  
  const angle = angles[randomInt(0, angles.length - 1)];
  const func = functions[randomInt(0, functions.length - 1)];
  
  const values: Record<string, Record<number, number>> = {
    sin: { 0: 0, 30: 0.5, 45: Number((Math.sqrt(2)/2).toFixed(3)), 60: Number((Math.sqrt(3)/2).toFixed(3)), 90: 1 },
    cos: { 0: 1, 30: Number((Math.sqrt(3)/2).toFixed(3)), 45: Number((Math.sqrt(2)/2).toFixed(3)), 60: 0.5, 90: 0 },
    tan: { 0: 0, 30: Number((1/Math.sqrt(3)).toFixed(3)), 45: 1, 60: Number(Math.sqrt(3).toFixed(3)), 90: Infinity }
  };
  
  const answer = values[func][angle];
  
  if (answer === Infinity) {
    return generateBasicTrig(); // Regenerate if we get undefined
  }
  
  return {
    question: `Find ${func}(${angle}°). Round to 3 decimal places if necessary.`,
    answer: answer,
    options: generateMultipleChoiceOptions(answer, 'float'),
    type: 'multiple-choice'
  };
}

function generateTrigIdentity(): Question {
  const angle = randomInt(15, 75);
  const sinValue = Number(Math.sin(angle * Math.PI / 180).toFixed(3));
  const cosValue = Number(Math.cos(angle * Math.PI / 180).toFixed(3));
  
  return {
    question: `If sin(${angle}°) ≈ ${sinValue}, find cos²(${angle}°). Use the identity sin²θ + cos²θ = 1.`,
    answer: Number((1 - sinValue * sinValue).toFixed(3)),
    options: generateMultipleChoiceOptions(Number((1 - sinValue * sinValue).toFixed(3)), 'float'),
    type: 'multiple-choice'
  };
}

// Calculus question generators
function generateDerivativePolynomial(): Question {
  const coeffs = [randomInt(1, 5), randomInt(1, 8), randomInt(1, 10)];
  const powers = [3, 2, 1];
  
  // f(x) = ax³ + bx² + cx
  // f'(x) = 3ax² + 2bx + c
  const a = coeffs[0];
  const b = coeffs[1];
  const c = coeffs[2];
  
  const x = randomInt(1, 3);
  const derivative = 3 * a * x * x + 2 * b * x + c;
  
  return {
    question: `Find f'(${x}) if f(x) = ${a}x³ + ${b}x² + ${c}x`,
    answer: derivative,
    type: 'input'
  };
}

function generateBasicIntegral(): Question {
  const coeff = randomInt(1, 6);
  const power = randomInt(2, 4);
  
  // ∫ ax^n dx = (a/(n+1))x^(n+1) + C
  // We'll ask for the coefficient of the result
  const result = coeff / (power + 1);
  
  return {
    question: `Find the coefficient of x^${power + 1} in ∫${coeff}x^${power} dx`,
    answer: Number(result.toFixed(3)),
    options: generateMultipleChoiceOptions(Number(result.toFixed(3)), 'float'),
    type: 'multiple-choice'
  };
}

function generateLimitBasic(): Question {
  const a = randomInt(1, 5);
  const b = randomInt(1, 8);
  const x = randomInt(1, 4);
  
  // lim(x→c) (ax + b) = ac + b
  const limit = a * x + b;
  
  return {
    question: `Find lim(x→${x}) (${a}x + ${b})`,
    answer: limit,
    type: 'input'
  };
}

// Main generator function
export function generateQuestion(topic: string): Question {
  const generators: Record<string, () => Question> = {
    algebra: () => {
      const types = [generateLinearEquation, generateQuadraticFactoring, generateSystemOfEquations];
      return types[randomInt(0, types.length - 1)]();
    },
    geometry: () => {
      const types = [generateAreaRectangle, generateCircleArea, generateTriangleArea, generatePythagoreanTheorem];
      return types[randomInt(0, types.length - 1)]();
    },
    trigonometry: () => {
      const types = [generateBasicTrig, generateTrigIdentity];
      return types[randomInt(0, types.length - 1)]();
    },
    calculus: () => {
      const types = [generateDerivativePolynomial, generateBasicIntegral, generateLimitBasic];
      return types[randomInt(0, types.length - 1)]();
    }
  };
  
  const generator = generators[topic];
  if (!generator) {
    // Fallback to algebra if topic not found
    return generators.algebra();
  }
  
  return generator();
}