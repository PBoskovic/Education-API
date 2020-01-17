const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const expressJwt = require('express-jwt');
const mongoose = require('mongoose');
const ErrorHandler = require('./middlewares/errorHandling/errorHandler');
const lusca = require('lusca');
const path = require('path');
const mongoDB = require('./config/database/mongodb/connection');
const environments = require('./config/environments');
const { name } = require('./package.json');
const mongoSanitize = require('express-mongo-sanitize');

const port = environments.PORT;
const appURL = `http://localhost:${port}/api/v1/`;
mongoose.Promise = global.Promise;

const app = express();

// Application Routes
const UserRoutes = require('./components/user/userRouter');
const SchoolRoutes = require('./components/school/schoolRouter');
const AuthRoutes = require('./components/authentication/authRouter');

app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(mongoSanitize());

app.disable('x-powered-by');

// Security
app.use(lusca.xframe('ALLOWALL'));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use(expressJwt({ secret: environments.JWT_SECRET })
  .unless({
    path: [
      '/api/v1/user/register',
      '/api/v1/admin/register',
      '/api/v1/signin',
      '/api/v1/reset-token',
      { url: '/api/v1/school', methods: ['GET'] },
      /\/api\/v1\/reset-password\/\w*/,
      /\/apidoc.+/,
    ],
  }));

// Creating the database connection
mongoose.connect(mongoDB.connectionString(), {
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  reconnectInterval: 500,
  connectTimeoutMS: 10000
}).then(() => {
  console.log(`MONGODB is connected`)
}).catch((err) => {
  console.log(err);
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${mongoDB.connectionString()}`);
});

// CONNECTION EVENTS
// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// When the connection is open
mongoose.connection.on('open', () => {
  console.log('Mongoose default connection is open');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

app.use('/api/v1/', UserRoutes);
app.use('/api/v1/', SchoolRoutes);
app.use('/api/v1/', AuthRoutes);

if (environments.NODE_ENV === 'development') {
  require('./scripts/createDocs');
  app.use('/apidoc', express.static(path.join(__dirname, './doc')));
}

app.use(ErrorHandler());

// show env vars
console.log(`__________ ${name} __________`);
console.log(`Starting on port: ${port}`);
console.log(`Env: ${environments.NODE_ENV}`);
console.log(`App url: ${appURL}`);
console.log('______________________________');

app.listen(port);
module.exports = app;
