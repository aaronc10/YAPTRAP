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

## API endpoints

- **`POST /api/fact-claims?query={query}`**

  This endpoint accepts a query as a URL parameter and fetches fact checks related to the query. The response is a list of preprocessed fact checks.

- **`POST /api/generate-verdict`**

  This endpoint accepts a body with preprocessed fact claims and a query. It generates a verdict using OpenAI and returns the verdict in the response.

## Known issues

- There may be issues if a fact check does not have a certain property that is expected in the preprocessing stage. This is mitigated by providing default values for each property.

## Future Work

- Improve the user interface for a better user experience.
- Implement more detailed error handling.

## Conclusion

This Fact Checker application is a simple yet powerful tool that leverages the power of OpenAI and Google Fact Check Tools to verify the authenticity of statements. It demonstrates how AI can be used to fight misinformation.