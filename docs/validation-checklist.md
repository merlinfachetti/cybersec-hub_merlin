# 1. Verificar se o PostgreSQL está rodando
docker ps
//Deve mostrar: cybersec-hub-db ... Up

# 2. Verificar se as migrations foram aplicadas
npx prisma migrate status
//Deve mostrar: Database schema is up to date!

# 3. Verificar dados no Prisma Studio
npx prisma studio
//Abra e verifique as tabelas: certifications, providers, skills, etc.

# 4. Testar endpoint da API
npm run dev

- Em outro terminal:
curl http://localhost:3000/api/certifications
//Deve retornar JSON com 4 certificações

# 5. Testar endpoint de detalhes (pegue um ID do Prisma Studio)
curl http://localhost:3000/api/certifications/[ID_AQUI]
//Deve retornar JSON com todos os detalhes

# 6. Testar filtros
curl "http://localhost:3000/api/certifications?level=entry"
//Deve retornar apenas Security+

curl "http://localhost:3000/api/certifications?category=offensive_security"
//Deve retornar CEH e OSCP

curl "http://localhost:3000/api/certifications?search=ethical"
//Deve retornar CEH
