## What is this?

Hong Kong gym finder app built using Node.js

In `package.json` and under `"scripts"` at `line 8` are the commands to run the app.

For a fresh install run:
1. `npm run drop` To wipe database (if any)
2. `npm run sample` To load sample data
3. `npm start` To start app
* [optional] `npm run dev` To start app in development mode (testing)


## Sample Data
`npm run sample` To autopopulate the mongodb database with the following models:
* 16 Gym objects
* 3 Author ojbects
* 41 Review objects.

Logins for the users are as follows:

|Name|Email (login)|Password|
|---|---|---|
|Nate Welling|nate@natewelling.com|wes|
|Julio Lin|julio@juliolin.com|debbie|
|Jacob Chan|jacob@jacobchan.com|beau|


