# Arquivo de Configuração da Instância EC2

# Data source para obter a AMI mais recente do Ubuntu 22.04 LTS para ARM64
data "aws_ami" "ubuntu_arm64" {
  most_recent = true
  owners      = ["099720109477"] # Canonical's AWS account ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-arm64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "architecture"
    values = ["arm64"]
  }
}

# Script User Data para configuração inicial da instância
# Instala Node.js (v20.x), Git, PM2 e atualiza o sistema.
data "template_file" "user_data" {
  template = <<-EOF
#!/bin/bash
apt-get update -y
apt-get upgrade -y

# Instalar Git
apt-get install -y git

# Instalar Node.js v20.x (usando NodeSource)
apt-get install -y ca-certificates curl gnupg
mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
apt-get update -y
apt-get install nodejs -y

# Instalar PM2 globalmente
npm install pm2 -g

# (Opcional) Instalar AWS CLI v2 (pode ser útil)
apt-get install -y unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm awscliv2.zip
rm -rf aws

echo "User data script finalizado."
  EOF
}

# Criação da Instância EC2
resource "aws_instance" "app_server" {
  ami           = data.aws_ami.ubuntu_arm64.id
  instance_type = var.instance_type
  # Coloca a instância na primeira sub-rede pública. Considere sub-rede privada para maior segurança.
  subnet_id     = aws_subnet.public[0].id
  # Associa o Security Group da EC2
  vpc_security_group_ids = [aws_security_group.ec2.id]
  # Associa o Perfil de Instância IAM com permissões (Bedrock, SSM)
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  # Configuração do Volume Raiz (EBS)
  root_block_device {
    volume_size = var.ec2_volume_size # 200 GiB conforme solicitado
    volume_type = "gp3"             # gp3 geralmente oferece melhor performance/custo que gp2
    delete_on_termination = true      # Deleta o volume ao terminar a instância
  }

  # Script de User Data para configuração inicial
  user_data = data.template_file.user_data.rendered

  # Habilita monitoramento detalhado (opcional, custo adicional)
  # monitoring = true

  tags = {
    Name = "${var.project_name}-app-instance"
  }

  # Garante que a rede e o perfil IAM existam antes de criar a instância
  depends_on = [
    aws_internet_gateway.gw, # Garante que a rota para a internet exista
    aws_iam_instance_profile.ec2_profile
  ]
}

