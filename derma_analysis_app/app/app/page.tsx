"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { Activity, Upload, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import AnalysisResult from "@/components/analysis-result";
import toast from "react-hot-toast";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [uploadRef, uploadInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setAnalysisResult(null);
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      toast.error("Por favor, selecione uma imagem para análise");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao analisar a imagem");
      }

      const result = await response.json();
      setAnalysisResult(result);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Ocorreu um erro ao analisar a imagem. Por favor, tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative h-[80vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/fig.01.jpg"
            alt="Análise dermatológica"
            fill
            priority
            className="object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6"
            >
              <Activity className="h-6 w-6 text-primary mr-2" />
              <span className="text-sm font-medium">Análise Dermatológica com IA</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Análise de lesões de pele com{" "}
              <span className="text-primary">inteligência artificial</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Faça o upload de uma imagem da sua lesão de pele e receba uma análise instantânea 
              que indica se a lesão é potencialmente benigna ou maligna.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="#upload">
                <button className="btn-primary inline-flex items-center">
                  Começar análise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-20 bg-muted"
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma utiliza modelos avançados de inteligência artificial para analisar imagens 
              dermatológicas e identificar potenciais problemas.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="h-8 w-8 text-primary" />,
                title: "Faça upload da imagem",
                description: "Carregue uma foto clara da lesão de pele que deseja analisar."
              },
              {
                icon: <Activity className="h-8 w-8 text-primary" />,
                title: "Processamento com IA",
                description: "Nossa IA analisa a imagem utilizando modelos treinados com milhares de casos."
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-primary" />,
                title: "Receba o resultado",
                description: "Obtenha uma análise indicando se a lesão é potencialmente benigna ou maligna."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="card p-6 hover:translate-y-[-5px]"
              >
                <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section 
        id="upload"
        ref={uploadRef}
        className="py-20"
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={uploadInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold mb-4">
                Analise sua imagem
              </h2>
              <p className="text-muted-foreground">
                Faça o upload de uma imagem clara da lesão de pele para análise
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={uploadInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <ImageUpload onImageSelected={handleImageSelected} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={uploadInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center"
            >
              <button 
                onClick={handleAnalyzeImage}
                disabled={!selectedImage || isAnalyzing}
                className={`btn-primary inline-flex items-center ${
                  !selectedImage || isAnalyzing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    Analisando...
                  </>
                ) : (
                  <>
                    Analisar imagem
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </motion.div>
            
            {/* Results Section */}
            <div id="results" className="mt-12">
              <AnalysisResult result={analysisResult} isLoading={isAnalyzing} />
            </div>
            
            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={uploadInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
            >
              <p className="text-sm text-center text-blue-700 dark:text-blue-400">
                <strong>Importante:</strong> Esta ferramenta é apenas um auxílio e não substitui a consulta com um profissional de saúde. 
                Sempre consulte um dermatologista para diagnósticos precisos.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}