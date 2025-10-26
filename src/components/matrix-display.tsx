"use client";

import { motion } from "framer-motion";

interface MatrixDisplayProps {
  matrix: number[][];
  highlight?: { row?: number; col?: number };
}

export function MatrixDisplay({ matrix, highlight }: MatrixDisplayProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="text-4xl text-muted-foreground">[</div>
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${matrix[0].length}, minmax(0, 1fr))`,
        }}
      >
        {matrix.map((row, i) =>
          row.map((cell, j) => {
            const isHighlighted =
              (highlight?.row !== undefined && highlight.row === i) ||
              (highlight?.col !== undefined && highlight.col === j);

            return (
              <motion.div
                key={`${i}-${j}`}
                initial={{ scale: 1 }}
                animate={{
                  scale: isHighlighted ? 1.1 : 1,
                  backgroundColor: isHighlighted
                    ? "hsl(var(--accent))"
                    : "transparent",
                }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 flex items-center justify-center rounded-md border-2 border-border"
              >
                <span className="text-lg font-mono font-semibold">
                  {typeof cell === "number" ? cell.toFixed(2) : cell}
                </span>
              </motion.div>
            );
          }),
        )}
      </div>
      <div className="text-4xl text-muted-foreground">]</div>
    </div>
  );
}
