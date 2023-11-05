// @ts-check
const { withBlitz } = require("@blitzjs/next");
const { i18n } = require('./next-i18next.config');

/**
 * @type {import('@blitzjs/next').BlitzConfig}
 **/
const config = {}

module.exports = {...withBlitz(config), i18n}
