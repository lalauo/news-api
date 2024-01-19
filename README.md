# Northcoders News API - PSQL database & node-postgres interface

Backend api that interacts with a news database. Users, articles, topics and comments are available to browse, search and update via a range of methods and endpoints. Explore [here:] (https://news-api-9mot.onrender.com)

# Setup

[Clone] (https://github.com/lalauo/news-api.git)

This project was built on [Visual Studio Code] (https://code.visualstudio.com/download)
Using:

- [Node.js] (https://nodejs.org/en/download)
- [Express] (https://expressjs.com/en/starter/installing.html)
- [PSQL] (https://www.postgresql.org/download/)
- [Node-postgres] (https://node-postgres.com/)

## Environment

- Add .env.test and .env.development files and connect to databases
- Database info located in setup.sql file
- .gitignore these files before pushing to GitHub
- Install dependencies: `npm install`

## Run Project

Locally:
-Seed local database: `npm run seed`
-Run test: `npm run test`
(all scripts available in package.json)

[Hosted version] (https://news-api-9mot.onrender.com):
- All available endpoints outlined in endpoints.json file
