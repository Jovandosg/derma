# Arquivo de Configuração do IAM (Roles e Policies)

# IAM Role para a Instância EC2
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role"

  # Política de confiança que permite que o serviço EC2 assuma esta role
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-ec2-role"
  }
}

# Política IAM para permitir acesso ao Bedrock
resource "aws_iam_policy" "bedrock_policy" {
  name        = "${var.project_name}-bedrock-access-policy"
  description = "Permite invocar modelos do AWS Bedrock"

  # Defina as permissões necessárias para o Bedrock.
  # Exemplo mínimo: invocar modelos. Ajuste conforme os modelos específicos e ações necessárias.
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream" # Se for usar streaming
          # Adicione outras permissões do Bedrock se necessário (e.g., list models)
        ],
        Effect   = "Allow",
        Resource = "*" # Restrinja a modelos específicos se possível/necessário
      }
      # Adicione outras permissões se a aplicação precisar (ex: S3 para imagens, etc)
    ]
  })

  tags = {
    Name = "${var.project_name}-bedrock-policy"
  }
}

# Anexa a política do Bedrock à Role da EC2
resource "aws_iam_role_policy_attachment" "bedrock_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.bedrock_policy.arn
}

# Perfil de Instância IAM para associar a Role à EC2
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-instance-profile"
  role = aws_iam_role.ec2_role.name

  tags = {
    Name = "${var.project_name}-ec2-profile"
  }
}

# (Opcional, mas recomendado) Política para permitir que a EC2 use o Systems Manager Session Manager (SSM)
# Isso permite acesso seguro à instância sem precisar abrir a porta SSH para o mundo.
resource "aws_iam_policy" "ssm_policy" {
  name        = "${var.project_name}-ssm-access-policy"
  description = "Permite gerenciamento via SSM"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ssm:UpdateInstanceInformation",
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel"
        ],
        Resource = "*"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-ssm-policy"
  }
}

# Anexa a política do SSM à Role da EC2
resource "aws_iam_role_policy_attachment" "ssm_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.ssm_policy.arn
}

