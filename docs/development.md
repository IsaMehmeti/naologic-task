# Setup and development

- [Setup and development](#setup-and-development)
  - [First-time setup](#first-time-setup)
  - [Installation](#installation)
    - [Database](#database)
    - [Configuration](#configuration)
  - [Start App](#start-app)

## First-time setup

Make sure you have the following installed:

- [Node](https://nodejs.org/en/)
- [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

## Installation

```bash
# Install dependencies from package.json
npm install
```

### Database

Setup MongoDb, no need to create a database or collection, just provide database name to automatically create

### Configuration

Before start create fill correct configurations for `.env` file

```env
OPENAI_API_KEY=<Your OeanAI API Key>
MONGODB_URL=<Your Mongo database URL>
MONGODB_DATABASE=<Your Mongo database name>
PRODUCTS_CSV_FILE_URL=<optional: url that downloads csv file>
PERFORM_DELETION=<optional: true to perform deletion, anything else doesn't>

```
## Start App

```bash
npm run start
```

