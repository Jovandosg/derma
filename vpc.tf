# Arquivo de Configuração da VPC e Rede

data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  # Seleciona as AZs a serem usadas. Usa as padrão se var.availability_zones estiver vazia,
  # caso contrário, usa as especificadas, limitado ao número de subnets definidas.
  azs = length(var.availability_zones) == 0 ? slice(data.aws_availability_zones.available.names, 0, max(length(var.public_subnet_cidrs), length(var.private_subnet_cidrs))) : slice(var.availability_zones, 0, max(length(var.public_subnet_cidrs), length(var.private_subnet_cidrs)))
}

# Criação da VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# Criação do Internet Gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Criação das Sub-redes Públicas
resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true # Instâncias lançadas aqui terão IP público

  tags = {
    Name = "${var.project_name}-public-subnet-${local.azs[count.index]}"
  }
}

# Criação das Sub-redes Privadas
resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = local.azs[count.index]

  tags = {
    Name = "${var.project_name}-private-subnet-${local.azs[count.index]}"
  }
}

# Elastic IP para o NAT Gateway
resource "aws_eip" "nat" {
  domain = "vpc"
  tags = {
    Name = "${var.project_name}-nat-eip"
  }
  # depends_on explícito para garantir que o IGW exista antes de tentar criar o EIP na VPC.
  depends_on = [aws_internet_gateway.gw]
}

# NAT Gateway (colocado na primeira sub-rede pública)
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "${var.project_name}-nat-gw"
  }

  # Garante que o IGW esteja anexado antes de criar o NAT GW
  depends_on = [aws_internet_gateway.gw]
}

# Tabela de Rotas Pública
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

# Associações da Tabela de Rotas Pública
resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Tabela de Rotas Privada
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "${var.project_name}-private-rt"
  }
}

# Associações da Tabela de Rotas Privada
resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

