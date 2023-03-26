# stripe-mvp-api

> MVP POC for stripe product, price, and subscription management

## Pre-Requisites

1. NodeJS 16.14.2
2. Docker/Dockercompose
3. Stripe Account

## Configuration

This project uses [node-config](https://github.com/lorenwest/node-config) for configuration management. Config files are located in the [`config`](./config) directory. You can add a `config/local.js` for local development overrides:

```js
module.exports = {
  stripe: {
    secretKey: 'sk_test_***',
    publishableKey: 'sk_test_***',
  },
};
```

## Local development

1. Follow steps to run [`cepwn/stripe-mvp-local-cluster`](https://github.com/cepwn/stripe-mvp-local-cluster)

2. Create `config/local.js` and add stripe secret key value.

3. Install dependencies:

   ```bash
   npm i
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open the swagger UI in your browser:

   ```bash
   open http://localhost:3003/api
   ```

## Entity Relationships

<img width="439" alt="image" src="https://user-images.githubusercontent.com/20140770/227782911-321624a9-9273-43fc-a435-ca9a8b65763c.png">

