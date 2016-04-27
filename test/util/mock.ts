import inquirer = require('inquirer');

export default function mockPrompt(answers: inquirer.Answers) {
  inquirer.prompt = (prompts: Object) : Promise<inquirer.Answers> => {
    [].concat(prompts).forEach(prompt => {
      if (!(prompt.name in answers)) {
        answers[prompt.name] = prompt.default;
      }
    });

    return new Promise((resolve, reject) => {
      resolve(answers);
    });
  };
};
