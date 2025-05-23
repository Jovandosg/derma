# Arquivo de Outputs Terraform

output "app_url" {
  description = "URL final da aplicação."
  value       = "https://${aws_route53_record.app.fqdn}"
}

output "ec2_public_ip" {
  description = "IP público da instância EC2 (se aplicável - está em subnet pública)."
  value       = aws_instance.app_server.public_ip
}

output "ec2_instance_id" {
  description = "ID da instância EC2."
  value       = aws_instance.app_server.id
}

output "rds_endpoint" {
  description = "Endpoint do banco de dados RDS PostgreSQL."
  value       = aws_db_instance.postgres.endpoint
}

output "rds_db_name" {
  description = "Nome do banco de dados inicial criado no RDS."
  value       = aws_db_instance.postgres.db_name
}

output "vpc_id" {
  description = "ID da VPC criada."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs das sub-redes públicas criadas."
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs das sub-redes privadas criadas."
  value       = aws_subnet.private[*].id
}

