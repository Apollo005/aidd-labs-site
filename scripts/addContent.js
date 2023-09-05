const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const yaml = require('yaml');


const CONTENT_DIRECTORY = path.resolve(__dirname, `../src/pages/content`);

const questions = [
  {
    type: 'input',
    name: 'title',
    message: 'Please enter the title of your content:'
  },
  {
    type: 'list',
    name: 'type',
    choices: [ 'blog', 'conference_paper', 'journal_article', 'presentation', 'podcast', 'software', 'report', 'visualization', 'video' ],
    message: 'Please select the type of your content:',
  },
  {
    type: 'checkbox',
    name: 'topics',
    choices: [
      {name: 'risk',},
      {name: 'impact',},
      {name: 'recovery',},
      {name: 'equity',},
    ],
    message: 'Please select the topic your content falls under (you may select 1 or more):',
    validate(answer) {
      if (answer.length < 1) {
        return 'You must choose at least one topic.';
      }

      return true;
    },
  },
  {
    type: 'checkbox',
    name: 'members',
    choices: [
      {name: 'risk',}, // possible to dynamically add these?
      {name: 'impact',},
      {name: 'recovery',},
      {name: 'equity',},
    ],
    message: 'Please select the team members who created this content:',
  }

];

const init = async () => {
  const typeMap = {
    'podcast': 'PD',
    'video': 'VD'
  }
  const result = await inquirer.prompt(questions);
  const { title, type, topics} = result;

  const date = new Date().toLocaleDateString('en-CA');
  const typeId = typeMap[type] || type[0];
  const dasherizedTitle = title.toLowerCase().split(' ').join('-');
  const NEW_CONTENT_DIRECTORY = `${CONTENT_DIRECTORY}/${typeId.toUpperCase()}${date}_${dasherizedTitle}`;

  fs.mkdirSync(NEW_CONTENT_DIRECTORY, { recursive: true });
  fs.writeFileSync(`${NEW_CONTENT_DIRECTORY}/index.md`, yaml.stringify(result));
}

init ();