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
        
        let resp = await gotenberg.html2pdf("http://{{gotenberg_IP}}:{{PORT}}", html, "index.pdf", {});  // change the {{}} vars to suit your gotenberg location 
        
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
