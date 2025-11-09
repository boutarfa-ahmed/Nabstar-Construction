<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="UTF-8">
        <title></title>
        <link rel="stylesheet" href="">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <link rel="stylesheet" href="assest\styles.css">
        <!-- Bootstrap Icons -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    </head>
<body class="bg-body-tertiary">
  <div class="app-wrapper d-flex">
    
    <!-- ===== Sidebar ===== -->
    <aside id="sidebar" class="app-sidebar bg-dark text-white vh-100 p-3" style="width: 250px;">
      <h5 class="mb-4">Sidebar</h5>
      <ul class="nav flex-column" id="navigation">
        <li class="nav-item"><a id="workViewAdmin" href="#" class="nav-link text-white">Works</a></li>
        <li class="nav-item"><a id="serviceViewAdmin" href="#" class="nav-link text-white">Services</a></li>
        <li class="nav-item"><a href="#" class="nav-link text-white">Services Area</a></li>
        <li class="nav-item"><a href="#" class="nav-link text-white">Testimonials</a></li>
        <li class="nav-item"><a href="#" class="nav-link text-white">Faqs</a></li>
      </ul>
    </aside>

    <!-- ===== Main Content ===== -->
    <div class="flex-grow-1">
      
      <!-- Navbar -->
      <nav class="navbar navbar-expand bg-body shadow-sm">
        <div class="container-fluid">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a id="toggleSidebarBtn" class="nav-link" href="#"><i class="bi bi-list"></i></a>
            </li>
            <li class="nav-item d-none d-md-block"><a href="#" class="nav-link">Home</a></li>
            <li class="nav-item d-none d-md-block"><a id="contactViewAdmin" href="#" class="nav-link">Contact</a></li>
          </ul>

          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown">
              <a href="#" data-bs-toggle="dropdown" class="nav-link position-relative">
                <i class="bi bi-chat-text"></i>
                <span id="messageCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
              </a>
              <div id="dropdownMenuMessage" class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-2" style="width: 300px;">
                <div class="text-center text-muted small">Loading...</div>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Page Content -->
      <main id="container" class="p-4">
        <h1 class="h3">Welcome NabStar</h1>
        <p>This is your main content area beside the sidebar.</p>
      </main>
    </div>

  </div>
  <script src="assest/workView.js"></script>
  <script src="assest/script.js"></script>
  <script src="assest/contactView.js"></script>
  <script src="assest/viewDropdownMessage.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
