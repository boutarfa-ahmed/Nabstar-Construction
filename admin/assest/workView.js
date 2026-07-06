document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const workViewAdminBtn = document.getElementById('workViewAdmin');

    workViewAdminBtn.addEventListener("click", () => {
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

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const dataObj = Object.fromEntries(new FormData(form));
            try {
                const res = await fetch("./api/crudWork.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataObj)
                });
                const result = await res.json();
                if (result.success) {
                    alert("Work added successfully");
                    form.reset();
                    await loadWorks();
                } else {
                    alert("Error: " + (result.error || "Unknown"));
                }
            } catch (err) {
                alert("Fetch error");
            }
        });

        async function loadWorks() {
            try {
                const result = await fetch("./api/crudWork.php");
                const data = await result.json();
                if (!Array.isArray(data) || data.length === 0) {
                    worksTableContainer.innerHTML = "<p>No works found.</p>";
                    return;
                }
                let html = `
                    <table class="table table-striped table-bordered text-center align-middle">
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                data.forEach(item => {
                    html += `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.title}</td>
                            <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.bio ?? "-"}</td>
                            <td>${item.image ?? "-"}</td>
                            <td>${item.location ?? "-"}</td>
                            <td>${item["total-area"] ?? "-"}</td>
                            <td>${item.duration ?? "-"}</td>
                            <td>${item["date-beg"] ?? "-"}</td>
                            <td>${item["date-fin"] ?? "-"}</td>
                            <td>
                                <button class="btn btn-sm btn-warning me-1 editBtn" data-id="${item.id}">Edit</button>
                                <button class="btn btn-sm btn-danger deleteBtn" data-id="${item.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                html += "</tbody></table>";
                worksTableContainer.innerHTML = html;

                document.querySelectorAll(".deleteBtn").forEach((btn) => {
                    btn.addEventListener("click", async () => {
                        if (!confirm("Delete this work?")) return;
                        const id = btn.dataset.id;
                        const res = await fetch(`./api/crudWork.php?id=${id}`, { method: "DELETE" });
                        const result = await res.json();
                        if (result.success) loadWorks();
                        else alert("Delete failed");
                    });
                });

                document.querySelectorAll(".editBtn").forEach((btn) => {
                    btn.addEventListener("click", async () => {
                        const id = btn.dataset.id;
                        const res = await fetch(`./api/crudWork.php?id=${id}`);
                        const items = await res.json();
                        const item = Array.isArray(items) ? items[0] : items;
                        if (!item) return;
                        const title = prompt("Title:", item.title);
                        if (!title) return;
                        const bio = prompt("Bio:", item.bio || "");
                        const image = prompt("Image URL:", item.image || "");
                        const location = prompt("Location:", item.location || "");
                        const total_area = prompt("Total Area:", item["total-area"] || "");
                        const duration = prompt("Duration:", item.duration || "");
                        const date_beg = prompt("Date Beg (YYYY-MM-DD):", item["date-beg"] || "");
                        const date_fin = prompt("Date Fin (YYYY-MM-DD):", item["date-fin"] || "");
                        const upRes = await fetch(`./api/crudWork.php?id=${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ title, bio, image, location, total_area, duration, date_beg, date_fin }),
                        });
                        const upResult = await upRes.json();
                        if (upResult.success) loadWorks();
                        else alert("Update failed");
                    });
                });
            } catch (err) {
                worksTableContainer.innerHTML = `<p style="color:red;">Error loading works.</p>`;
            }
        }

        loadWorks();
    });
});
