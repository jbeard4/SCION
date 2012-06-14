(function() {

  module.exports.escapeEvent = function(e) {
    switch (e) {
      case '\\':
        return '\\\\';
      case "'":
        return "\\'";
      default:
        return e;
    }
  };

}).call(this);
