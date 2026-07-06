document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const btn = document.getElementById("faqViewAdmin");

  if (!btn) return;
  btn.addEventListener("click", () => {
    container.innerHTML = `
      <div class="p-3 border rounded">
        <h4>Add New FAQ</h4>
        <form id="addForm" class="mb-4">
          <div class="row g-2 mb-2">
            <div class="col-md-6">
              <input type="text" name="question" class="form-control" placeholder="Question" required>
            </div>
            <div class="col-md-2">
              <input type="number" name="service_id" class="form-control" placeholder="Service ID">
            </div>
            <div class="col-md-2">
              <input type="number" name="order" class="form-control" placeholder="Order" value="0">
            </div>
          </div>
          <div class="mb-2">
            <textarea name="answer" class="form-control" placeholder="Answer" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Add FAQ</button>
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
        const res = await fetch("./api/crudFaq.php", {
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
        const res = await fetch("./api/crudFaq.php");
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          tableContainer.innerHTML = "<p>No records found.</p>";
          return;
        }
        let html = `<table class="table table-striped table-bordered text-center align-middle">
          <thead class="table-dark"><tr>
            <th>ID</th><th>Question</th><th>Answer</th><th>Service ID</th><th>Order</th><th>Created</th><th>Actions</th>
          </tr></thead><tbody>`;
        data.forEach((item) => {
          html += `<tr>
            <td>${item.id}</td>
            <td>${item.question}</td>
            <td style="max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.answer}</td>
            <td>${item.service_id ?? "-"}</td>
            <td>${item.order ?? 0}</td>
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
            const res = await fetch(`./api/crudFaq.php?id=${id}`, { method: "DELETE" });
            const result = await res.json();
            if (result.success) loadTable();
            else alert("Delete failed");
          });
        });

        document.querySelectorAll(".editBtn").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const res = await fetch(`./api/crudFaq.php?id=${id}`);
            const item = await res.json();
            if (!item) return;
            const question = prompt("Question:", item.question);
            if (!question) return;
            const answer = prompt("Answer:", item.answer || "");
            const service_id = prompt("Service ID:", item.service_id || "");
            const order = prompt("Order:", item.order || 0);
            const upRes = await fetch(`./api/crudFaq.php?id=${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ question, answer, service_id, order }),
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
