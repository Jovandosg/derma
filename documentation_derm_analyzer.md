# Documentação: Aplicação de Análise Dermatológica com AWS Bedrock

## 1. Visão Geral da Solução

Esta documentação descreve uma aplicação web para análise de imagens dermatológicas utilizando a inteligência artificial do Amazon Bedrock. A aplicação permite que os usuários carreguem imagens de pele, que são então enviadas para um modelo de IA na AWS para análise. O resultado da análise (por exemplo, identificação de possíveis lesões, tumores, etc.) é exibido ao usuário.

**Tecnologias Utilizadas:**

*   **Frontend:** React (com Vite e Tailwind CSS), baseado no projeto fornecido pelo usuário.
*   **Backend:** AWS Lambda (Node.js - placeholder fornecido, a lógica de negócios precisa ser implementada) e Amazon API Gateway.
*   **Processamento de IA:** Amazon Bedrock (modelo sugerido: Anthropic Claude 3 Sonnet/Haiku com capacidade de visão).
*   **Armazenamento de Imagens:** Amazon S3.
*   **Infraestrutura como Código:** Terraform.
*   **Hospedagem Web:** Amazon S3 (para arquivos estáticos do frontend) e Amazon CloudFront (CDN).
*   **DNS e Certificado:** Amazon Route 53 e AWS Certificate Manager (ACM) para o domínio `cloudzen.com.br`.

## 2. Arquitetura da Aplicação

O fluxo da aplicação é o seguinte:

1.  **Usuário:** Acessa a aplicação web (React) hospedada no S3/CloudFront através do domínio `cloudzen.com.br`.
2.  **Upload da Imagem:** O usuário seleciona uma imagem dermatológica e a carrega através da interface.
    *   O frontend pode solicitar uma URL pré-assinada do S3 ao backend (API Gateway + Lambda) para fazer o upload seguro diretamente para um bucket S3.
    *   Alternativamente, a imagem pode ser enviada para a Lambda via API Gateway, que então a armazena no S3 (menos eficiente para arquivos grandes).
3.  **Solicitação de Análise:** Após o upload, o frontend envia uma solicitação de análise para o backend (API Gateway), passando a referência da imagem no S3.
4.  **Processamento Backend (Lambda):**
    *   A função Lambda recebe a solicitação.
    *   Recupera a imagem do S3 (se necessário, ou usa a referência/URL).
    *   Constrói um prompt adequado para o modelo multimodal do Amazon Bedrock.
    *   Envia a imagem (ou sua representação) e o prompt para o Amazon Bedrock.
5.  **Análise com Bedrock:** O modelo de IA do Bedrock processa a imagem e o prompt, retornando uma análise (ex: diagnóstico, confiança, recomendações).
6.  **Retorno do Resultado:** A função Lambda recebe a resposta do Bedrock, formata-a e a retorna para o API Gateway.
7.  **Exibição no Frontend:** O API Gateway envia o resultado para o frontend, que o exibe de forma clara para o usuário.

**Diagrama Simplificado da Arquitetura:**

```
[Usuário (Browser)] <--> [CloudFront (Frontend React)] <--> [S3 (Frontend Assets)]
        |                                ^
        | (HTTPS - cloudzen.com.br)      | (Route 53, ACM)
        v                                |
[API Gateway] <------------------------+
        |
        v
[AWS Lambda (Node.js)]
        |        ^
        |        | (Permissões IAM)
        v        |
[Amazon S3 (Imagens)]    [Amazon Bedrock (Modelo IA)]
```

## 3. Código Terraform

O código Terraform fornecido (`/home/ubuntu/terraform_code/`) provisiona toda a infraestrutura AWS necessária. Ele está organizado em módulos para melhor gerenciamento e reutilização.

**Módulos Principais:**

*   `vpc`: Cria a Virtual Private Cloud, sub-redes públicas e privadas, Internet Gateway e tabelas de rotas.
*   `s3`: Cria o bucket S3 para armazenamento das imagens carregadas pelos usuários e configura CORS e bloqueio de acesso público.
*   `iam`: Cria as roles e policies IAM necessárias, principalmente para a função Lambda (acesso ao S3, Bedrock e CloudWatch Logs).
*   `lambda`: Define a função Lambda (Node.js). Inclui um placeholder para o código da função (`image_analysis.zip`). **Você precisará substituir este ZIP pelo seu código Node.js real.**
*   `api_gateway`: Configura o API Gateway com um endpoint (ex: `/analyze`) que integra com a função Lambda. Inclui configuração CORS.
*   `route53`: Configura a zona hospedada no Route 53 para o domínio `cloudzen.com.br` e cria registros A para o CloudFront e, opcionalmente, para o API Gateway (se um domínio customizado for configurado para ele).
*   `acm`: Solicita e valida um certificado SSL/TLS do AWS Certificate Manager para o domínio `cloudzen.com.br` e `www.cloudzen.com.br` usando validação DNS via Route 53.
*   `frontend_hosting`: Configura um bucket S3 para hospedar os arquivos estáticos do frontend React e uma distribuição CloudFront para servir o conteúdo com HTTPS e CDN.

