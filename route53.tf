# Arquivo de Configuração do Route53

# Criação do registro A no Route53 para apontar o subdomínio para a instância EC2
resource "aws_route53_record" "app" {
  zone_id = var.hosted_zone_id # ID da zona hospedada para jovando.com.br (fornecido pelo usuário)
  name    = "${var.subdomain_name}.${var.domain_name}" # Ex: derma.jovando.com.br
  type    = "A"
  ttl     = 300

  records = [aws_instance.app_server.public_ip] # IP público da instância EC2
}