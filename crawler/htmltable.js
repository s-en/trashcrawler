const tabletojson = require('tabletojson');

module.exports.get = async (url) => {
  return new Promise(async (ok, ng) => {
    try {
      tabletojson.convertUrl(
        url,
        { useFirstRowForHeadings: true },
        function(tablesAsJson) {
          ok(tablesAsJson);
        }
      );
    } catch (error) {
      ng(error);
    }
  })
};