# Slackify Me App in NodeJS

A NodeJS app which turns our plain text messages into emojis

## Installation

Use the npm package manager to install node modules.

```bash
npm i # installs backend node modules
```

## Add configurations

Create `config` folder from project root directory, add a `default.json` configuration file

The configuration files should contain the following:

```bash
{
  "mongoURI": #Your MongoDB connection URI wrapped in double-quotes
  "jwtSecret": #Any string as your JSON web token secret
}
```

## Usage

In the project root directory, run this command:

```bash
npm run dev # app starts at http://localhost:5000/
npm run start # app starts at http://localhost:5000/
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
