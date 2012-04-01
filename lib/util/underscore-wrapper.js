//tiny wrapper module so that we can use underscore from CDN (better for caching)
module.exports = this._ || require('underscore');
