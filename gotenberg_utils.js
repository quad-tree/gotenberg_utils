var parseWebhookObject = function ( form, filename, webhook_obj ) {
    let webhook = form.getHeaders();

    if (webhook_obj && webhook_obj.hasOwnProperty("webhook_url")) {
        if (webhook_obj.hasOwnProperty("extra_headers")) {
            webhook['Gotenberg-Webhook-Extra-Http-Headers'] = JSON.stringify(webhook_obj.extra_headers);
        }
        webhook['Gotenberg-Output-Filename']= filename.replace(".fodt","");
        webhook['Gotenberg-Webhook-Url']= webhook_obj.webhook_url;
        webhook['Gotenberg-Webhook-Method']= 'PUT';
        webhook['Gotenberg-Webhook-Error-Url']= webhook_obj.error_url;
        webhook['Gotenberg-Webhook-Error-Method']= 'POST';
    }
    return webhook; 
}
/**
 * 
 * @param {*} gotenberg_url     Gotenberg service url & port
 * @param {*} fodt_string       valid FODT string xml content
 * @param {*} filename          MUST contain .fodt as file extension
 * @param {*} webhook_obj       { extra_headers(json), webhook_url, error_url}
 * @returns 
 * @see  https://gotenberg.dev/docs/modules/webhook
 */
var fodtString2pdf = async function ( gotenberg_url, fodt_string, filename, webhook_obj ) {
    const axios = require('axios');
    const FormData = require('form-data');
    const form = new FormData();
    form.append('files', fodt_string.toString(), filename);

    let webhook = parseWebhookObject(form, filename, webhook_obj);
    
    return axios.post(`${gotenberg_url}/forms/libreoffice/convert`, form, {
        headers: webhook,
        responseType: "arraybuffer"
    })    
}

/**
 * @param {*} gotenberg_url     Gotenberg service url & port
 * @param {*} html              valid html string
 * @param {*} webhook_obj       { extra_headers(json), webhook_url, error_url}
 * @returns 
 * @see https://gotenberg.dev/docs/modules/chromium
 */
var html2pdf = async function ( gotenberg_url, html, filename, webhook_obj ) {
    /* curl \
    --request POST 'http://localhost:3000/forms/chromium/convert/html' \
    --form 'files=@"/path/to/index.html"' \
    --form 'files=@"/path/to/style.css"' \
    --form 'files=@"/path/to/img.png"' \
    --form 'files=@"/path/to/font.woff"' \
    -o my.pdf
    */
   
    const axios = require('axios');
    const FormData = require('form-data');
    const form = new FormData();
    form.append('files', html, "index.html");
    let webhook = parseWebhookObject(form, filename, webhook_obj);

    try {
        return axios.post(`${gotenberg_url}/forms/chromium/convert/html`, form, {
            headers: webhook,
            responseType: "arraybuffer"
        })    
    } catch (error) {
        return error
    }

}

/**
 * @param {*} gotenberg_url     Gotenberg service url & port
 * @param {*} html              valid html string
 * @param {*} webhook_obj       { extra_headers(json), webhook_url, error_url}
 * @returns 
 * @see https://gotenberg.dev/docs/modules/chromium
 */
var markdown2pdf = async function ( gotenberg_url, md, filename, webhook_obj ) {

    const html = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>My PDF</title>
      </head>
      <body>
        {{ toHTML "file.md" }}
      </body>
    </html>`
    const axios = require('axios');
    const FormData = require('form-data');
    const form = new FormData();
    form.append('files', html, "index.html");
    form.append('files', md, "file.md");

    let webhook = parseWebhookObject(form, filename, webhook_obj);

    try {
        return axios.post(`${gotenberg_url}/forms/chromium/convert/markdown`, form, {
            headers: webhook,
            responseType: "arraybuffer"
        })    
    } catch (error) {
        return error
    }

}

/**
 * 
 * @param {*} gotenberg_url     Gotenberg service url & port
 * @param {*} url               valid public url
 * @param {*} filename 
 * @param {*} webhook_obj       { extra_headers(json), webhook_url, error_url}
 * @returns
 * @see https://gotenberg.dev/docs/modules/chromium 
 */
var url2pdf = async function ( gotenberg_url, url, filename, webhook_obj ) {
    /* curl \
    --request POST 'http://localhost:3000/forms/chromium/convert/html' \
    --form 'files=@"/path/to/index.html"' \
    --form 'files=@"/path/to/style.css"' \
    --form 'files=@"/path/to/img.png"' \
    --form 'files=@"/path/to/font.woff"' \
    -o my.pdf
    */
   
    const axios = require('axios');
    const FormData = require('form-data');
    const form = new FormData();
    form.append('url', url);
    let webhook = parseWebhookObject(form, filename, webhook_obj);

    try {
        return axios.post(`${gotenberg_url}/forms/chromium/convert/url`, form, {
            headers: webhook,
            responseType: "arraybuffer"
        })    
    } catch (error) {
        return error
    }

}

/**
 * 
 * @param {*} gotenberg_url 
 * @param {*} fodt_url 
 * @param {*} filename 
 * @param {*} webhook_obj       { extra_headers(json), webhook_url, error_url}
 * @returns 
 */
var fodtUrl2pdf = async function ( gotenberg_url, fodt_url, filename, webhook_obj ) {
    const file_utils = require("./fileurl_utils.js");
    var fodt = await file_utils.getFilefromURL(fodt_url);
    return fodtString2pdf( gotenberg_url, fodt.data.toString(), filename, webhook_obj )
}

module.exports = {
    fodtString2pdf,
    fodtUrl2pdf,
    html2pdf,
    markdown2pdf,
    url2pdf
}
