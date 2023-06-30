# Fact Checker Application

## Overview
Fact Checker is a web application powered by OpenAI and Google Fact Check Tools. The application verifies the authenticity of user input statements by comparing them with a database of fact-checked claims.

## Features

- User input validation
- Fetching and preprocessing of fact checks from Google Fact Check Tools
- Generation of a verdict based on the collected fact checks using OpenAI

## How it works

The user enters a statement into a text field and submits it. The app then makes a request to the Google Fact Check Tools API to retrieve fact checks related to the statement. The fact checks are then preprocessed to present the information in a readable format. The preprocessed fact checks are displayed and also sent to OpenAI to generate a verdict, which is then displayed to the user.

## Setup and Installation

1. Clone the repository.

```bash
git clone https://github.com/sheldor07/fact-checker-ai
```

2. Navigate to the project directory.

```bash
cd fact-checker
```

3. Install dependencies.

```bash
npm install
```

4. Create a `.env` file in the root directory of the project. Update it with your OpenAI API key and Google Fact Check Tools API key.

```bash
OPENAI_API_KEY=your_openai_api_key
GOOGLE_FACT_CHECK_TOOLS_KEY=your_google_fact_check_tools_key
```

5. Start the application.

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

This Fact Checker application is a simple yet powerful tool that leverages the power of OpenAI and Google Fact Check Tools to verify the authenticity of statements. It demonstrates how AI can be used to fight misinformation.