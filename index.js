const express = require('express');
const app = express();
const request = require('request');
const wikip = require('wiki-infobox-parser');

// ejs
app.set("view engine", 'ejs');

// routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/index', (req, response) => {
    let url = "https://en.wikipedia.org/w/api.php"
    let params = {
        action: "opensearch",
        search: req.query.person,
        limit: "1",
        namespace: "0",
        format: "json"
    }

    url = url + "?"
    Object.keys(params).forEach((key) => {
        url += '&' + key + '=' + params[key]; 
    });

    // get wikip search string
    request(url, (err, res, body) => {
        if(err) {
            return response.redirect('/404'); // fixed slash
        }

        try {
            let result = JSON.parse(body);
            let x = result[3][0];
            x = x.substring(30, x.length); 

            // get wikip json
            wikip(x, (err, final) => {
                if (err) {
                    return response.redirect('/404');
                } else {
                    response.send(final);
                }
            });
        } catch(e) {
            return response.redirect('/404');
        }
    });
});

// Listen on Heroku port or 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening at port ${PORT}...`));
