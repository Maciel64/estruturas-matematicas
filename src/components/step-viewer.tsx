"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { MatrixDisplay } from "@/components/matrix-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSteps } from "@/lib/matrix-operations";

interface StepViewerProps {
  matrix: number[][];
  operation: string;
  onReset: () => void;
}

export function StepViewer({ matrix, operation, onReset }: StepViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = useMemo(() => {
    return generateSteps(matrix, operation);
  }, [matrix, operation]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Nova Matriz
        </Button>
        <div className="text-sm text-muted-foreground">
          Passo {currentStep + 1} de {steps.length}
        </div>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">{step.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="prose prose-sm max-w-none">
                <p className="text-base text-foreground leading-relaxed">
                  {step.explanation}
                </p>
              </div>

              {step.matrix && (
                <div className="flex justify-center">
                  <MatrixDisplay
                    matrix={step.matrix}
                    highlight={step.highlight}
                  />
                </div>
              )}

              {step.calculation && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
                      {step.calculation}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {step.result !== undefined && (
                <Card className="bg-primary/10 border-primary">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        Resultado
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {step.result}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Ir para passo ${index + 1}`}
                />
              ))}
            </div>
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
