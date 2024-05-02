# Project MS-Stock-IT

## Getting started

- Install Dependencies

cd <project_name>\server

```
npm install
```

- run init-database.bat
- config .env file

```
PORT="3000"
NODE_ENV="development"
USER_MAIL="your_email@gmail.com"
PASS_MAIL="your_app_passwords"

RECAPTCHA_SITE_KEY="your_recaptcha_site_key"
RECAPTCHA_SECRET_KEY="your_recaptcha_secret_key"

ACCESS_TOKEN_PRIVATE_KEY="your_access_token_private_key"
ACCESS_TOKEN_PUBLIC_KEY="your_access_token_public_key"

REFRESH_TOKEN_PRIVATE_KEY="your_refresh_token_private_key"
REFRESH_TOKEN_PUBLIC_KEY="your_refresh_token_public_key"
```

## Run Application

```
npm run dev
```

---

### Version NodeJS v20.10.0

### Dev Dependencies Overview

```
npm i -D @types/bcrypt @types/config @types/cookie-parser @types/express @types/jsonwebtoken @types/lodash @types/morgan @types/multer @types/node @types/nodemailer @types/uuid pino-pretty ts-node tsx typescript
```

### Dependencies Overview

```
npm i bcrypt config cookie-parser cors dayjs dotenv express jimp jsonwebtoken lodash morgan multer nodemailer pino pm2 sequelize sqlite3 uuid zod
```

- generate keys rsa `(Key Size: 2048 bit)`: https://travistidwell.com/jsencrypt/demo/

### Link

https://ms-stock-it.web.app/