**Arquivos Principais no Diretório Terraform:**

*   `main.tf`: Arquivo raiz que chama todos os módulos.
*   `variables.tf`: Define as variáveis de entrada para a configuração (região AWS, nome do projeto, CIDR da VPC, nome do bucket S3, ID do modelo Bedrock, nome do domínio).
*   `modules/`: Diretório contendo os submódulos para cada serviço AWS.

**Como Implantar com Terraform:**

1.  **Pré-requisitos:**
    *   AWS CLI configurada com credenciais e região padrão.
    *   Terraform instalado.
    *   Seu domínio `cloudzen.com.br` registrado (não precisa estar na AWS ainda, mas você precisará atualizar os nameservers no seu registrador se o Terraform criar uma nova zona hospedada ou se você usar uma existente e os nameservers forem diferentes).
2.  **Preparar o Pacote Lambda:**
    *   Desenvolva sua função Lambda Node.js para análise de imagem com Bedrock.
    *   Crie um arquivo ZIP (ex: `image_analysis.zip`) contendo sua função Node.js e suas dependências (ex: `node_modules`).
    *   Coloque este arquivo ZIP no diretório `/home/ubuntu/terraform_code/lambda_package/` (ou atualize o caminho no `modules/lambda/main.tf`). O Terraform atualmente cria um ZIP de placeholder.
3.  **Inicializar o Terraform:**
    ```bash
    cd /home/ubuntu/terraform_code
    terraform init
    ```
4.  **Revisar e Aplicar:**
    *   Verifique o arquivo `variables.tf` e ajuste os valores padrão se necessário (especialmente `s3_image_bucket_name` para garantir unicidade global, e `bedrock_model_id` se desejar outro modelo).
    *   Planeje a implantação:
        ```bash
        terraform plan
        ```
    *   Aplique a configuração:
        ```bash
        terraform apply
        ```
    *   Confirme a aplicação digitando `yes` quando solicitado.
5.  **Configuração de DNS (se necessário):**
    *   Se o Terraform criou uma nova zona hospedada para `cloudzen.com.br`, a saída do `terraform apply` incluirá os `name_servers`. Você precisará atualizar os nameservers do seu domínio no seu registrador de domínios para apontar para esses nameservers da AWS.
    *   A propagação do DNS pode levar algum tempo.

## 4. Frontend (React)

O projeto React fornecido (`/home/ubuntu/project_files/project/`) serve como base para a interface do usuário.

**Principais Componentes:**

*   `ImageUploader.tsx`: Permite o upload de imagens.
*   `ImagePreview.tsx`: Exibe as imagens carregadas e botões para análise/remoção.
*   `AnalysisResults.tsx`: Mostra os resultados da análise.
*   `Dashboard.tsx`: Orquestra os componentes acima.
*   `utils/mockApi.ts`: Atualmente simula a chamada à API. **Isto precisará ser modificado para chamar o endpoint real do API Gateway.**

**Melhorias e Integração:**

1.  **Chamada à API Real:**
    *   Modifique `src/components/Dashboard.tsx` (ou crie um novo serviço de API) para fazer chamadas HTTP (ex: usando `fetch` ou `axios`) para o endpoint do API Gateway provisionado pelo Terraform (a URL de invocação será uma saída do `terraform apply`).
    *   O endpoint para análise será algo como `POST {api_gateway_invoke_url}/analyze`.
    *   O corpo da requisição deve conter a informação da imagem (ex: URL S3 da imagem carregada).
2.  **Upload para S3 (Recomendado: URL Pré-assinada):**
    *   Para uploads eficientes e seguros, implemente um endpoint Lambda adicional que gere URLs pré-assinadas do S3.
    *   O frontend solicitaria essa URL pré-assinada e usaria para fazer o `PUT` da imagem diretamente no S3.
    *   Após o upload bem-sucedido, o frontend chamaria o endpoint `/analyze` com a chave do objeto S3.
3.  **Construção e Implantação do Frontend:**
    *   Construa o projeto React para produção:
        ```bash
        cd /home/ubuntu/project_files/project
        npm install # ou pnpm install, se preferir usar o package-lock.json existente
        npm run build # ou pnpm build
        ```
    *   Os arquivos estáticos gerados (geralmente no diretório `dist/` ou `build/`) devem ser carregados para o bucket S3 de hospedagem do frontend criado pelo Terraform (o nome do bucket será uma saída do `terraform apply`).
        ```bash
        aws s3 sync ./dist s3://{nome-do-bucket-frontend-s3} --delete
        ```
    *   Após o upload, o CloudFront servirá esses arquivos.

