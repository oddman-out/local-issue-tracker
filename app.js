// ================= TIME FORMAT =================
function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

// ================= STORAGE =================
function getIssues() {
  return JSON.parse(localStorage.getItem("issues")) || [];
}

function saveIssues(data) {
  localStorage.setItem("issues", JSON.stringify(data));
}

// ================= ELEMENTS =================
const issueListDiv = document.getElementById("issueList");
const form = document.getElementById("issueForm");
const filterSelect = document.getElementById("filter");
const searchInput = document.getElementById("search");

// ================= DISPLAY =================
function displayIssues() {
  let issues = getIssues();
  updateSummaryBar(issues);

  if (!issueListDiv) return;
  issueListDiv.innerHTML = "";

  // FILTER
  if (filterSelect && filterSelect.value !== "All") {
    issues = issues.filter(i => i.status === filterSelect.value);
  }

  // SEARCH
  if (searchInput && searchInput.value) {
    const q = searchInput.value.toLowerCase();
    issues = issues.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q)
    );
  }

  if (issues.length === 0) {
    issueListDiv.innerHTML = "<p>No issues found.</p>";
    return;
  }

  issues.forEach(issue => {
    const div = document.createElement("div");
    div.className = "issue-card fade";

    div.innerHTML = `
      <div class="issue-time">${timeAgo(issue.createdAt)}</div>
      <h3>${escapeHTML(issue.title)}</h3>
      <p><b>Category:</b> ${escapeHTML(issue.category)}</p>
      <p><b>Location:</b> ${escapeHTML(issue.location)}</p>
      <p class="status ${issue.status.replace(" ", "")}">
        Status: ${issue.status}
      </p>

      <div class="controls">
        <button onclick="updateStatus(${issue.id},'Pending')">Pending</button>
        <button onclick="updateStatus(${issue.id},'In Progress')">In Progress</button>
        <button onclick="updateStatus(${issue.id},'Resolved')">Resolved</button>
        <button class="danger" onclick="deleteIssue(${issue.id})">Delete</button>
      </div>
    `;

    issueListDiv.appendChild(div);
  });
}

// ================= CRUD =================
function updateStatus(id, status) {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === id);
  issues[index].status = status;
  saveIssues(issues);
  displayIssues();
}

function deleteIssue(id) {
  if (!confirm("Delete this issue?")) return;
  let issues = getIssues();
  issues = issues.filter(i => i.id !== id);
  saveIssues(issues);
  displayIssues();
}

// ================= SUMMARY =================
function updateSummaryBar(issues) {
  const totalEl = document.getElementById("totalCount");
  const pendingEl = document.getElementById("pendingCount");
  const progressEl = document.getElementById("progressCount");
  const resolvedEl = document.getElementById("resolvedCount");

  if (!totalEl) return;

  totalEl.textContent = issues.length;
  pendingEl.textContent = issues.filter(i => i.status === "Pending").length;
  progressEl.textContent = issues.filter(i => i.status === "In Progress").length;
  resolvedEl.textContent = issues.filter(i => i.status === "Resolved").length;
}

// ================= FORM =================
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();

    const issues = getIssues();
    const newIssue = {
      id: Date.now(),
      title: form.title.value,
      category: form.category.value,
      location: form.location.value,
      description: form.description.value,
      status: "Pending",
      createdAt: Date.now()
    };

    issues.unshift(newIssue);
    saveIssues(issues);
    window.location.replace("index.html");
  });
}

// ================= SECURITY =================
function escapeHTML(text) {
  return text.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[m]);
}

// ================= EVENTS =================
if (filterSelect) filterSelect.addEventListener("change", displayIssues);
if (searchInput) searchInput.addEventListener("input", displayIssues);

// ================= INIT =================
displayIssues();
