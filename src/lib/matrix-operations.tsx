export interface Step {
  title: string;
  explanation: string;
  matrix?: number[][];
  calculation?: string;
  result?: number | string;
  highlight?: { row?: number; col?: number };
}

export function generateSteps(matrix: number[][], operation: string): Step[] {
  switch (operation) {
    case "determinant":
      return calculateDeterminant3x3(matrix);
    case "rowReduction":
      return rowReduction(matrix);
    case "cramer":
      return cramerRule(matrix);
    case "inverse":
      return inverseMatrix(matrix);
    default:
      return [];
  }
}

function calculateDeterminant3x3(matrix: number[][]): Step[] {
  const steps: Step[] = [];

  steps.push({
    title: "Matriz Original",
    explanation:
      "Vamos calcular o determinante desta matriz 3×3 usando a regra de Sarrus.",
    matrix: matrix,
  });

  steps.push({
    title: "Regra de Sarrus - Diagonais Principais",
    explanation:
      "Primeiro, calculamos o produto das diagonais principais (da esquerda para a direita, de cima para baixo).",
    matrix: matrix,
    calculation: `Diagonal 1: ${matrix[0][0]} × ${matrix[1][1]} × ${matrix[2][2]} = ${matrix[0][0] * matrix[1][1] * matrix[2][2]}
Diagonal 2: ${matrix[0][1]} × ${matrix[1][2]} × ${matrix[2][0]} = ${matrix[0][1] * matrix[1][2] * matrix[2][0]}
Diagonal 3: ${matrix[0][2]} × ${matrix[1][0]} × ${matrix[2][1]} = ${matrix[0][2] * matrix[1][0] * matrix[2][1]}

Soma das diagonais principais: ${matrix[0][0] * matrix[1][1] * matrix[2][2] + matrix[0][1] * matrix[1][2] * matrix[2][0] + matrix[0][2] * matrix[1][0] * matrix[2][1]}`,
  });

  steps.push({
    title: "Regra de Sarrus - Diagonais Secundárias",
    explanation:
      "Agora, calculamos o produto das diagonais secundárias (da direita para a esquerda, de cima para baixo).",
    matrix: matrix,
    calculation: `Diagonal 1: ${matrix[0][2]} × ${matrix[1][1]} × ${matrix[2][0]} = ${matrix[0][2] * matrix[1][1] * matrix[2][0]}
Diagonal 2: ${matrix[0][0]} × ${matrix[1][2]} × ${matrix[2][1]} = ${matrix[0][0] * matrix[1][2] * matrix[2][1]}
Diagonal 3: ${matrix[0][1]} × ${matrix[1][0]} × ${matrix[2][2]} = ${matrix[0][1] * matrix[1][0] * matrix[2][2]}

Soma das diagonais secundárias: ${matrix[0][2] * matrix[1][1] * matrix[2][0] + matrix[0][0] * matrix[1][2] * matrix[2][1] + matrix[0][1] * matrix[1][0] * matrix[2][2]}`,
  });

  const mainDiagonals =
    matrix[0][0] * matrix[1][1] * matrix[2][2] +
    matrix[0][1] * matrix[1][2] * matrix[2][0] +
    matrix[0][2] * matrix[1][0] * matrix[2][1];

  const secondaryDiagonals =
    matrix[0][2] * matrix[1][1] * matrix[2][0] +
    matrix[0][0] * matrix[1][2] * matrix[2][1] +
    matrix[0][1] * matrix[1][0] * matrix[2][2];

  const determinant = mainDiagonals - secondaryDiagonals;

  steps.push({
    title: "Cálculo Final",
    explanation:
      "O determinante é a diferença entre a soma das diagonais principais e a soma das diagonais secundárias.",
    calculation: `det(A) = (soma principais) - (soma secundárias)
det(A) = ${mainDiagonals} - ${secondaryDiagonals}
det(A) = ${determinant}`,
    result: determinant,
  });

  return steps;
}

