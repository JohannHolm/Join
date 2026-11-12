/**
 * Renders a task on the board.
 * @param {string} category - Task category.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} prio - Task priority.
 * @param {string} idcon - DOM element ID for the container.
 * @param {number} id - Task ID.
 */
async function setBoardHTML(category, title, description, prio, idcon, id) {
  const todo = document.getElementById(idcon);
  if (todo) {
    const safeId = getSafeNumericId(id);
    const safePriority = ["urgent", "medium", "low"].includes(prio)
      ? prio
      : "low";
    todo.innerHTML += `
    <div class="task" id="task" draggable="true" ondragstart="startDragging(${safeId})">
    <div class="task-heading-con">
        <span class="category" id="category" style="background-color: ${categoryColor(
          category
        )}">${escapeHTML(category)}</span>
      <a class="dropdown-task" onclick="mobileDropDownTask(${safeId})" id="dropdown-task${safeId}"><</a>
      <div class="mobile-droptaskcon" id="mobile-droptaskcon${safeId}">
          <a>
                  <div class="mobile-droptaskcon-text" onclick="mobileChangeCon(${safeId}, 'todo')">ToDo</div>
          </a>
          <a>
                  <div class="mobile-droptaskcon-text" onclick="mobileChangeCon(${safeId}, 'awaitfeedback')">Await feedback</div>
          </a>
          <a>
                  <div class="mobile-droptaskcon-text" onclick="mobileChangeCon(${safeId}, 'inprogress')">In Progress</div>
          </a>
          <a>
                  <div class="mobile-droptaskcon-text" onclick="mobileChangeCon(${safeId}, 'done')">Done</div>
          </a>
    </div>
    </div>
    <div onclick="openTask(${safeId})">
      <div class="task-heading" id="task-heading">${escapeHTML(title)}</div>
      <div class="task-description" id="task-description">${escapeHTML(description)}</div>
      <div class="task-subtasks" id="task-subtasks${safeId}"></div>
      <div class="task-footer" id="task-footer">
          <div class="task-profile" id="task-profile-${safeId}">
              
          </div>
          <div id="task-important"><img src="./assets/img/prio${safePriority}.png" alt="important"></div>
      </div>
    </div>
  </div>
  `;
  }
  innerPopUpContact(getSafeNumericId(id));
}

/**
 * Add Subtask HTML
 */
function addSubtaskHTML(subTaskInput) {
  const subTaskList = document.getElementById("subtask-container");
  const item = document.createElement("div");
  item.className = "subtask-list";
  item.id = `subtask-${subTaskInput}`;

  const hoverContainer = document.createElement("div");
  hoverContainer.className = "subtask-list-hover";
  const label = document.createElement("div");
  label.textContent = `- ${subTaskInput}`;

  const buttons = document.createElement("div");
  buttons.className = "subtask-buttons";
  [
    ["deletepopup.png", "delete", removeSubtaskAddTask],
    ["editpopup.png", "edit", editSubtaskAddTask],
  ].forEach(([imageName, alt, action]) => {
    const image = document.createElement("img");
    image.src = `./assets/img/${imageName}`;
    image.alt = alt;
    image.addEventListener("click", () => action(subTaskInput));
    buttons.appendChild(image);
  });

  hoverContainer.append(label, buttons);
  item.appendChild(hoverContainer);
  subTaskList.appendChild(item);
  document.getElementById("subtask-title-input").value = "";
}
