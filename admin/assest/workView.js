document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const workViewAdminBtn = document.getElementById('workViewAdmin');

    workViewAdminBtn.addEventListener("click", () => {
        console.log("🧱 Work admin view loaded");

        container.innerHTML = `
            <form id="addWorkForm" class="mb-4 p-3 border rounded">
                <h4>Add New Work</h4>
                <div class="mb-2">
                    <input type="text" name="title" class="form-control" placeholder="Title" required>
                </div>
                <div class="mb-2">
                    <textarea name="bio" class="form-control" placeholder="Bio" required></textarea>
                </div>
                <div class="mb-2">
                    <input type="text" name="image" class="form-control" placeholder="Image URL">
                </div>
                <div class="mb-2">
                    <input type="text" name="location" class="form-control" placeholder="Location">
                </div>
                <div class="mb-2">
                    <input type="text" name="total_area" class="form-control" placeholder="Total Area">
                </div>
                <div class="mb-2">
                    <input type="text" name="duration" class="form-control" placeholder="Duration">
                </div>
                <div class="mb-2">
                    <input type="date" name="date_beg" class="form-control">
                </div>
                <div class="mb-2">
                    <input type="date" name="date_fin" class="form-control">
                </div>
                <button type="submit" class="btn btn-primary">Add Work</button>
            </form>
            <div id="worksTableContainer" class="mt-4"></div>
        `;

        const form = document.getElementById("addWorkForm");
        const worksTableContainer = document.getElementById("worksTableContainer");

        if (!form) {
            console.error("⚠️ Form not found in DOM");
            return;
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("✅ Form submitted");

            const dataObj = Object.fromEntries(new FormData(form));
            console.log("Data to send:", dataObj);

            try {
                const res = await fetch("./api/crudWork.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataObj)
                });

                const result = await res.json();
                console.log("Server response:", result);

                if (result.success) {
                    alert("✅ Work added successfully");
                    form.reset();
                    await loadWorks();
                } else {
                    alert("❌ Error adding work");
                }
            } catch (err) {
                console.error("❌ Fetch error:", err);
                alert("Fetch error – check console");
            }
        });

        // Charger les works
        async function loadWorks() {
            try {
                const result = await fetch("./api/crudWork.php");
                if (!result.ok) throw new Error("HTTP error " + result.status);

                const data = await result.json();
                console.log("📦 Loaded works:", data);

                if (!Array.isArray(data) || data.length === 0) {
                    worksTableContainer.innerHTML = "<p>No works found.</p>";
                    return;
                }

                let html = `
                    <table class="table table-striped table-bordered text-center">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Bio</th>
                                <th>Image</th>
                                <th>Location</th>
                                <th>Total Area</th>
                                <th>Duration</th>
                                <th>Date Beg</th>
                                <th>Date Fin</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                data.forEach(item => {
                    html += `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.title}</td>
                            <td>${item.bio}</td>
                            <td>${item.image}</td>
                            <td>${item.location}</td>
                            <td>${item["total-area"]}</td>
                            <td>${item.duration}</td>
                            <td>${item["date-beg"]}</td>
                            <td>${item["date-fin"]}</td>
                        </tr>
                    `;
                });

                html += "</tbody></table>";
                worksTableContainer.innerHTML = html;

            } catch (err) {
                console.error("Error loading works:", err);
                worksTableContainer.innerHTML = `<p style="color:red;">Error loading works.</p>`;
            }
        }

        // Charger la table directement
        loadWorks();
    });
});
