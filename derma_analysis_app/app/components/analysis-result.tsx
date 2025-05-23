"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, ArrowRight } from "lucide-react";
import { getConfidenceColor, getResultClass } from "@/lib/utils";

interface AnalysisResultProps {
  result: {
    result: string;
    confidence: number;
    additionalInfo?: any;
  } | null;
  isLoading: boolean;
}

export default function AnalysisResult({ result, isLoading }: AnalysisResultProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (result) {
      setShowDetails(false);
    }
  }, [result]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full p-6 bg-muted rounded-lg shadow-sm"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-lg font-medium">Analisando imagem...</p>
          <p className="text-sm text-muted-foreground">
            Isso pode levar alguns segundos
          </p>
        </div>
      </motion.div>
    );
  }

  if (!result) {
    return null;
  }

  const isBenign = result.result.toLowerCase() === "benign";
  const resultClass = getResultClass(result.result);
  const confidenceColor = getConfidenceColor(result.confidence);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`result-card ${resultClass}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          {isBenign ? (
            <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">
            {isBenign ? "Lesão Benigna" : "Lesão Potencialmente Maligna"}
          </h3>
          <p className="text-sm mb-3">
            Nossa análise indica que esta lesão é{" "}
            <span className="font-semibold">
              {isBenign ? "provavelmente benigna" : "potencialmente maligna"}
            </span>{" "}
            com uma confiança de{" "}
            <span className={`font-semibold ${confidenceColor}`}>
              {Math.round(result.confidence * 100)}%
            </span>
            .
          </p>

          <div className="mt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center text-sm font-medium text-secondary hover:text-secondary-dark transition-colors"
            >
              {showDetails ? "Ocultar detalhes" : "Ver detalhes"}
              <ArrowRight
                className={`ml-1 h-4 w-4 transition-transform ${
                  showDetails ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Informações importantes</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isBenign
                      ? "Embora nossa análise indique uma lesão benigna, recomendamos sempre consultar um dermatologista para uma avaliação profissional."
                      : "Esta análise indica possíveis sinais de malignidade. Recomendamos fortemente que consulte um dermatologista o mais rápido possível para uma avaliação profissional."}
                  </p>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800 text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-300">
                      Lembrete importante
                    </p>
                    <p className="mt-1 text-blue-700 dark:text-blue-400">
                      Esta análise é apenas uma ferramenta auxiliar e não substitui o diagnóstico médico profissional.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}