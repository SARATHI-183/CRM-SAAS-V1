require('module-alias/register');

const { globSync } = require('glob');
const path = require('path');


require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });


const modelsFiles = globSync('./src/models/**/*.js');

for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

const app = require('./app');
app.set('port', process.env.PORT || 3000);

// Start Server
const server = app.listen(app.get('port'), () => {
 console.log(`Express running → On PORT : ${server.address().port}`);
});
