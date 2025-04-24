const http = require('http');

const checkEndpoint = (path) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

const main = async () => {
  console.log('Testing server connectivity...');
  
  try {
    console.log('Testing root endpoint...');
    const rootResult = await checkEndpoint('/');
    console.log(`Root status: ${rootResult.statusCode}`);
    console.log(`Root data: ${rootResult.data}`);
  } catch (error) {
    console.error('Root endpoint error:', error.message);
  }
  
  try {
    console.log('\nTesting /api/test endpoint...');
    const testResult = await checkEndpoint('/api/test');
    console.log(`API test status: ${testResult.statusCode}`);
    console.log(`API test data: ${testResult.data}`);
  } catch (error) {
    console.error('API test endpoint error:', error.message);
  }
};

main();
