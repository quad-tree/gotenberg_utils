var gotenberg = require('../gotenberg_utils');

var url = "https://path/to/file";

let html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My PDF</title>
  </head>
  <body>
    <h1>Hello world!</h1>
  </body>
</html>`;

let md = `
    ## header 2
    # header 1

    **strong**
`


async function main() {
    try {
        
        let resp = await gotenberg.html2pdf("http://135.181.158.56:8005", html, "index.pdf", {});
        
        const fs = require('fs')
        fs.writeFile("html_file.pdf", resp.data, (err) => {
            if (err)
              console.log(err);
            else {
              console.log("File written successfully\n");
            }
          });

    } catch (error) {
         console.log(error);
    }
}

main()
