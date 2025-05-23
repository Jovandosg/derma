# Arquivo de Configuração do Provider Terraform

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0" # Use uma versão recente e compatível
    }
  }

  required_version = ">= 1.3" # Versão mínima do Terraform
}

provider "aws" {
  region = var.aws_region
}

