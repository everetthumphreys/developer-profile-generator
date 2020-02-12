const fs = require("fs");
const axios = require('axios');
const inquirer = require('inquirer');
const util = require("util");
const createPdf = require("./makepdf");
const { generateHTML } = require("./generateHTML");
const writeFileAsync = util.promisify(fs.writeFile);

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
            default:
                data.color = 0;
                break;
        }

        const userQueryUrl = `https://api.github.com/users/${username}`;
        axios
            .get(userQueryUrl)
            .then((userResponse) => {
                data.user = userResponse.data; 
                const reposQueryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
                axios
                    .get(reposQueryUrl)
                    .then((reposResponse) => {
                        let numberOfStars = 0;
                        for (let i = 0; i < reposResponse.data.length; i++) {
                            numberOfStars += reposResponse.data[i].stargazers_count;
                        }
                        data.stars = numberOfStars;
                        let resumeHTML = generateHTML(data);
                        return writeFileAsync("index.html", resumeHTML);
                    })
                    .then(() => {
                        return createPdf();
                    })
            });
    })
}
init();