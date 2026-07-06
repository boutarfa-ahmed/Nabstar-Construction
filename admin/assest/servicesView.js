document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const serviceBtn = document.getElementById("serviceViewAdmin");

  serviceBtn.addEventListener("click", () => {
    container.innerHTML = `
      <div class="p-3 border rounded">
        <h4>Add New Service</h4>
        <form id="addServiceForm" class="mb-4">
          <div class="row g-2">
            <div class="col-md-6">
              <input type="text" name="title" class="form-control" placeholder="Title" required>
            </div>
            <div class="col-md-6">
              <input type="text" name="image" class="form-control" placeholder="Icon (ex: fa-solid fa-house)">
            </div>
          </div>
          <div class="mt-2">
            <textarea name="description" class="form-control" placeholder="Description" rows="2"></textarea>
          </div>
          <button type="submit" class="btn btn-primary mt-3">Add Service</button>
        </form>
        <div id="servicesTableContainer"></div>
      </div>
    `;

    const form = document.getElementById("addServiceForm");
    const servicesTableContainer = document.getElementById("servicesTableContainer");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const dataObj = Object.fromEntries(formData);
      try {
        const res = await fetch("./api/crudService.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataObj),
        });
        const result = await res.json();
        if (result.success) {
          alert("Service added successfully");
          form.reset();
          loadServices();
        } else {
          alert("Error: " + (result.error || "Unknown"));
        }
      } catch (err) {
        alert("Error adding service");
      }
    });

    async function loadServices() {
      try {
        const result = await fetch("./api/getService.php");
        if (!result.ok) throw new Error("HTTP error " + result.status);
        const data = await result.json();
        if (!Array.isArray(data) || data.length === 0) {
          servicesTableContainer.innerHTML = "<p>No services found.</p>";
          return;
        }
        let html = `
          <table class="table table-striped table-bordered text-center align-middle">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Icon</th>
                <th>Description</th>
                <th>Active</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
        `;
        data.forEach((s) => {
          html += `
            <tr>
              <td>${s.id}</td>
              <td>${s.name}</td>
              <td>${s.slug ?? "-"}</td>
              <td>${s.icon ?? "-"}</td>
              <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.description ?? "-"}</td>
              <td>${s.is_active == 1 ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-secondary">No</span>'}</td>
              <td>${s.created_at ?? "-"}</td>
              <td>
                <button class="btn btn-sm btn-warning me-1 editBtn" data-id="${s.id}">Edit</button>
                <button class="btn btn-sm btn-danger deleteBtn" data-id="${s.id}">Delete</button>
              </td>
            </tr>
          `;
        });
        html += "</tbody></table>";
        servicesTableContainer.innerHTML = html;

        document.querySelectorAll(".deleteBtn").forEach((btn) => {
          btn.addEventListener("click", async () => {
            if (!confirm("Delete this service?")) return;
            const id = btn.dataset.id;
            const res = await fetch(`./api/crudService.php?id=${id}`, { method: "DELETE" });
            const result = await res.json();
            if (result.success) loadServices();
            else alert("Delete failed");
          });
        });

        document.querySelectorAll(".editBtn").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const res = await fetch(`./api/crudService.php?id=${id}`);
            const items = await res.json();
            const s = Array.isArray(items) ? items[0] : items;
            if (!s) return;
            const title = prompt("Title:", s.name);
            if (!title) return;
            const description = prompt("Description:", s.description || "");
            const image = prompt("Icon:", s.icon || "");
            const upRes = await fetch(`./api/crudService.php?id=${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title, description, image }),
            });
            const upResult = await upRes.json();
            if (upResult.success) loadServices();
            else alert("Update failed");
          });
        });
      } catch (err) {
        servicesTableContainer.innerHTML = `<p style="color:red;">Error loading services.</p>`;
      }
    }

    loadServices();
  });
});
