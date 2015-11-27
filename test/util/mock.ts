import inquirer = require('inquirer');

export default function mockPrompt(answers : inquirer.Answers) {
  inquirer.prompt = (prompts, done) : any => {

    [].concat(prompts).forEach(prompt => {
      if (!(prompt.name in answers)) {
        answers[prompt.name] = prompt.default;
      }
    });

    done(answers);
  };
};
