# Project MS-Stock-IT

## Setup Application

- Install Dependencies

```
npm i
```

- run init-database.bat
- config .env file

```
PORT=<PORT>
NODE_ENV="development"

ACCESS_TOKEN_PRIVATE_KEY=<Private Key>
ACCESS_TOKEN_PUBLIC_KEY=<Public Key>

REFRESH_PRIVATE_KEY=<Refresh Private Key>
REFRESH_PUBLIC_KEY=<Refresh Public Key>
```

## Run Application

```
npm run dev
```

---

### Dev Dependencies Overview

```
npm i -D @types/bcrypt @types/config @types/cookie-parser @types/express @types/jsonwebtoken @types/lodash @types/morgan @types/multer @types/node @types/uuid pino-pretty ts-node tsx typescript
```

### Dependencies Overview

```
npm i bcrypt config cookie-parser cors dayjs dotenv express jimp jsonwebtoken lodash morgan multer pino sequelize sqlite3 uuid zod
```

- generate keys rsa `(Key Size: 2048 bit)`: https://travistidwell.com/jsencrypt/demo/
