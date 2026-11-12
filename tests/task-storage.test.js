const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function createApp(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));
  const localStorage = {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
  };
  const inputs = {
    "task-title-input": { value: "Test task" },
    "task-description-input": { value: "Description" },
    "task-date-input": { value: "2099-12-31" },
    "task-category-input": { value: "Sales" },
  };
  const context = vm.createContext({
    localStorage,
    document: { getElementById: (id) => inputs[id] },
    window: {},
  });
  for (const file of ["js/storage.js", "script.js"]) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), context);
  }
  vm.runInContext("getCheckedContacts = () => []; clearTask = () => {};", context);
  return { context, values };
}

test("new tasks default to todo and preserve a selected board column", async () => {
  for (const [selected, expected] of [[undefined, "todo"], ["inprogress", "inprogress"]]) {
    const app = createApp(selected ? { selctTaskCon: selected } : {});
    await vm.runInContext("createTask()", app.context);
    const tasks = JSON.parse(app.values.get("join-demo:tasks"));
    assert.equal(tasks.length, 1);
    assert.equal(tasks[0].taskcon, expected);
    assert.equal(app.values.get("selctTaskCon"), "todo");
    assert.equal(app.context.window.location, "./board.html");
  }
});

test("tasks saved without a column reappear in todo without changing other columns", async () => {
  const app = createApp({
    "join-demo:tasks": JSON.stringify([
      { id: 1, taskcon: null },
      { id: 2 },
      { id: 3, taskcon: "" },
      { id: 4, taskcon: "done" },
    ]),
  });
  const tasks = await vm.runInContext('getItem("tasks")', app.context);
  assert.deepEqual(Array.from(tasks, (task) => task.taskcon), ["todo", "todo", "todo", "done"]);
});
