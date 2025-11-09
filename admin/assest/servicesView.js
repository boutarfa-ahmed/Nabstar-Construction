document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const serviceBtn = document.getElementById("serviceViewAdmin");

  serviceBtn.addEventListener("click", () => {
    console.log("⚙️ Service Admin Panel Loaded");

    // === HTML STRUCTURE ===
    container.innerHTML = `
      <div class="p-3 border rounded">
        <h4>Add New Service</h4>
        <form id="addServiceForm" class="mb-4">
          <div class="row g-2">
            <div class="col-md-4">
              <input type="text" name="title" class="form-control" placeholder="Title" required>
            </div>
            <div class="col-md-4">
              <input type="text" name="type" class="form-control" placeholder="Type (ex: construction, renovation)">
            </div>
            <div class="col-md-4">
              <input type="text" name="image" class="form-control" placeholder="Image URL">
            </div>
          </div>
          <div class="mt-2">
            <textarea name="description" class="form-control" placeholder="Description" rows="2"></textarea>
          </div>
          <button type="submit" class="btn btn-primary mt-3">Add Service</button>
        </form>

        <!-- Recherche -->
        <div class="mb-3">
          <h5>🔍 Search Services</h5>
          <div class="row g-2">
            <div class="col-md-4">
              <input type="text" id="searchInput" class="form-control" placeholder="Search by title or ID">
            </div>
            <div class="col-md-4">
              <select id="typeFilter" class="form-select">
                <option value="">All Types</option>
                <option value="construction">Construction</option>
                <option value="renovation">Renovation</option>
                <option value="architecture">Architecture</option>
              </select>
            </div>
            <div class="col-md-4">
              <button id="btnSearch" class="btn btn-secondary w-100">Search</button>
            </div>
          </div>
        </div>

        <div id="servicesTableContainer"></div>
      </div>
    `;

    const form = document.getElementById("addServiceForm");
    const servicesTableContainer = document.getElementById("servicesTableContainer");
    const searchInput = document.getElementById("searchInput");
    const typeFilter = document.getElementById("typeFilter");
    const btnSearch = document.getElementById("btnSearch");

    // === Ajouter un service ===
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
        console.log("Server response:", result);

        if (result.success) {
          alert("✅ Service added successfully!");
          form.reset();
          loadServices();
        } else {
          alert("❌ Error adding service");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Error adding service");
      }
    });

    // === Charger la liste des services ===
    async function loadServices(query = "", type = "") {
      try {
        const result = await fetch("./api/getService.php");
        if (!result.ok) throw new Error("HTTP error " + result.status);

        const data = await result.json();
        console.log("📦 Loaded services:", data);

        let filtered = data;

        // Filtrage
        if (query) {
          filtered = filtered.filter(
            (s) =>
              s.title.toLowerCase().includes(query.toLowerCase()) ||
              s.id.toString() === query
          );
        }
        if (type) {
          filtered = filtered.filter((s) =>
            s.type.toLowerCase().includes(type.toLowerCase())
          );
        }

        if (!Array.isArray(filtered) || filtered.length === 0) {
          servicesTableContainer.innerHTML = "<p>No services found.</p>";
          return;
        }

        let html = `
          <table class="table table-striped table-bordered text-center align-middle">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Image</th>
                <th>Description</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
        `;

        filtered.forEach((s) => {
          html += `
            <tr>
              <td>${s.id}</td>
              <td>${s.title}</td>
              <td>${s.type ?? "-"}</td>
              <td>${s.image ? `<img src="${s.image}" width="60">` : "-"}</td>
              <td>${s.description ?? "-"}</td>
              <td>${s.created_at ?? "-"}</td>
            </tr>
          `;
        });

        html += "</tbody></table>";
        servicesTableContainer.innerHTML = html;
      } catch (err) {
        console.error("Error loading services:", err);
        servicesTableContainer.innerHTML = `<p style="color:red;">Error loading services.</p>`;
      }
    }

    // === Recherche dynamique ===
    btnSearch.addEventListener("click", (e) => {
      e.preventDefault();
      loadServices(searchInput.value.trim(), typeFilter.value.trim());
    });

    // Charger par défaut
    loadServices();
  });
});
