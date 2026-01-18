# Inštalácia projektu VAII

Pred spustením projektu je potrebné mať nainštalované:

- [Node.js a npm](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Bez týchto nástrojov projekt nepôjde spustiť.

---
## Postup inštalácie
### 1. Najprv treba naklonovať repozitár

```bash
git clone https://github.com/marek890/VAII.git
cd VAII
```

### 2. Presunieme sa do adresára client a naištalujeme závislosti
```bash
cd client
npm install
```

### 3. Pre adresár server musíme vykonať to isté
```bash
cd server
npm install
```

### 4. V adresári server vytvoríme .env súbor a vložíme údaje
```bash
POSTGRES_USER=admin
POSTGRES_PASSWORD=vajko123
POSTGRES_DB=vaii_db

DATABASE_URL="postgresql://admin:vajko123@localhost:5432/vaii_db?schema=public"

DB_NAME=vaii_db
DB_USER=admin
DB_PASSWORD=vajko123
DB_HOST=postgres
DB_PORT=5432
JWT_SECRET=5641045741
```

### 5. Otvoríme Docker Desktop a spustíme príkazy
```bash
cd VAII
docker compose build
docker compose up
```

### 6. Príprava databázy
```bash
cd server
npx prisma migrate dev
npx prisma db seed
```
