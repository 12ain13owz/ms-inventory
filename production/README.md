# Project MS-Inventory

## Getting started

- Install Dependencies

cd production

```
npm install
```

- run scripts/init-database.bat
- config .env file

```
PORT="your_port"
NODE_ENV="your_node_env"
USER_MAIL="your_email"
PASS_MAIL="your_app_passwords"

RECAPTCHA_SITE_KEY="your_recaptcha_site_key"
RECAPTCHA_SECRET_KEY="your_recaptcha_secret_key"

ACCESS_TOKEN_PRIVATE_KEY="your_access_token_private_key"
ACCESS_TOKEN_PUBLIC_KEY="your_access_token_public_key"

REFRESH_TOKEN_PRIVATE_KEY="your_refresh_token_private_key"
REFRESH_TOKEN_PUBLIC_KEY="your_refresh_token_public_key"
```

### Star Server

```
server-start.bat
```

### Down Server

```
server-down.bat
```
