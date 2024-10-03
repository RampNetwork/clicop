const getTasks = require('./get-tasks.js');

const correctSources = [
  [
    "This PR closes #BUNNY-1",
    [
      { taskId: "BUNNY-1" }
    ]
  ],
  [
    "This PR has duplicated reference #BUNNY-1 #BUNNY-1",
    [
      { taskId: "BUNNY-1" },
    ]
  ],
  [
    "This PR closes #CORE-123 and is related to #BUNNY-1",
    [
      { taskId: "BUNNY-1" },
      { taskId: "CORE-123" }
    ]
  ],
  [
    "This PR closes #BUNNY-1 and is related to #CORE-123",
    [
      { taskId: "BUNNY-1" },
      { taskId: "CORE-123" }
    ]
  ],
  [
    "This PR has a newline before ticket id\n#SRE-12345",
    [
      { taskId: "SRE-12345" },
    ]
  ]
];

const incorrectSources = [
  "This PR has too short custom ticket reference #C-123",
  "There is no # in this ticket reference CORE-123",
  "Ticket reference is blended with the text#BUNNY-1",
  "Ticket reference has doubled # sign ##BUNNY-1",
];

const emptySource = "A PR without ticket references";

describe('getTasks', () => {
  it.each(correctSources)('extracts ticket references', (source, expectedTaskObjects) => {
    expect(getTasks(source)).toEqual(expectedTaskObjects);
  });

  it.each(incorrectSources)('should return empty list when ticket references that do not match the format', (source) => {
    expect(getTasks(source)).toEqual([]);
  });

  it('should return empty list for PRs with no ticket references', () => {
    expect(getTasks(emptySource)).toEqual([]);
  });
});
