module.exports = {
    HTML:function(func, type, data) {
        // func : chaincode name
        // type : true : submit tx, false : evaluate tx
        // data : data from get/post
        return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Fabric Biodoc Test</title>
            </head>
            <body>
                <h1>${func}</h1>
                <div id=${func}>
                    ${data}
                </div>
            </body>
        </html>
        `;
    }
}