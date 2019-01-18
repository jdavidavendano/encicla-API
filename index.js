'use strict'; 

const http = require('http'),
    enciclaURLAPI = 'http://www.encicla.gov.co/estado/';

http.get(enciclaURLAPI, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^text\/html/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected text/html but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }
  
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      //console.log(parsedData);
      console.log(`${'Station'.padEnd(25, ' ')} ${"\t"} Bikes`);
      console.log(`${''.padEnd(40, '-')}`);
      
      parsedData['stations'].forEach(zone => {
          zone['items'].forEach(station => {
              console.log(`${station['name'].padEnd(25, ' ')} ${"\t"} ${station['bikes']}`);
          });
      });

    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
