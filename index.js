const fs = require("fs");
const axios = require('axios');
const inquirer = require('inquirer');
const convertFactory = require('electron-html-to');
const { generateHTML } = require("./generateHTML")

var conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
});

let data = {};

const questions = [
    {
      type: "input",
      name: "username",
      message: "What is your GitHub username?"
    },
    {
      type: "list",
      message: "What is your favorite color?",
      name: "color",
      choices: [
        "green", 
        "blue", 
        "pink", 
        "red"
      ]
    }
];


function init() {
    inquirer
    .prompt(questions)
    .then(function ({ username, color }) {
        const queryUrl = `https://api.github.com/users/${username}`;

        axios
            .get(queryUrl)
            .then((response) => {
                console.log(response.data)
                switch (color) {
                    case 'green':
                        data.color = 0;
                        break;
                    case 'blue':
                        data.color = 1;
                        break;
                    case 'pink':
                        data.color = 2;
                        break;
                    case 'red':
                        data.color = 3;
                        break;
                }

                axios
                    .get(`https://api.github.com/users/${username}/repos?per_page=100`)
                    .then((response) => {
                        data.stars = 0;
                        for (let i = 0; i < response.data.length; i++) {
                            data.stars += res.data[i].stargazers_count;
                        }
                        let resumeHTML = generateHTML(data);
                        conversion({ html: resumeHTML }, function (err, result) {
                            if (err) {
                                return console.error(err);
                            }
                            console.log(result.numberOfPages);
                            console.log(result.logs);
                            result.stream.pipe(fs.createWriteStream('github.pdf'));
                            conversion.kill();
                        })
                    })
            });
    })
}
init();