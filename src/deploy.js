var ghpages = require('gh-pages');
var path = require('path');
 
ghpages.publish(path.join(__dirname, '..', 'build'), function(err) {
  console.log('error deploying page: ', JSON.stringify(err));
});