function rowReduction(matrix: number[][]): Step[] {
  const steps: Step[] = [];
  const n = matrix.length;
  const m = matrix[0].length;
  const currentMatrix = matrix.map((row) => [...row]);

  steps.push({
    title: "Matriz Original",
    explanation:
      "Vamos reduzir esta matriz à forma escalonada usando operações elementares de linha.",
    matrix: currentMatrix.map((row) => [...row]),
  });

  for (let col = 0; col < Math.min(n, m); col++) {
    // Find pivot
    let pivotRow = col;
    for (let row = col + 1; row < n; row++) {
      if (
        Math.abs(currentMatrix[row][col]) >
        Math.abs(currentMatrix[pivotRow][col])
      ) {
        pivotRow = row;
      }
    }

    // Swap rows if needed
    if (pivotRow !== col) {
      [currentMatrix[col], currentMatrix[pivotRow]] = [
        currentMatrix[pivotRow],
        currentMatrix[col],
      ];
      steps.push({
        title: `Troca de Linhas ${col + 1} ↔ ${pivotRow + 1}`,
        explanation: `Trocamos a linha ${col + 1} com a linha ${pivotRow + 1} para obter um pivô melhor.`,
        matrix: currentMatrix.map((row) => [...row]),
        highlight: { row: col },
      });
    }

    const pivot = currentMatrix[col][col];
    if (Math.abs(pivot) < 0.0001) continue;

    // Eliminate below pivot
    for (let row = col + 1; row < n; row++) {
      const factor = currentMatrix[row][col] / pivot;
      if (Math.abs(factor) < 0.0001) continue;

      for (let j = col; j < m; j++) {
        currentMatrix[row][j] -= factor * currentMatrix[col][j];
      }

      steps.push({
        title: `Eliminação: Linha ${row + 1}`,
        explanation: `Subtraímos ${factor.toFixed(2)} vezes a linha ${col + 1} da linha ${row + 1} para zerar o elemento abaixo do pivô.`,
        matrix: currentMatrix.map((row) => [...row]),
        highlight: { row: row },
        calculation: `L${row + 1} = L${row + 1} - (${factor.toFixed(2)}) × L${col + 1}`,
      });
    }
  }

  steps.push({
    title: "Forma Escalonada",
    explanation:
      "A matriz foi reduzida à forma escalonada. Todos os elementos abaixo da diagonal principal são zero.",
    matrix: currentMatrix.map((row) => [...row]),
  });

  return steps;
}

