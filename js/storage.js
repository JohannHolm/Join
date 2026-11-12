const DEMO_STORAGE_KEYS = new Set(["tasks", "contacts"]);
const DEMO_CONTACT_COLORS = new Set([
  "#93F6FA",
  "#82FA91",
  "#FFF06F",
  "#FFB486",
  "#F89B9C",
  "#FE4553",
  "#ACC1C6",
]);

/**
 * Reads data saved by this browser's portfolio demo.
 * @param {string} key - The supported demo data key.
 * @returns {Promise<Array>}
 */
async function getItem(key) {
  if (!DEMO_STORAGE_KEYS.has(key)) {
    throw new Error(`Unsupported demo storage key: ${key}`);
  }

  const value = localStorage.getItem(`join-demo:${key}`);
  if (value === null) {
    return [];
  }

  const parsedValue = JSON.parse(value);
  if (!Array.isArray(parsedValue)) {
    throw new Error(`Invalid demo data for key: ${key}`);
  }
  if (key === "tasks") {
    // Older tasks could be saved without a board column.
    return parsedValue.map((task) =>
      task.taskcon == null || task.taskcon === ""
        ? { ...task, taskcon: "todo" }
        : task
    );
  }
  return parsedValue;
}

/**
 * Saves data locally for this browser's portfolio demo.
 * @param {string} key - The supported demo data key.
 * @param {Array} value - The data to save.
 * @returns {Promise<void>}
 */
async function setItem(key, value) {
  if (!DEMO_STORAGE_KEYS.has(key)) {
    throw new Error(`Unsupported demo storage key: ${key}`);
  }
  if (!Array.isArray(value)) {
    throw new TypeError(`Demo data for key "${key}" must be an array.`);
  }

  localStorage.setItem(`join-demo:${key}`, JSON.stringify(value));
}

/**
 * Escapes untrusted text before inserting it into an HTML string.
 * @param {*} value - The value to render as text.
 * @returns {string}
 */
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function getSafeContactColor(value) {
  return DEMO_CONTACT_COLORS.has(value) ? value : "#ACC1C6";
}

function getSafeNumericId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : 0;
}
