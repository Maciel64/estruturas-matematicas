"use client";

import { motion } from "framer-motion";
import { Grid3x3, Minus, Plus, Shuffle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MatrixInputProps {
  onSubmit: (matrix: number[][]) => void;
}

export function MatrixInput({ onSubmit }: MatrixInputProps) {
  const [size, setSize] = useState(3);
  const [matrix, setMatrix] = useState<string[][]>(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill("")),
  );

  const handleSizeChange = (newSize: number) => {
    if (newSize < 2 || newSize > 5) return;
    setSize(newSize);
    setMatrix(
      Array(newSize)
        .fill(null)
        .map(() => Array(newSize).fill("")),
    );
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
  };

  const handleRandomize = () => {
    const newMatrix = Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => (Math.floor(Math.random() * 20) - 10).toString()),
      );
    setMatrix(newMatrix);
  };

  const handleSubmit = () => {
    const numMatrix = matrix.map((row) =>
      row.map((cell) => Number.parseFloat(cell) || 0),
    );
    onSubmit(numMatrix);
  };

  const isValid = matrix.every((row) => row.every((cell) => cell !== ""));

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5" />
          Configure sua Matriz
        </CardTitle>
        <CardDescription>
          Escolha o tamanho e preencha os valores da matriz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Label>Tamanho da Matriz:</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSizeChange(size - 1)}
              disabled={size <= 2}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold w-16 text-center">
              {size} × {size}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSizeChange(size + 1)}
              disabled={size >= 5}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <motion.div
          key={size}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            }}
          >
            {matrix.map((row, i) =>
              row.map((cell, j) => (
                <Input
                  key={`${i}-${j}`}
                  type="number"
                  value={cell}
                  onChange={(e) => handleCellChange(i, j, e.target.value)}
                  className="w-16 h-16 text-center text-lg font-mono"
                  placeholder="0"
                />
              )),
            )}
          </div>
        </motion.div>

        <Button
          onClick={handleRandomize}
          variant="outline"
          className="w-full bg-transparent"
          size="lg"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Gerar Valores Aleatórios
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full"
          size="lg"
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  );
}
