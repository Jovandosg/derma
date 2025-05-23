# Arquivo de Configuração do RDS (PostgreSQL)

# Subnet Group para o RDS (deve usar sub-redes privadas)
resource "aws_db_subnet_group" "rds" {
  name       = "${var.project_name}-rds-subnet-group"
  subnet_ids = aws_subnet.private[*].id # Coloca o RDS nas sub-redes privadas

  tags = {
    Name = "${var.project_name}-rds-subnet-group"
  }
}

# Instância RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier           = "${var.project_name}-db"
  allocated_storage    = var.db_allocated_storage
  storage_type         = "gp2" # Ou gp3, io1 dependendo da performance necessária
  engine               = "postgres"
  engine_version       = "15" # Use uma versão recente e suportada. Verifique a compatibilidade com Prisma/Next.js.
  instance_class       = var.db_instance_class
  db_name              = "derma_app_db" # Nome inicial do banco de dados
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres15" # Use o grupo de parâmetros padrão ou crie um customizado
  db_subnet_group_name = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # Configurações adicionais importantes:
  multi_az               = false # Defina como true para alta disponibilidade (custo maior)
  publicly_accessible    = false # Garante que o DB não seja acessível publicamente
  skip_final_snapshot    = true  # Defina como false em produção para ter um snapshot ao deletar
  backup_retention_period = 7     # Retenção de backups automáticos (em dias). 0 desabilita.
  # storage_encrypted      = true # Habilitar criptografia em repouso (recomendado)
  # kms_key_id             = aws_kms_key.rds.arn # Se usar chave KMS customizada

  # Manutenção e Backups
  # auto_minor_version_upgrade = true
  # backup_window              = "03:00-04:00" # Janela de backup preferida (UTC)
  # maintenance_window         = "sun:05:00-sun:06:00" # Janela de manutenção preferida (UTC)

  tags = {
    Name = "${var.project_name}-rds-instance"
  }
}

# (Opcional) Se precisar de configurações específicas de parâmetros, crie um Parameter Group
# resource "aws_db_parameter_group" "rds_params" {
#   name   = "${var.project_name}-rds-params"
#   family = "postgres15"
#
#   parameter {
#     name  = "log_connections"
#     value = "1"
#   }
#
#   tags = {
#     Name = "${var.project_name}-rds-params"
#   }
# }

# (Opcional) Se precisar de criptografia com chave KMS gerenciada pelo cliente
# resource "aws_kms_key" "rds" {
#   description             = "KMS key for RDS encryption"
#   deletion_window_in_days = 7
#   enable_key_rotation     = true
# }

