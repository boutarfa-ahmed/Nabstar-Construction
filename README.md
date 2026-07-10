# Nabstar Construction

Single-page construction company website with a JSON API backend and admin panel.

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** PHP 8+, PDO/MySQL
- **Email:** PHPMailer / SMTP
- **Admin:** Bootstrap 5
- **Database:** MySQL / MariaDB

## Project Structure

```
├── index.php               # Main entry (single page)
├── api/                    # JSON API endpoints
│   ├── db.php              # Database connection factory
│   ├── helpers.php         # CORS headers, pagination utils
│   ├── services-api.php    # GET services (paginated)
│   ├── services-area-api.php # GET service areas (paginated)
│   ├── work-api.php        # GET works (paginated)
│   ├── work-detaille-api.php # GET single work + gallery
│   ├── faqs-api.php        # GET all FAQs
│   └── testimonials-api.php # GET approved testimonials
├── admin/                  # Admin panel
│   ├── index.php           # Dashboard (Bootstrap 5)
│   ├── navbar.php          # API: unread message count
│   ├── api/                # Admin CRUD APIs
│   │   ├── crudWork.php
│   │   ├── crudService.php
│   │   ├── crudServiceArea.php
│   │   ├── crudTestimonial.php
│   │   ├── crudFaq.php
│   │   ├── getService.php
│   │   └── getContact.php
│   └── assest/             # Admin JS + CSS
│       ├── workView.js
│       ├── servicesView.js
│       ├── serviceAreaView.js
│       ├── testimonialView.js
│       ├── faqView.js
│       ├── contactView.js
│       ├── viewDropdownMessage.js
│       ├── script.js
│       └── styles.css
├── includes/               # HTML sections + contact handler
│   ├── base/
│   │   ├── header.php      # <head> + CSS links
│   │   ├── footer.php      # Footer + JS scripts
│   │   └── db.php          # Legacy DB config
│   ├── navbar.php
│   ├── home.php
│   ├── about.php
│   ├── work.php
│   ├── services.php
│   ├── services-area.php
│   ├── testimonials.php
│   ├── faq.php
│   └── contact.php         # Form handler (DB + SMTP)
├── assets/
│   ├── css/                # 15 CSS files (one per section)
│   ├── js/                 # 10 JS files (one per section)
│   └── images/
├── vendor/                 # Composer (PHPMailer)
├── bd/                     # Database dump
│   └── if0_40053831_nabstar.sql
└── composer.json
```

## Database

**Database:** `nabstar`

| Table | Description |
|-------|-------------|
| `services` | Construction services offered |
| `areas` | Service coverage areas |
| `works` | Project portfolio |
| `gallery` | Project gallery images |
| `testimonials` | Client testimonials |
| `faqs` | Frequently asked questions |
| `contacts` | Contact form submissions |
| `admin` | Admin users (legacy) |

Import: `bd/if0_40053831_nabstar.sql`

## Setup

### 1. Database

Create a MySQL database named `nabstar` and import the SQL dump:

```bash
mysql -u root -p nabstar < bd/if0_40053831_nabstar.sql
```

### 2. Configuration

**`api/db.php`** — Database credentials (auto-detects local vs production):

```php
// Local:    host=127.0.0.1  db=nabstar  user=root  pass=''
// Production: configure DB_HOST, DB_NAME, DB_USER, DB_PASS
```

**`includes/contact.php`** — SMTP settings for the contact form:

```php
$mail->Username = 'your-email@gmail.com';
$mail->Password = 'your-smtp-password';
$mail->addAddress('your-email@gmail.com', 'Nabstar Construction');
```

### 3. Dependencies

```bash
composer install
```

### 4. Serve

Place the project in your web server's document root (e.g. XAMPP `htdocs/`).

## Demo Placeholders

All contact details in the template have been replaced with demo values:

| Field | Demo Value |
|-------|-----------|
| Email | `demo@example.com` |
| Phone | `+1 (555) 123-4567` |
| WhatsApp | `15551234567` |

Update these in the following files before going live:
- `includes/navbar.php`
- `includes/contact.php`
- `includes/faq.php`
- `includes/base/footer.php`
- `assets/js/mobile-menu.js`

## API

All endpoints return JSON. Example:

```json
GET /api/services-api.php?offset=0&limit=6
{
  "success": true,
  "data": [...],
  "pagination": { "offset": 0, "limit": 6, "total": 8, "has_more": true },
  "timestamp": "2025-01-01T00:00:00+00:00"
}
```

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/services-api.php` | GET | Paginated active services |
| `/api/services-area-api.php` | GET | Paginated active areas |
| `/api/work-api.php` | GET | Paginated works |
| `/api/work-detaille-api.php?id=` | GET | Work detail + gallery |
| `/api/faqs-api.php` | GET | All FAQs |
| `/api/testimonials-api.php` | GET | Approved testimonials |

## Admin Panel

Access at `/admin/`. Sections: Works, Services, Service Areas, Testimonials, FAQs, Contacts. Full CRUD (Add / Edit / Delete) for all sections.

## License

© Nabstar Construction
