# Arquivo de Configuração dos Security Groups

# Security Group para o Application Load Balancer (ALB)
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg"
  description = "Allows HTTP and HTTPS traffic to the ALB" # Descrição alterada
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Permitir HTTP de qualquer lugar"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Permitir HTTPS de qualquer lugar"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # Permite todo o tráfego de saída
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-alb-sg"
  }
}

# Security Group para a Instância EC2
resource "aws_security_group" "ec2" {
  name        = "${var.project_name}-ec2-sg"
  description = "Allows SSH and app traffic from ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Allow SSH (restrict CIDR in production!)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # IMPORTANTE: Restrinja este IP ao seu IP ou rede!
  }

  ingress {
    description = "Allow app traffic"
    from_port   = 3000 # Porta padrão do Next.js dev, ajuste se necessário para produção
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Ajuste conforme sua necessidade de segurança
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # Permite todo o tráfego de saída
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
  }
}

# Security Group para a Instância RDS
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Allows PostgreSQL traffic from EC2"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow PostgreSQL from EC2"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id] # Permite acesso apenas da instância EC2
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}