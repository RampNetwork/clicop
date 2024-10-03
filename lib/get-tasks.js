/**
 * Acceptable formats:
 * - #CORE-123
 */
const getTasks = (source) => {
  const taskRefRegex = /(?<=\s|^)#[A-Z]{2,10}-\d+/g;
  const refs = source.match(taskRefRegex) || [];
  const uniqueRefs = new Set(refs);

  let tasks = [];
  for (const ref of uniqueRefs) {
    tasks.push({
      taskId: ref.slice(1), // remove # from the beginning of the reference
    });
  }
  // sort tasks alphabetically
  tasks.sort(function(refA, refB) {
    if (refA.taskId < refB.taskId) return -1;
    if (refA.taskId > refB.taskId) return 1;
    return 0;
  });
  return tasks;
};

module.exports = getTasks;
