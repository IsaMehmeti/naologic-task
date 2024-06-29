# Setup and development

- [Setup and development](#setup-and-development)
  - [First-time setup](#first-time-setup)
  - [Installation](#installation)
    - [Database](#database)
    - [Configuration](#configuration)

## First-time setup

Make sure you have the following installed:

- [Node](https://nodejs.org/en/)
- [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) (at least 1.0)

## Installation

```bash
# Install dependencies from package.json
npm install
```

### Database

> Note: Awesome NestJS Boilerplate uses [TypeORM](https://github.com/typeorm/typeorm) with Data Mapper pattern.

### Configuration

Before start install PostgreSQL and fill correct configurations in `.env` file

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nest_boilerplate
```