## 5. Backend (AWS Lambda - Node.js)

O Terraform provisiona uma função Lambda (`${var.project_name}-image-analysis-lambda`) com um placeholder.

**Lógica a ser Implementada na Função Lambda (Node.js):**

1.  **Receber Requisição:** A função será acionada pelo API Gateway. O `event` conterá os dados da requisição (ex: URL da imagem no S3).
2.  **Interagir com S3 (se necessário):** Se a imagem precisar ser lida pela Lambda (por exemplo, para enviar bytes para o Bedrock), use o AWS SDK para Node.js para buscar o objeto do S3.
3.  **Construir Prompt para Bedrock:**
    *   Crie um prompt detalhado para o modelo multimodal. Exemplo (baseado no `mockApi.ts` e PDF):
        ```json
        {
          "anthropic_version": "bedrock-2023-05-31",
          "max_tokens": 1024,
          "messages": [
            {
              "role": "user",
              "content": [
                {
                  "type": "image",
                  "source": {
                    "type": "base64", // ou s3 URI se o modelo suportar diretamente
                    "media_type": "image/jpeg", // ou image/png
                    "data": "<base64_encoded_image_bytes>"
                  }
                },
                {
                  "type": "text",
                  "text": "Você é um especialista dermatológico. Analise esta imagem dermatológica. Identifique se há sinais de lesões cutâneas, tumores benignos, melanoma ou carcinoma. Forneça uma descrição simples dos achados, um risco estimado (ex: baixo, médio, alto) para cada condição suspeita, e recomendações gerais. Formate a resposta em JSON com os campos: 'diagnosis' (string), 'confidence' (float 0-1), 'description' (string), 'recommendations' (array of strings)."
                }
              ]
            }
          ]
        }
        ```
    *   **Modelo Sugerido:** `anthropic.claude-3-sonnet-20240229-v1:0` (ou Haiku para menor latência/custo, ou outro modelo multimodal adequado).
4.  **Chamar Bedrock:** Use o AWS SDK (`@aws-sdk/client-bedrock-runtime`) para invocar o modelo Bedrock com o prompt e a imagem.
    ```javascript
    import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
    const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
    // ... construir o payload (body) para o InvokeModelCommand ...
    const command = new InvokeModelCommand({
        modelId: process.env.BEDROCK_MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload) // payload conforme o formato esperado pelo modelo
    });
    const response = await client.send(command);
    const result = JSON.parse(Buffer.from(response.body).toString());
    // Processar result.completion ou a estrutura de resposta do modelo
    ```
5.  **Formatar e Retornar Resposta:** Processe a resposta do Bedrock e retorne um JSON para o API Gateway no formato esperado pelo frontend.

## 6. Demonstração para o Seminário

1.  **Preparação:**
    *   Implante toda a infraestrutura usando Terraform.
    *   Desenvolva e implante a função Lambda Node.js com a lógica de análise do Bedrock.
    *   Construa e implante o frontend React no S3.
    *   Certifique-se de que o DNS para `cloudzen.com.br` está apontando para a distribuição CloudFront.
    *   Tenha algumas imagens de teste prontas (lesões benignas, suspeitas, etc.).
2.  **Fluxo da Demonstração:**
    *   Apresente a aplicação acessando `https://cloudzen.com.br`.
    *   Explique brevemente a interface e o propósito.
    *   Faça o upload de uma imagem de teste.
    *   Clique para analisar a imagem.
    *   Mostre o resultado da análise (diagnóstico, confiança, recomendações) retornado pelo Bedrock.
    *   Enfatize que é uma ferramenta de auxílio e não substitui um diagnóstico médico profissional.
3.  **Pontos a Destacar:**
    *   Interface fácil de usar.
    *   Uso de IA (Amazon Bedrock) para análise inteligente.
    *   Arquitetura escalável e serverless na AWS.
    *   Segurança (HTTPS, upload seguro para S3).

## 7. Considerações Adicionais e Próximos Passos

*   **Segurança:** Implementar autenticação/autorização de usuários (ex: Amazon Cognito) se a aplicação não for apenas para demonstração pública.
*   **Tratamento de Erros:** Melhorar o tratamento de erros no frontend e backend.
*   **Validação de Uploads:** Validar tipos e tamanhos de arquivo no frontend e backend.
*   **Custo:** Monitore os custos dos serviços AWS, especialmente Bedrock, Lambda, S3 e CloudFront.
*   **Testes:** Implementar testes unitários e de integração.
*   **Lambda para URL Pré-assinada:** Como mencionado, criar uma Lambda específica para gerar URLs pré-assinadas para o S3 é uma boa prática para o upload de arquivos.

Este documento fornece um guia completo para implantar e demonstrar a aplicação. Lembre-se de adaptar o código da função Lambda e as chamadas da API no frontend conforme necessário.

