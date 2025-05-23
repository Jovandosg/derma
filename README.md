<<<<<<< HEAD
# 🧠 DermoAnalyzer – Análise Dermatológica com IA via AWS Bedrock

Este projeto demonstra uma solução completa de análise de imagens dermatológicas com inteligência artificial usando a infraestrutura da AWS e o Amazon Bedrock. Desenvolvido para fins educacionais e demonstrativos em um seminário de Dermatologia.

---

## 🗂️ Visão Geral

A aplicação permite que usuários enviem imagens dermatológicas para análise automatizada baseada em IA, fornecendo respostas sobre possíveis lesões, tumores ou suspeita de câncer de pele.

---

## 📦 Estrutura do Projeto

```bash
dermo_analyzer_deliverables/
├── terraform_code/                  # Código Terraform completo para infraestrutura AWS
├── frontend_code/                  # Aplicação frontend (React ou HTML/JS puro)
├── documentation_derm_analyzer.md  # Guia completo de implantação e arquitetura
├── todo.md                         # Lista de tarefas do projeto
=======
# Documentação: Deploy DermaApp na AWS com Terraform

Este documento detalha o processo para provisionar a infraestrutura na AWS usando o código Terraform fornecido e como fazer o deploy da aplicação `derma_analysis_app`.

## 1. Pré-requisitos

Antes de começar, garanta que você possui:

*   **Conta AWS Ativa:** Com permissões suficientes para criar os recursos definidos (VPC, EC2, RDS, ALB, Route53, IAM, etc.).
*   **Terraform CLI:** Instalado em sua máquina local. Versão `>= 1.3` é recomendada. (Instruções: [https://developer.hashicorp.com/terraform/downloads](https://developer.hashicorp.com/terraform/downloads))
*   **AWS CLI:** Instalado e configurado com suas credenciais AWS. (Instruções: [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/))
    *   Execute `aws configure` para definir suas `AWS Access Key ID`, `AWS Secret Access Key`, `Default region name` (use a mesma região de `var.aws_region`) e `Default output format` (e.g., `json`).
*   **Certificado SSL/TLS no ACM:** Um certificado válido no AWS Certificate Manager (ACM) para o domínio `derma.jovando.com.br` ou um certificado wildcard (`*.jovando.com.br`). **Importante:** O certificado deve estar na **mesma região AWS** onde você criará os outros recursos (definida em `var.aws_region`).
*   **Zona Hospedada no Route53:** Uma Zona Hospedada pública no AWS Route53 para o domínio `jovando.com.br` já existente na sua conta AWS.
*   **Código Terraform:** Os arquivos `.tf` fornecidos neste diretório (`variables.tf`, `providers.tf`, `vpc.tf`, `security_groups.tf`, `iam.tf`, `rds.tf`, `ec2.tf`, `alb.tf`, `route53.tf`, `outputs.tf`).
*   **Código da Aplicação:** Acesso ao código-fonte da aplicação `derma_analysis_app` (provavelmente em um repositório Git).

## 2. Configuração das Variáveis Terraform

O Terraform utiliza variáveis para parametrizar a infraestrutura. As principais estão definidas em `variables.tf`. Você precisará fornecer valores para algumas delas antes de executar o Terraform. Crie um arquivo chamado `terraform.tfvars` neste mesmo diretório e adicione os valores necessários:

```terraform
# Exemplo de terraform.tfvars

aws_region            = "us-east-1"        # Confirme se esta é a região desejada e onde está seu ACM/Zona Hospedada
db_password           = "SUA_SENHA_SECRETA_PARA_O_BANCO" # Escolha uma senha forte!
hosted_zone_id        = "SEU_HOSTED_ZONE_ID" # Veja seção 3 para obter este valor
acm_certificate_arn   = "SEU_ACM_CERTIFICATE_ARN" # Veja seção 3 para obter este valor

