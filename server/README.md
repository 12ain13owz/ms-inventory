# Nodejs Express Typescript

## Install Dependencies

```
npm i
```

- create .env file

```
PORT=<PORT>
```

## Run

```
npm run dev
```

---

### Dev Dependencies

```
npm i -D @types/express @types/lodash @types/morgan @types/node pino-pretty tsx typescript
```

### Dependencies

```
npm i dayjs express lodash morgan pino
```

### Options

- generate keys `(Key Size: 2048 bit)`: https://travistidwell.com/jsencrypt/demo/

```
ACCESS_TOKEN_PRIVATE_KEY=<Private Key>
ACCESS_TOKEN_PUBLIC_KEY=<Public Key>

REFRESH_PRIVATE_KEY=<Refresh Private Key>
REFRESH_PUBLIC_KEY=<Refresh Public Key>
```
