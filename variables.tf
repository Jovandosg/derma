# Arquivo de Variáveis Terraform para DermaApp AWS

variable "aws_region" {
  description = "Região AWS para criar os recursos."
  type        = string
  default     = "us-east-1" # Ou a região de sua preferência/onde está seu ACM/Zona Hospedada
}

variable "instance_type" {
  description = "Tipo da instância EC2 para a aplicação."
  type        = string
  default     = "t4g.medium"
}

variable "ec2_volume_size" {
  description = "Tamanho do volume EBS (em GiB) para a instância EC2."
  type        = number
  default     = 200
}

variable "db_username" {
  description = "Usuário master para o banco de dados RDS."
  type        = string
  default     = "dermaadmin"
}

variable "db_password" {
  description = "Senha para o usuário master do banco de dados RDS. Recomenda-se usar Secrets Manager em produção."
  type        = string
  sensitive   = true
  # Não defina um valor padrão aqui. O Terraform solicitará na execução.
  # Ou passe via -var="db_password=SUA_SENHA_SECRETA" ou arquivo tfvars.
}

variable "db_instance_class" {
  description = "Classe da instância RDS PostgreSQL."
  type        = string
  default     = "db.t3.micro" # Ajuste conforme necessidade de performance/custo
}

variable "db_allocated_storage" {
  description = "Espaço alocado para o banco de dados RDS (em GiB)."
  type        = number
  default     = 20
}

variable "hosted_zone_id" {
  description = "ID da Zona Hospedada no Route53 para 'jovando.com.br'."
  type        = string
  # Não defina um valor padrão. Obtenha no console AWS ou via AWS CLI.
  # Exemplo: aws route53 list-hosted-zones-by-name --dns-name jovando.com.br --query "HostedZones[0].Id" --output text | cut -d'/' -f3
}

variable "subdomain_name" {
  description = "Subdomínio para a aplicação."
  type        = string
  default     = "derma"
}

variable "domain_name" {
  description = "Nome do domínio principal."
  type        = string
  default     = "jovando.com.br"
}

variable "acm_certificate_arn" {
  description = "ARN do certificado SSL no AWS Certificate Manager (ACM) para '*.jovando.com.br' ou 'derma.jovando.com.br'. Deve estar na mesma região dos recursos."
  type        = string
  # Não defina um valor padrão. Obtenha no console do ACM.
}

variable "project_name" {
  description = "Nome base para identificar os recursos criados."
  type        = string
  default     = "derma-app"
}

variable "vpc_cidr" {
  description = "Bloco CIDR para a nova VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Lista de blocos CIDR para as sub-redes públicas."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"] # Exemplo para 2 AZs
}

variable "private_subnet_cidrs" {
  description = "Lista de blocos CIDR para as sub-redes privadas (para RDS e potencialmente EC2)."
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"] # Exemplo para 2 AZs
}

variable "availability_zones" {
  description = "Lista de Zonas de Disponibilidade a serem usadas na região selecionada."
  type        = list(string)
  default     = [] # Deixe vazio para usar as AZs padrão da região
}

