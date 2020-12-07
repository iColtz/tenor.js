const fetch = require('node-fetch');

const API = 'https://api.tenor.com/v1/';

class TenorClient {
  /**
   * Tenor Client.
   * @param {string} key - Tenor API key.
   */
  constructor(key) {
    this.key = key;
  }

  /**
   * Fetches data from tenor's public api.
   * @param {string} path - The path to fetch from.
   */
  async _fetch(path) {
    try {
      const data = await fetch(path);
      const body = await data.json();
      return body;
    }
    catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Builds the search path.
   * @param {string} - The search string.
   * @param {searchOptions} - The search options.
   */
  _buildSearchPath(query, options) {
    let defaultPath = `${API}search?key=${this.key}&q=${query}`;
    const params = Object.entries(options);
    params.forEach((param) => {
      if (param[1]) {
        defaultPath += `&${param[0]}=${param[1]}`;
      }
    });
    return defaultPath;
  }

  /**
   * Searchs tenor api for gifs.
   * @param {string} query - What to search for.
   * @param {searchOptions} - Options for the search.
   */
  search(query, {
    limit = 20,
    contentfilter = 'off',
    locale = 'en_US',
    media_filter = null,
    ar_range = 'all',
  } = {}) {
    const options = { limit, contentfilter, locale, media_filter, ar_range };
    const path = this._buildSearchPath(query, options);
    return this._fetch(path);
  }
}

module.exports = TenorClient;

/**
 * Tenor Client search options.
 * @typedef {Object} searchOptions
 * @property {number} [limit=20] - The limit of results to be fetched.
 * @property {string} [contentfilter='off'] - The content safety filter level. (Values: off | low | medium | high)
 * @property {string} [locale='en_US'] - Language to interpret search string
 * @property {string} [media_filter] - Reduce the number of GIF formats returned. (Values: basic | minimal)
 * @property {string} [ar_range='all'] - Filter the responce list to only include GIFs within certain aspect ratios. (Values: all | wide | standard)
*/