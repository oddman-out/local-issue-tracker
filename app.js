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

const issueListDiv = 
document.getElementById("issueList");

let issues = JSON.parse(localStorage.getItem("issues")) || [];

function displayIssues() {
  updateSummaryBar(issues);

if(!issueListDiv) return;

issues = JSON.parse(localStorage.getItem("issues")) || [];

  issueListDiv.innerHTML = "";

  if (issues.length === 0) {
    issueListDiv.innerHTML = "<p>No issues reported yet.</p>";
    return;
  }

  issues.forEach(issue => {
    const div = document.createElement("div");
    div.className = "issue-card";

    div.innerHTML = `
      <div class="issue-time">${timeAgo(issue.createdAt)}</div>
      <h3>${issue.title}</h3>
      <p><b>Category:</b> ${issue.category}</p>
      <p><b>Location:</b> ${issue.location}</p>
      <p class="status ${issue.status.replace(" ", "")}">
        Status: ${issue.status}
      </p>
    `;

    issueListDiv.appendChild(div);
  });
}
function updateSummaryBar(issues) {
  const totalEl = document.getElementById("totalCount");
  const pendingEl = document.getElementById("pendingCount");
  const progressEl = document.getElementById("progressCount");
  const resolvedEl = document.getElementById("resolvedCount");

  // 🚨 If summary bar doesn't exist on this page, STOP
  if (!totalEl || !pendingEl || !progressEl || !resolvedEl) {
    return;
  }

  totalEl.textContent = issues.length;
  pendingEl.textContent = issues.filter(i => i.status === "Pending").length;
  progressEl.textContent = issues.filter(i => i.status === "In Progress").length;
  resolvedEl.textContent = issues.filter(i => i.status === "Resolved").length;
}

displayIssues();

const form = document.getElementById("issueForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const newIssue = {
      id: Date.now(),
      title: document.getElementById("title").value,
      category: document.getElementById("category").value,
      location: document.getElementById("location").value,
      description: document.getElementById("description").value,
      status: "Pending",
      createdAt: Date.now()
    };

    issues.unshift(newIssue);
    localStorage.setItem("issues", JSON.stringify(issues));

    setTimeout(() => {

    window.location.replace("index.html");
  },200);
});
}

setInterval(displayIssues, 1000);
