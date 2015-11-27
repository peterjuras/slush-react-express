var inquirer = require('inquirer');
function mockPrompt(answers) {
    inquirer.prompt = function (prompts, done) {
        [].concat(prompts).forEach(function (prompt) {
            if (!(prompt.name in answers)) {
                answers[prompt.name] = prompt.default;
            }
        });
        done(answers);
    };
}
exports.__esModule = true;
exports["default"] = mockPrompt;
;
