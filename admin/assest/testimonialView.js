document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const btn = document.getElementById("testimonialViewAdmin");

  if (!btn) return;
  btn.addEventListener("click", () => {
    container.innerHTML = `
      <div class="p-3 border rounded">
        <h4>Add New Testimonial</h4>
        <form id="addForm" class="mb-4">
          <div class="row g-2 mb-2">
            <div class="col-md-4">
              <input type="text" name="client_name" class="form-control" placeholder="Client Name" required>
            </div>
            <div class="col-md-4">
              <input type="text" name="company" class="form-control" placeholder="Company">
            </div>
            <div class="col-md-2">
              <input type="number" name="rating" class="form-control" placeholder="Rating (1-5)" min="1" max="5" value="5">
            </div>
            <div class="col-md-2">
              <select name="approved" class="form-select">
                <option value="1">Approved</option>
                <option value="0">Pending</option>
              </select>
            </div>
          </div>
          <div class="mb-2">
            <textarea name="content" class="form-control" placeholder="Testimonial Content" rows="3" required></textarea>
          </div>
          <div class="mb-2">
            <input type="text" name="photo" class="form-control" placeholder="Photo URL (optional)">
          </div>
          <button type="submit" class="btn btn-primary">Add Testimonial</button>
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
        const res = await fetch("./api/crudTestimonial.php", {
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
        const res = await fetch("./api/crudTestimonial.php");
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          tableContainer.innerHTML = "<p>No records found.</p>";
          return;
        }
        let html = `<table class="table table-striped table-bordered text-center align-middle">
          <thead class="table-dark"><tr>
            <th>ID</th><th>Client</th><th>Company</th><th>Rating</th><th>Approved</th><th>Created</th><th>Actions</th>
          </tr></thead><tbody>`;
        data.forEach((item) => {
          html += `<tr>
            <td>${item.id}</td>
            <td>${item.client_name}</td>
            <td>${item.company ?? "-"}</td>
            <td>${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}</td>
            <td>${item.approved == 1 ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-secondary">No</span>'}</td>
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
            const res = await fetch(`./api/crudTestimonial.php?id=${id}`, { method: "DELETE" });
            const result = await res.json();
            if (result.success) loadTable();
            else alert("Delete failed");
          });
        });

        document.querySelectorAll(".editBtn").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const res = await fetch(`./api/crudTestimonial.php?id=${id}`);
            const item = await res.json();
            if (!item) return;
            const client_name = prompt("Client Name:", item.client_name);
            if (!client_name) return;
            const company = prompt("Company:", item.company || "");
            const content = prompt("Content:", item.content || "");
            const rating = prompt("Rating (1-5):", item.rating);
            const approved = prompt("Approved (1=yes, 0=no):", item.approved);
            const upRes = await fetch(`./api/crudTestimonial.php?id=${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ client_name, company, content, rating, approved, photo: item.photo }),
            });
            const upResult = await upRes.json();
            if (upResult.success) loadTable();
            else alert("Update failed");
          });
        });
      } catch (err) {
        tableContainer.innerHTML = `<p style="color:red;">Error loading records.</p>`;
      }
    }

    loadTable();
  });
});
