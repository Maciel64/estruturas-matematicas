"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calculator, GitBranch, Sigma, FlipHorizontal } from "lucide-react";

interface OperationSelectorProps {
  onSelect: (operation: string) => void;
  matrixSize: number;
}

const operations = [
  {
    id: "determinant",
    name: "Determinante",
    description: "Calcular o determinante da matriz",
    icon: Sigma,
    available: (size: number) => size === 3,
  },
  {
    id: "rowReduction",
    name: "Escalonamento",
    description: "Reduzir a matriz à forma escalonada",
    icon: GitBranch,
    available: () => true,
  },
  {
    id: "cramer",
    name: "Regra de Cramer",
    description: "Resolver sistema linear usando Cramer",
    icon: Calculator,
    available: (size: number) => size === 3,
  },
  {
    id: "inverse",
    name: "Inversão",
    description: "Calcular a matriz inversa",
    icon: FlipHorizontal,
    available: (size: number) => size === 3,
  },
];

export function OperationSelector({
  onSelect,
  matrixSize,
}: OperationSelectorProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Escolha a Operação</CardTitle>
        <CardDescription>
          Selecione qual operação matemática deseja realizar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {operations.map((op, index) => {
            const Icon = op.icon;
            const isAvailable = op.available(matrixSize);

            return (
              <motion.div
                key={op.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto p-6 flex flex-col items-start gap-3 hover:border-primary hover:bg-accent disabled:opacity-50 bg-transparent"
                  onClick={() => onSelect(op.id)}
                  disabled={!isAvailable}
                >
                  <Icon className="w-6 h-6 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold text-lg">{op.name}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {op.description}
                    </div>
                    {!isAvailable && (
                      <div className="text-xs text-destructive mt-1">
                        Disponível apenas para matrizes 3×3
                      </div>
                    )}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