function cramerRule(matrix: number[][]): Step[] {
  const steps: Step[] = [];

  // Assume last column is the constants vector
  const A = matrix.map((row) => row.slice(0, -1));
  const b = matrix.map((row) => row[row.length - 1]);

  steps.push({
    title: "Sistema Linear",
    explanation:
      "Vamos resolver este sistema de equações lineares usando a Regra de Cramer. A última coluna representa os termos independentes.",
    matrix: matrix,
  });

  // Calculate determinant of A
  const detA =
    A[0][0] * A[1][1] * A[2][2] +
    A[0][1] * A[1][2] * A[2][0] +
    A[0][2] * A[1][0] * A[2][1] -
    A[0][2] * A[1][1] * A[2][0] -
    A[0][0] * A[1][2] * A[2][1] -
    A[0][1] * A[1][0] * A[2][2];

  steps.push({
    title: "Determinante da Matriz dos Coeficientes",
    explanation:
      "Primeiro, calculamos o determinante da matriz dos coeficientes (sem a coluna dos termos independentes).",
    matrix: A,
    calculation: `det(A) = ${detA.toFixed(2)}`,
    result: detA.toFixed(2),
  });

  if (Math.abs(detA) < 0.0001) {
    steps.push({
      title: "Sistema Impossível ou Indeterminado",
      explanation:
        "O determinante é zero, portanto o sistema não tem solução única pela Regra de Cramer.",
    });
    return steps;
  }

  const solutions: number[] = [];

  for (let i = 0; i < 3; i++) {
    const Ai = A.map((row, rowIndex) =>
      row.map((val, colIndex) => (colIndex === i ? b[rowIndex] : val)),
    );

    const detAi =
      Ai[0][0] * Ai[1][1] * Ai[2][2] +
      Ai[0][1] * Ai[1][2] * Ai[2][0] +
      Ai[0][2] * Ai[1][0] * Ai[2][1] -
      Ai[0][2] * Ai[1][1] * Ai[2][0] -
      Ai[0][0] * Ai[1][2] * Ai[2][1] -
      Ai[0][1] * Ai[1][0] * Ai[2][2];

    const xi = detAi / detA;
    solutions.push(xi);

    steps.push({
      title: `Cálculo de x${i + 1}`,
      explanation: `Substituímos a coluna ${i + 1} pelos termos independentes e calculamos o determinante.`,
      matrix: Ai,
      calculation: `det(A${i + 1}) = ${detAi.toFixed(2)}
x${i + 1} = det(A${i + 1}) / det(A) = ${detAi.toFixed(2)} / ${detA.toFixed(2)} = ${xi.toFixed(2)}`,
      result: xi.toFixed(2),
    });
  }

  steps.push({
    title: "Solução do Sistema",
    explanation: "A solução do sistema linear é:",
    calculation: `x₁ = ${solutions[0].toFixed(2)}
x₂ = ${solutions[1].toFixed(2)}
x₃ = ${solutions[2].toFixed(2)}`,
  });

  return steps;
}

function inverseMatrix(matrix: number[][]): Step[] {
  const steps: Step[] = [];
  const n = matrix.length;

  steps.push({
    title: "Matriz Original",
    explanation:
      "Vamos calcular a matriz inversa usando o método de Gauss-Jordan. Criamos uma matriz aumentada [A|I].",
    matrix: matrix,
  });

  // Create augmented matrix [A|I]
  const augmented = matrix.map((row, i) => [
    ...row,
    ...Array(n)
      .fill(0)
      .map((_, j) => (i === j ? 1 : 0)),
  ]);

  steps.push({
    title: "Matriz Aumentada [A|I]",
    explanation: "Anexamos a matriz identidade à direita da matriz original.",
    matrix: augmented,
  });

  const currentMatrix = augmented.map((row) => [...row]);

  // Forward elimination
  for (let col = 0; col < n; col++) {
    const pivot = currentMatrix[col][col];

    if (Math.abs(pivot) < 0.0001) {
      steps.push({
        title: "Matriz Não Inversível",
        explanation: "A matriz não é inversível pois encontramos um pivô zero.",
      });
      return steps;
    }

    // Scale pivot row
    for (let j = 0; j < 2 * n; j++) {
      currentMatrix[col][j] /= pivot;
    }

    steps.push({
      title: `Normalização da Linha ${col + 1}`,
      explanation: `Dividimos a linha ${col + 1} por ${pivot.toFixed(2)} para tornar o pivô igual a 1.`,
      matrix: currentMatrix.map((row) => [...row]),
      highlight: { row: col },
    });

    // Eliminate column
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = currentMatrix[row][col];
      for (let j = 0; j < 2 * n; j++) {
        currentMatrix[row][j] -= factor * currentMatrix[col][j];
      }
    }

    steps.push({
      title: `Eliminação da Coluna ${col + 1}`,
      explanation: `Zeramos todos os elementos da coluna ${col + 1}, exceto o pivô.`,
      matrix: currentMatrix.map((row) => [...row]),
      highlight: { col: col },
    });
  }

  const inverse = currentMatrix.map((row) => row.slice(n));

  steps.push({
    title: "Matriz Inversa",
    explanation:
      "A parte direita da matriz aumentada agora contém a matriz inversa.",
    matrix: inverse,
  });

  return steps;
}
