// Core exports

// Factory functions
import {ConsoleLogger} from "../src/adapters/console-logger";
import { LogLevel } from "../src/types/level";

async function stripped() {

   const logger = new ConsoleLogger({
    level: LogLevel.DEBUG,
    context: "test",
    formatting: {
      colorize: true,
    },
  });

  logger.info('This is {test} info message', { test: '\x1B[1mThis is\x1B[34m blue and bold\x1B[0m' });
  // Test child logger

}

async function colorized() {

   const logger = createLogger(LoggerType.CONSOLE, {
    level: LogLevel.DEBUG,
    context: "Gateway Main",
    formatting: {
      colorize: true,
    },
  });


  logger.debug('This is a debug message');
  logger.info('This is an info message');
  logger.warn('This is a warning message');
  logger.error('This is an error message');


  logger.info('This is {test} info message', { test: 'TEST' });

  // Test child logger
  const childLogger = logger.child('ChildLogger');
  childLogger.info('This is a message from the child logger');
}

async function formatted() {

   const logger = createLogger(LoggerType.CONSOLE, {
    level: LogLevel.DEBUG,
    context: "test",
    formatting: {
      colorize: true,
    },
  });


  logger.info('This is {test} info message', { test: 'TEST' });

  // Test child logger
  const childLogger = logger.child('ChildLogger');
  childLogger.info('This is a message from the child logger');
}






//formatted();
stripped();