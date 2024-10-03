const axios = require('axios');

const getTasks = require('./lib/get-tasks.js');

const JIRA_BASE_URL = 'https://rampnetwork.atlassian.net';
const JIRA_API_URL = `${JIRA_BASE_URL}/rest/api/2`;
const JIRA_TOKEN_USER = 'michal.jasiorowski@ramp.network'

const jiraRequest = async ({ resource, method = 'GET', data = {} }) =>
  axios({
    method,
    url: resource,
    baseURL: JIRA_API_URL,
    headers: {
      Authorization: `Basic ${Buffer.from(`${JIRA_TOKEN_USER}:${process.env.JIRA_TOKEN}`)}`,
      'Content-Type': 'application/json',
    },
    data,
  }).catch(error => {
    console.error(`Error getting ${resource} - ${error}`)
  });

const getJiraIssueName = async (issueId) => {
  const resource = `/issue/${issueId}?fields=summary`

  const response = await jiraRequest({
    resource,
    method: 'GET',
  });
  return response?.data?.name ?? undefined
}

const parallelRequests = (tasks = [], req) => {
  if (tasks.length === 0) {
    return [];
  }

  return Promise.all(tasks.map(req));
};

const checkTasks = async () => {
  const source = [danger.github.pr.title, danger.github.pr.body].join(' ');
  const tasks = getTasks(source);
  const allTasks = await parallelRequests(tasks, async ({ taskId }) => {
    return {
      taskId: taskId,
      name: getJiraIssueName(taskId),
    }
  });

  const tasksWithName = allTasks.filter(({ name }) => name);
  if (tasksWithName.length === 0) {
    fail(
      '<b>Please add the Jira issue key to the PR e.g.: #DATA-98</b>\n' +
      '(remember to add hash)\n\n' +
      '<i>You can find issue key eg. in the last part of URL when issue is viewed in the browser eg.:\n' +
      `URL: ${JIRA_BASE_URL}/browse/DATA-98 -> issue key: DATA-98 -> what should be added to PR: #DATA-98\n\n` +
      'You can add more than one issue key in the PR title or/and description.</i>'
    );
    return;
  }

  message(
    'Jira issue(s) related to this PR:\n' +
    tasksWithName.map(
      ({ taskId, name }) =>
        `+ :link: <a href="${JIRA_BASE_URL}/browse/${taskId}">${name} [#${taskId}]</a>`
    ).join('\n')
  );
};

checkTasks();
