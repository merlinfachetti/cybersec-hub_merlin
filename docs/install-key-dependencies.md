# Dependências de UI e Design System

npm install @radix-ui/react-slot
npm install class-variance-authority
npm install clsx tailwind-merge
npm install tailwindcss-animate
npm install lucide-react # Ícones

# Dependências de Formulários e Validação

npm install react-hook-form
npm install zod
npm install @hookform/resolvers

# Dependências de Banco de Dados
npm i @prisma/client
//Depois confira:
npm ls prisma @prisma/client

npm install @prisma/adapter-pg pg

# Dependências de Estado e Data Fetching

npm install @tanstack/react-query
npm install axios

# Dependências de Visualização de Dados (para roadmap e gráficos)

npm install reactflow
npm install recharts

# Dev Dependencies

npm install -D @types/node
npm install -D autoprefixer
npm install -D postcss
npm install -D tailwindcss
npm install -D ts-node
npm i -D prisma
npm i -D @types/pg

# Instale um runner para TypeScript (recomendado: tsx)
npm i -D tsx

PS: o comando prisma db seed não “adivinha” como executar seu arquivo seed.ts. Ele precisa que você diga explicitamente qual comando ele deve rodar (tsx, ts-node, bun, node, etc.). Como você não configurou isso, ele respondeu:
// “No seed command configured”

# Configurar Prettier
// Instalar Prettier
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

PS: Criar arquivo de configuração depois

# Criar arquivo de configuração

- Instalar Prisma CLI e Client
npm install -D prisma
npm install @prisma/client

PS - O Prisma 7.2.0 exige:
nvm install 20.19.0
nvm use 20.19.0
node -v

// Inicializar Prisma (cria pasta prisma/ e arquivo .env)
npx prisma init --datasource-provider postgresql

// Veja quais versões você tem instaladas
npm ls prisma @prisma/client
npx prisma -v

// Fixar Prisma CLI na mesma versão do client (7.2.0)
npm i -D prisma@7.2.0 --save-exact
npm i @prisma/client@7.2.0 --save-exact

# Instalar dependências para PostgreSQL
npm install pg

# Docker
docker info

// iniciar o container do PostgreSQL
docker-compose up -d

// verificar se está rodando
docker ps

// deve aparecer: cybersec-hub-db ... Up

// para desligar:
docker-compose down

# Prisma
- EXECUTAR MIGRATIONS E SEED:
1. Gerar o Prisma Client
npx prisma generate

2. Criar a primeira migration
npx prisma migrate dev --name init

//Você verá:
//✔ Generated Prisma Client
//✔ Applied migration(s): 20250117_init

3. Rodar o seed
npx prisma db seed

//Você verá:
//🌱 Starting seed...
//✅ Created providers
//✅ Created skills
//✅ Created Security+
//✅ Created CEH
//✅ Created OSCP
//✅ Created CISSP
//🌱 Seed completed successfully!

4. Abrir o Prisma Studio (GUI para ver os dados)
npx prisma studio

- Abre em: http://localhost:5555

# Limpeza padrão “tirar o encosto do node_modules”
rm -rf node_modules package-lock.json
npm install
