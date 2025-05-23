# DermAI - Análise Dermatológica com IA

DermAI é uma aplicação web full-stack que permite aos usuários fazer upload de imagens de lesões de pele e receber uma análise que indica se a lesão é potencialmente maligna ou benigna, utilizando o Amazon Bedrock para processamento de imagens.

## Funcionalidades

- Upload de imagens (arrastar e soltar ou seleção de arquivo)
- Visualização da imagem carregada
- Análise de imagens dermatológicas
- Exibição de resultados (benigno/maligno com nível de confiança)
- Dashboard para visualizar análises anteriores
- Suporte a temas claro e escuro

## Tecnologias Utilizadas

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion para animações
- Prisma ORM para banco de dados
- Amazon Bedrock (simulado para demonstração)

## Configuração do Projeto

### Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL (ou outro banco de dados compatível com Prisma)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/dermai.git
cd dermai
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/dermai"
```

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev --name init
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse a aplicação em `http://localhost:3000`

## Estrutura do Projeto

```
dermai/
├── app/                  # Diretório principal da aplicação Next.js
│   ├── api/              # Rotas de API
│   ├── dashboard/        # Página do dashboard
│   ├── globals.css       # Estilos globais
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página inicial
├── components/           # Componentes React reutilizáveis
├── lib/                  # Utilitários e configurações
├── prisma/               # Configuração e schema do Prisma
└── public/               # Arquivos estáticos
```

## Uso em Produção

Para um ambiente de produção, você precisará:

1. Configurar corretamente as credenciais da AWS para o Amazon Bedrock
2. Implementar a integração real com o Amazon Bedrock no arquivo `app/api/analyze/route.ts`
3. Configurar um banco de dados PostgreSQL de produção
4. Configurar o domínio `derma.jovando.com.br` para apontar para sua instância EC2

## Licença

Este projeto está licenciado sob a licença MIT.