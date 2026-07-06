document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const btn = document.getElementById("serviceAreaViewAdmin");

  if (!btn) return;
  btn.addEventListener("click", () => {
    container.innerHTML = `
      <div class="p-3 border rounded">
        <h4>Add New Service Area</h4>
        <form id="addForm" class="mb-4">
          <div class="row g-2 mb-2">
            <div class="col-md-6">
              <input type="text" name="name" class="form-control" placeholder="Area Name" required>
            </div>
            <div class="col-md-6">
              <textarea name="description" class="form-control" placeholder="Description" rows="2"></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Add Service Area</button>
        </form>
        <div id="recordsTableContainer"></div>
      </div>
    `;

    const form = document.getElementById("addForm");
    const tableContainer = document.getElementById("recordsTableContainer");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      try {
        const res = await fetch("./api/crudServiceArea.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.success) {
          alert("Added successfully");
          form.reset();
          loadTable();
        } else {
          alert("Error: " + (result.error || "Unknown"));
        }
      } catch (err) {
        alert("Error adding record");
      }
    });

    async function loadTable() {
      try {
        const res = await fetch("./api/crudServiceArea.php");
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          tableContainer.innerHTML = "<p>No records found.</p>";
          return;
        }
        let html = `<table class="table table-striped table-bordered text-center align-middle">
          <thead class="table-dark"><tr>
            <th>ID</th><th>Name</th><th>Description</th><th>Active</th><th>Created At</th><th>Actions</th>
          </tr></thead><tbody>`;
        data.forEach((item) => {
          html += `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description ?? "-"}</td>
            <td>${item.is_active == 1 ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-secondary">No</span>'}</td>
            <td>${item.created_at ?? "-"}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1 editBtn" data-id="${item.id}">Edit</button>
              <button class="btn btn-sm btn-danger deleteBtn" data-id="${item.id}">Delete</button>
            </td>
          </tr>`;
        });
        html += "</tbody></table>";
        tableContainer.innerHTML = html;

        document.querySelectorAll(".deleteBtn").forEach((btn) => {
          btn.addEventListener("click", async () => {
            if (!confirm("Delete this record?")) return;
            const id = btn.dataset.id;
            const res = await fetch(`./api/crudServiceArea.php?id=${id}`, { method: "DELETE" });
            const result = await res.json();
            if (result.success) {
              loadTable();
            } else {
              alert("Delete failed");
            }
          });
        });

        document.querySelectorAll(".editBtn").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const res = await fetch(`./api/crudServiceArea.php?id=${id}`);
            const item = await res.json();
            if (!item) return;
            const name = prompt("Name:", item.name);
            if (!name) return;
            const description = prompt("Description:", item.description || "");
            const upRes = await fetch(`./api/crudServiceArea.php?id=${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, description }),
            });
            const upResult = await upRes.json();
            if (upResult.success) {
              loadTable();
            } else {
              alert("Update failed");
            }
          });
        });
      } catch (err) {
        tableContainer.innerHTML = `<p style="color:red;">Error loading records.</p>`;
      }
    }

    loadTable();
  });
});
