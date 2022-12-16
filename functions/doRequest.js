const request = require('request');

const doRequest = (url, params, headers) => {
          return new Promise((resolve, reject) => {
                    request.post({
                              url,
                              form: JSON.stringify(params),
                              headers
                    }, (error, res, body) => {
                              resolve(body)
                    })
          })
}

module.exports = doRequest