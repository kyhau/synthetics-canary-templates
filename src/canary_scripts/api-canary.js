var synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

const targetUrl = process.env.TARGET_URL;

// Temp fix: Error: self signed certificate in certificate chain Stack
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';

const syntheticsConfiguration = synthetics.getConfiguration();


const apiCanaryBlueprint = async function () {

    syntheticsConfiguration.setConfig({
        restrictedHeaders: [], // Value of these headers will be redacted from logs and reports
        restrictedUrlParameters: [] // Values of these url parameters will be redacted from logs and reports
    });

    // Handle validation for positive scenario
    const validateSuccessful = async function(res) {
        return new Promise((resolve, reject) => {
            if (res.statusCode < 200 || res.statusCode > 299) {
                throw res.statusCode + ' ' + res.statusMessage;
            }

            let responseBody = '';
            res.on('data', (d) => {
                responseBody += d;
            });

            res.on('end', () => {
                // Add validation on 'responseBody' here if required.
                resolve();
            });
        });
    };

    // Set request option for Verify targetUrl
    let requestOptionsStep1 = {
        hostname: targetUrl,
        method: 'GET',
        path: '/',
        port: '443',
        protocol: 'https:',
        body: "",
        headers: {}
    };
    requestOptionsStep1['headers']['User-Agent'] = [synthetics.getCanaryUserAgentString(), requestOptionsStep1['headers']['User-Agent']].join(' ');

    // Set step config option for Verify targetUrl
  let stepConfig1 = {
        includeRequestHeaders: true,
        includeResponseHeaders: true,
        includeRequestBody: true,
        includeResponseBody: true,
        continueOnHttpStepFailure: true,
        logRequestBody: true,
        logResponseBody: true,
        logRequestHeaders: true,
        logResponseHeaders: true
    };

    await synthetics.executeHttpStep('Verify ' + targetUrl, requestOptionsStep1, validateSuccessful, stepConfig1);
};

exports.handler = async () => {
    return await apiCanaryBlueprint();
};
