"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { formatDate, getResultClass } from "@/lib/utils";
import { Calendar, Clock, AlertTriangle, CheckCircle, Search, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

interface AnalysisRecord {
  id: string;
  originalImage: string;
  result: string;
  confidence: number;
  createdAt: string;
}

export default function Dashboard() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "benign" | "malignant">("all");
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await fetch("/api/analyses");
        if (!response.ok) {
          throw new Error("Failed to fetch analyses");
        }
        const data = await response.json();
        setAnalyses(data);
      } catch (error) {
        console.error("Error fetching analyses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const filteredAnalyses = analyses
    .filter((analysis) => {
      if (filter === "all") return true;
      return filter === "benign" 
        ? analysis.result.toLowerCase() === "benign" 
        : analysis.result.toLowerCase() === "malignant";
    })
    .filter((analysis) => {
      if (!searchTerm) return true;
      return analysis.id.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard de Análises</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as análises dermatológicas realizadas
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "benign" | "malignant")}
            className="py-2 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos os resultados</option>
            <option value="benign">Apenas benignos</option>
            <option value="malignant">Apenas malignos</option>
          </select>
        </div>
      </motion.div>

      <div ref={ref}>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : analyses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="bg-muted rounded-lg p-8 text-center"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Nenhuma análise encontrada</h3>
              <p className="text-sm text-muted-foreground">
                Você ainda não realizou nenhuma análise dermatológica.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnalyses.map((analysis, index) => {
              const isBenign = analysis.result.toLowerCase() === "benign";
              const resultClass = getResultClass(analysis.result);
              
              return (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card overflow-hidden hover:shadow-lg"
                >
                  <div className="aspect-video relative">
                    <img
                      src={analysis.originalImage}
                      alt="Imagem da lesão"
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                      isBenign 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" 
                        : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                    }`}>
                      {isBenign ? "Benigno" : "Maligno"}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {isBenign ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <h3 className="font-medium">
                          {isBenign ? "Lesão Benigna" : "Lesão Maligna"}
                        </h3>
                      </div>
                      <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                        {Math.round(analysis.confidence * 100)}%
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span>
                          {formatDate(new Date(analysis.createdAt))}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        <span>ID: {analysis.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {!isLoading && analyses.length > 0 && filteredAnalyses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="bg-muted rounded-lg p-8 text-center"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Nenhum resultado encontrado</h3>
              <p className="text-sm text-muted-foreground">
                Tente ajustar seus filtros ou termos de busca.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}