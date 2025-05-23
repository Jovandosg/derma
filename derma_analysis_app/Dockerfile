
# Imagem base Node.js com versão LTS
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Copiar arquivos de configuração de dependências
# Comentário: Copiamos primeiro os arquivos package.json e yarn.lock para aproveitar o cache de camadas do Docker
COPY package.json yarn.lock ./
COPY app/package.json ./app/

# Instalar dependências
# Comentário: Usamos --frozen-lockfile para garantir que as versões das dependências sejam exatamente as mesmas do ambiente de desenvolvimento
RUN yarn install --frozen-lockfile

# Copiar o restante dos arquivos do projeto
# Comentário: Copiamos todos os arquivos do projeto após a instalação das dependências para aproveitar o cache
COPY . .

# Gerar o Prisma Client
# Comentário: Necessário para interagir com o banco de dados
RUN npx prisma generate

# Construir a aplicação
# Comentário: Executa o script de build definido no package.json
RUN yarn build

# Remover dependências de desenvolvimento para reduzir o tamanho da imagem
# Comentário: Após o build, podemos remover as dependências de desenvolvimento
RUN yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile

# Expor a porta que a aplicação utilizará
# Comentário: A porta padrão do Next.js é 3000
EXPOSE 3000

# Comando para iniciar a aplicação
# Comentário: Executa o script de start definido no package.json
CMD ["yarn", "start"]
