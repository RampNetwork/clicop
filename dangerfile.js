const axios = require('axios');

const getTasks = require('./lib/get-tasks.js');

const parallelRequests = (tasks = [], req) => {
  if (tasks.length === 0) {
    return[];
  }

  return Promise.all(tasks.map(req));
};

const checkAndUpdateIssues = async () => {
  const source = [danger.github.pr.title, danger.github.pr.body].join(' ');
  const tasks = getTasks(source);
  const allTasks = await parallelRequests(tasks, async ({ taskId, isCustom }) => {
    return {
      taskId: taskId,
      isCustom: isCustom,
    }
   });

  const tasksWithName = allTasks.filter(({ name }) => name);
  if (tasksWithName.length === 0) {
    fail(
      '<b>Please add the ClickUp issue key to the PR e.g.: #28zfr1a or #DATAENG-98</b>\n' +
      '(remember to add hash)\n\n' +
      '<i>You can find ticket key eg. in the last part of URL when ticket is viewed in the browser eg.:\n' +
      'URL: https://app.clickup.com/t/28zfr1a -> ticket issue key: 28zfr1a -> what should be added to PR: #28zfr1a\n' +
      'URL: https://app.clickup.com/t/24301226/DATAENG-98 -> ticket issue key: DATAENG-98 -> what should be added to PR: #DATAENG-98\n\n' +
      'You can add more than one ticket issue key in the PR title or/and description.</i>'
    );
    return;
  }

  message(
    'ClickUp ticket(s) related to this PR:\n' +
    tasksWithName
      .map(
        ({ taskId, name }) =>
          `+ :link: <a href="https://app.clickup.com/t/${CLICKUP_TEAM_ID}/${taskId}">${name} [#${taskId}]</a>`
      )
      .join('\n')
  );
};

checkAndUpdateIssues();
