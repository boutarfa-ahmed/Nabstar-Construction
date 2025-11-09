document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const btnView = document.getElementById("contactViewAdmin");

  btnView.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const result = await fetch("./api/getContact.php");

      if (!result.ok) throw new Error("Erreur HTTP: " + result.status);

      const data = await result.json();
      container.innerHTML = "";

      if (!Array.isArray(data.data) || data.data.length === 0) {
        container.innerHTML = `<p>Aucun message trouvé.</p>`;
        return;
      }

      // 🔎 Ajout de la recherche avec sélection du type
      let html = `
        <div class="d-flex gap-2 mb-3 align-items-center flex-wrap">
          <label class="fw-bold">Search by:</label>
          <select id="searchType" class="form-select w-auto">
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="service_id">Service</option>
            <option value="message">Message</option>
          </select>
          <input type="text" id="searchValue" class="form-control w-auto" placeholder="Enter your search..." />
        </div>

        <table class="table table-striped table-bordered align-middle text-center">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Message</th>
              <th>Seen</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody id="contactTableBody">
      `;

      data.data.forEach((item) => {
        html += `
          <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.phone ?? '-'}</td>
            <td>${item.service_id ?? '-'}</td>
            <td>${item.message}</td>
            <td>
              ${
                item.seen == 1
                  ? '<span class="badge bg-success">Yes</span>'
                  : '<span class="badge bg-secondary">No</span>'
              }
            </td>
            <td>${item.created_at}</td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
      `;

      container.innerHTML = html;

      // 🎯 Sélection des éléments
      const searchType = document.getElementById("searchType");
      const searchValue = document.getElementById("searchValue");
      const tableBody = document.getElementById("contactTableBody");

      // 🔍 Fonction de filtrage
      const filterTable = () => {
        const type = searchType.value;
        const value = searchValue.value.trim().toLowerCase();
        const rows = tableBody.querySelectorAll("tr");

        rows.forEach((row) => {
          const cells = row.querySelectorAll("td");
          let cellValue = "";

          switch (type) {
            case "id":
              cellValue = cells[0].textContent;
              break;
            case "name":
              cellValue = cells[1].textContent;
              break;
            case "email":
              cellValue = cells[2].textContent;
              break;
            case "phone":
              cellValue = cells[3].textContent;
              break;
            case "service_id":
              cellValue = cells[4].textContent;
              break;
            case "message":
              cellValue = cells[5].textContent;
              break;
          }

          const match = cellValue.toLowerCase().includes(value);
          row.style.display = match ? "" : "none";
        });
      };

      // 🎧 Événements : changement de texte ou de type
      searchValue.addEventListener("input", filterTable);
      searchType.addEventListener("change", filterTable);

    } catch (err) {
      console.error("Erreur :", err);
      container.innerHTML = `<p style="color:red;">Erreur lors du chargement des messages.</p>`;
    }
  });
});
