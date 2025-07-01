This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Deploy to server

We have dockerised the application and to deploy the application into server:

### Step 1: Build the application in local and push  to ECS.

```
aws ecr get-login-password --region us-east-1 --profile ask | docker login --username AWS --password-stdin 767398006661.dkr.ecr.us-east-1.amazonaws.com

docker build -t ask-medical .
```

### Step 2: 
# ask-test
