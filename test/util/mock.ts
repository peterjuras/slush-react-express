const inquirer = require('inquirer');

// export default function mockPrompt(answers: inquirer.Answers) {
export default function mockPrompt(answers: any) {
  inquirer.prompt = (prompts: Object) : Promise<any[]> => {

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
