"use client";

import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { useState } from "react";
import { MatrixInput } from "@/components/matrix-input";
import { OperationSelector } from "@/components/operation-selector";
import { StepViewer } from "@/components/step-viewer";

export default function Home() {
  const [matrix, setMatrix] = useState<number[][] | null>(null);
  const [operation, setOperation] = useState<string>("");
  const [showSteps, setShowSteps] = useState(false);

  const handleMatrixSubmit = (matrixData: number[][]) => {
    setMatrix(matrixData);
    setShowSteps(false);
  };

  const handleOperationSelect = (op: string) => {
    setOperation(op);
    if (matrix) {
      setShowSteps(true);
    }
  };

  const handleReset = () => {
    setMatrix(null);
    setOperation("");
    setShowSteps(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-balance">
              Solucionador de Matrizes
            </h1>
          </div>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Resolva problemas de álgebra linear com explicações passo a passo
          </p>
        </motion.div>

        {!showSteps ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <MatrixInput onSubmit={handleMatrixSubmit} />

            {matrix && (
              <OperationSelector
                onSelect={handleOperationSelect}
                matrixSize={matrix.length}
              />
            )}
          </motion.div>
        ) : (
          <StepViewer
            matrix={matrix!}
            operation={operation}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