# Você pode sobrescrever outras variáveis aqui se necessário, por exemplo:
# instance_type         = "t4g.large"
# db_instance_class     = "db.t3.small"
# availability_zones    = ["us-east-1a", "us-east-1b"]
```

**Explicação das Variáveis Chave a serem Fornecidas:**

*   `aws_region`: A região AWS onde todos os recursos serão criados. **Deve** ser a mesma região do seu certificado ACM e da Zona Hospedada.
*   `db_password`: Senha para o usuário master do banco de dados RDS PostgreSQL. **Use uma senha forte e considere usar o AWS Secrets Manager em produção.**
*   `hosted_zone_id`: O ID da Zona Hospedada pública no Route53 para `jovando.com.br`.
*   `acm_certificate_arn`: O ARN (Amazon Resource Name) do seu certificado SSL/TLS no ACM.

## 3. Obtendo o ID da Zona Hospedada e o ARN do Certificado ACM

Você pode obter esses valores pelo Console da AWS ou via AWS CLI:

*   **ID da Zona Hospedada (`hosted_zone_id`):**
    *   **Console AWS:** Navegue até o serviço Route53 -> Hosted zones -> Clique na zona `jovando.com.br`. O ID da Zona Hospedada estará visível (algo como `Z0123456789ABCDEFGHIJ`).
    *   **AWS CLI:**
        ```bash
        aws route53 list-hosted-zones-by-name --dns-name jovando.com.br --query "HostedZones[0].Id" --output text | cut -d'/' -f3
        ```
*   **ARN do Certificado ACM (`acm_certificate_arn`):**
    *   **Console AWS:** Navegue até o serviço Certificate Manager -> Certificados -> Localize o certificado para `derma.jovando.com.br` ou `*.jovando.com.br` (verifique se está na região correta!). Clique nele e copie o ARN.
    *   **AWS CLI (substitua a região se necessário):**
        ```bash
        aws acm list-certificates --region us-east-1 --query "CertificateSummaryList[?DomainName=='derma.jovando.com.br' || DomainName=='*.jovando.com.br'].CertificateArn" --output text
        ```
        (Se houver mais de um, selecione o correto).

## 4. Comandos Terraform

Navegue até o diretório onde os arquivos `.tf` estão localizados no seu terminal e execute os seguintes comandos:

1.  **Inicializar o Terraform:** Baixa os plugins necessários (definidos em `providers.tf`).
    ```bash
    terraform init
    ```
2.  **Planejar as Mudanças:** Mostra quais recursos o Terraform criará, modificará ou destruirá. Revise o plano cuidadosamente.
    ```bash
    terraform plan -var-file="terraform.tfvars"
    ```
3.  **Aplicar as Mudanças:** Cria a infraestrutura na AWS conforme o plano. Você precisará confirmar digitando `yes`.
    ```bash
    terraform apply -var-file="terraform.tfvars"
    ```
    Este processo pode levar vários minutos, especialmente para a criação do RDS.

Após a conclusão bem-sucedida, o Terraform exibirá os outputs definidos em `outputs.tf`, como o DNS do ALB, a URL da aplicação, o endpoint do RDS, etc. Guarde esses valores.

## 5. Acesso à Instância EC2

Existem duas formas principais de acessar a instância EC2 criada:

*   **SSH (Tradicional):** Você precisará de um par de chaves SSH. Se você não especificou um `key_name` no `ec2.tf` (o código atual não especifica), você não poderá usar SSH diretamente, a menos que tenha configurado o EC2 Instance Connect ou modificado o `user_data` para adicionar sua chave pública.
    *   **Recomendação:** Para maior segurança, evite expor a porta 22 diretamente para `0.0.0.0/0` como está no `security_groups.tf`. Restrinja o CIDR ao seu IP ou use o SSM.
*   **AWS Systems Manager (SSM) Session Manager (Recomendado):** O Terraform já configura a IAM Role da instância com as permissões necessárias para o SSM. Este método não requer a abertura da porta SSH no Security Group e é mais seguro.
    *   **Console AWS:** Navegue até EC2 -> Instâncias -> Selecione a instância `derma-app-instance` -> Clique em "Conectar" -> Escolha a aba "Session Manager" -> Clique em "Conectar".
    *   **AWS CLI (requer plugin Session Manager instalado):**
        ```bash
        aws ssm start-session --target SUA_INSTANCE_ID_AQUI --region SUA_REGIAO_AQUI
        ```
        (Obtenha o `SUA_INSTANCE_ID_AQUI` do output do Terraform ou do console EC2).

## 6. Deploy da Aplicação (`derma_analysis_app`)

Conecte-se à instância EC2 usando SSM ou SSH.

1.  **Clonar o Repositório:**
    ```bash
    cd /home/ubuntu # Ou outro diretório de sua preferência
    git clone SEU_REPOSITORIO_GIT_URL derma_analysis_app
    cd derma_analysis_app
    ```
2.  **Instalar Dependências:**
    ```bash
    npm install
    ```
3.  **Configurar Variáveis de Ambiente:** A aplicação Next.js/Prisma precisa saber como se conectar ao banco de dados e outras configurações. Crie um arquivo `.env.local` na raiz do projeto (`/home/ubuntu/derma_analysis_app`):
    ```dotenv
    # /home/ubuntu/derma_analysis_app/.env.local

    # Endpoint do RDS obtido do output do Terraform
    DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<RDS_ENDPOINT>:<RDS_PORT>/<DB_NAME>?schema=public"

    # Exemplo com valores (substitua pelos seus):
    # DATABASE_URL="postgresql://dermaadmin:SUA_SENHA_SECRETA_PARA_O_BANCO@derma-app-db.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com:5432/derma_app_db?schema=public"

    # Adicione outras variáveis de ambiente que sua aplicação possa precisar
    # Ex: Chaves de API, configurações do Bedrock (embora a autenticação seja via IAM Role)
    NEXT_PUBLIC_API_BASE_URL="/api" # Ou a URL completa se a API estiver separada
    # AWS_REGION="us-east-1" # Pode ser útil definir explicitamente
    ```
    **Importante:** Substitua `<DB_USER>`, `<DB_PASSWORD>`, `<RDS_ENDPOINT>`, `<RDS_PORT>` (geralmente 5432) e `<DB_NAME>` pelos valores corretos. O endpoint do RDS está no output do Terraform (`rds_endpoint`).

4.  **Executar Migrações do Prisma:** Aplica o schema do banco de dados.
    ```bash
    npx prisma migrate deploy
    ```
    (Pode ser necessário `npx prisma generate` antes, dependendo da configuração do seu build).

5.  **Build da Aplicação:**
    ```bash
    npm run build
    ```
6.  **Iniciar a Aplicação com PM2:** O PM2 manterá a aplicação rodando em background e a reiniciará em caso de falhas.
    ```bash
    pm2 start npm --name "derma-app" -- start # O comando 'start' geralmente executa 'next start' na porta 3000
    ```
7.  **Verificar Status:**
    ```bash
    pm2 list
    pm2 logs derma-app # Para ver os logs
    ```
8.  **(Opcional) Configurar PM2 para iniciar no boot:**
    ```bash
    pm2 startup # Siga as instruções exibidas
    pm2 save
    ```

## 7. Configuração do Banco de Dados

A configuração principal do banco de dados é feita através da variável de ambiente `DATABASE_URL` no arquivo `.env.local` da aplicação (passo 6.3). O Terraform já criou a instância RDS e o schema inicial foi aplicado com `prisma migrate deploy` (passo 6.4).

*   **Acesso:** O acesso ao banco de dados é permitido apenas a partir da instância EC2, conforme definido no `security_groups.tf`.
*   **Endpoint:** Use o valor do output `rds_endpoint` do Terraform para configurar a string de conexão.

## 8. Verificação Final

Após o deploy, acesse a URL da sua aplicação no navegador:

```
https://derma.jovando.com.br
```

(Use o valor do output `app_url` do Terraform).

A aplicação deve carregar e estar funcional. O tráfego passará pelo ALB, que direcionará para a instância EC2 na porta 3000 (ou a porta configurada no seu `npm start`). O HTTPS é gerenciado pelo ALB usando o certificado ACM que você forneceu.

## 9. Gerenciamento de Segredos (Recomendação)

A senha do banco de dados (`db_password`) está sendo passada como uma variável Terraform (via `terraform.tfvars` ou prompt). Para ambientes de produção, **é altamente recomendável usar o AWS Secrets Manager** para armazenar e gerenciar essa senha de forma segura.

**Passos Gerais para Usar Secrets Manager (Pós-Deploy Inicial):**

1.  **Criar um Segredo:** No Console AWS -> Secrets Manager, crie um novo segredo do tipo "Credentials for RDS database". Selecione a instância RDS criada e configure a rotação se desejar.
2.  **Atualizar Política IAM:** Modifique a `iam.tf` (ou crie uma nova política) para adicionar permissões à Role da EC2 (`aws_iam_role.ec2_role`) para ler o segredo específico do Secrets Manager (`secretsmanager:GetSecretValue`).
3.  **Atualizar Código da Aplicação:** Modifique sua aplicação (provavelmente no código que inicializa o Prisma ou lê as variáveis de ambiente) para buscar a senha do Secrets Manager usando o AWS SDK em vez de lê-la diretamente do `.env.local`.
4.  **Remover Senha do `.env.local`:** Após a aplicação conseguir buscar a senha do Secrets Manager, remova a `DATABASE_URL` completa ou a senha do arquivo `.env.local`.
5.  **Remover Variável `db_password` do Terraform (Opcional):** Se a senha não for mais necessária durante o `terraform apply` (porque a aplicação a busca dinamicamente), você pode remover a variável `db_password` ou parar de fornecê-la.

## 10. Destruindo a Infraestrutura

Quando não precisar mais da infraestrutura, você pode destruí-la usando o Terraform para evitar custos contínuos. **Atenção:** Isso removerá permanentemente todos os recursos criados (EC2, RDS, ALB, etc.) e os dados no banco de dados RDS (a menos que `skip_final_snapshot` seja `false`).

Navegue até o diretório Terraform e execute:

```bash
terraform destroy -var-file="terraform.tfvars"
```

Confirme digitando `yes` quando solicitado.

>>>>>>> 0aaf891 (Inicial commit do projeto terraform_derma_aws)
