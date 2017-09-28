export const logger = console;

export const loggerOn = {
    log: logger.log,
    info: logger.info,
    warn: logger.warn,
    on: true,
};
export const loggerOff = {
    log() { },
    info() { },
    warn() { },
    on: false,
};

export default logger;
