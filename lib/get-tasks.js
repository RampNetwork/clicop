/**
 * Acceptable formats:
 * - #CORE-123
 */
const getTasks = (source) => {
  const taskRefRegex = /(?<=\s|^)#[A-Z]{2,10}-\d+/g;
  const refs = source.match(taskRefRegex) || [];

  let tasks = [];
  for (const ref of refs) {
    tasks.push({
      taskId: ref.slice(1), // remove # from the beginning of the reference
    });
  }
  return tasks;
};

module.exports = getTasks;
