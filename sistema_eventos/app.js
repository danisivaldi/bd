// Load environment variables from .env file
if (process.env.NODE_ENV != 'production') {
  require('dotenv').load();
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Routers
var indexRouter = require('./routes/index');
var festasRouter = require('./routes/festas');
var clientesRouter = require('./routes/clientes');
var funcionariosRouter = require('./routes/funcionarios');

//------------------------------------------//

var app = express();

// view engine setup (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set Routers
app.use('/', indexRouter);
app.use('/festas', festasRouter);
app.use('/clientes', clientesRouter);
app.use('/funcionarios', funcionariosRouter);

// Alwayt put this middleware as the last one before error handler
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
