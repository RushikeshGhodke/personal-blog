# Personal Blog

A simple personal blog application with separate guest and admin sections. The blog allows anyone to read published articles while providing authenticated administrators with the ability to create, edit, and delete content.

**Project URL:** [https://roadmap.sh/projects/personal-blog](https://roadmap.sh/projects/personal-blog)

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Pages Overview](#pages-overview)
- [Authentication](#authentication)
- [Data Storage](#data-storage)
- [Technical Details](#technical-details)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)

## Features

### Guest Section (Public Access)
- 📖 **Home Page:** Browse all published articles
- 📄 **Article Page:** Read full article content with publication date
- 🎨 **Responsive Design:** Clean, readable interface
- 🔍 **Article Listing:** View all available blog posts

### Admin Section (Protected)
- 🔐 **Secure Dashboard:** Password-protected admin panel
- ➕ **Add Articles:** Create new blog posts with title and content
- ✏️ **Edit Articles:** Modify existing articles
- 🗑️ **Delete Articles:** Remove unwanted posts
- 📊 **Article Management:** Complete CRUD operations
- 🔒 **Session Management:** Persistent admin sessions

## Requirements

The application meets the following requirements from [roadmap.sh](https://roadmap.sh/projects/personal-blog):

### Guest Section
- ✅ Home page displaying list of published articles
- ✅ Individual article pages with content and publication date
- ✅ Clean, accessible interface for all visitors

### Admin Section  
- ✅ Secure dashboard with authentication
- ✅ Add new articles with title and content
- ✅ Edit existing articles
- ✅ Delete articles
- ✅ Session-based authentication
- ✅ Article management interface

### Technical Requirements
- ✅ File system-based article storage (JSON format)
- ✅ Server-side HTML rendering
- ✅ Form-based data submission
- ✅ Basic authentication implementation
- ✅ Templating engine for dynamic content

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/personal-blog.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd personal-blog
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the server:**
   ```bash
   npm start
   # or
   node index.js
   ```

5. **Access the blog:**
   - Open your browser and navigate to `http://localhost:3000`

## Usage

### Guest Access

1. **View Articles:**
   - Navigate to `http://localhost:3000`
   - Browse the list of published articles
   - Click on any article to read the full content

2. **Read Article:**
   - Click on article title or "Read More"
   - View complete article with publication date

### Admin Access

1. **Login:**
   - Navigate to `http://localhost:3000/login`
   - Enter admin credentials
   - Default credentials (change these in production):
     - Username: `admin`
     - Password: `password123`

2. **Manage Articles:**
   - Access dashboard at `http://localhost:3000/admin`
   - View all articles with edit/delete options

3. **Add New Article:**
   - Click "Add New Article" button
   - Fill in title and content
   - Submit to publish

4. **Edit Article:**
   - Click "Edit" next to article in dashboard
   - Modify title or content
   - Save changes

5. **Delete Article:**
   - Click "Delete" next to article in dashboard
   - Confirm deletion

## Project Structure

```
personal-blog/
├── index.js                 # Main server file and routes
├── package.json            # Dependencies and scripts
├── README.md               # Project documentation
├── LICENSE                 # License information
├── .gitignore             # Git ignore rules
├── blogs/                 # Article storage directory
│   ├── 01-what-is-javascript.json
│   └── what-is-typescript.json
├── public/                # Static assets
│   └── style.css         # Stylesheet
└── views/                # EJS templates
    ├── index.ejs         # Home page (guest)
    ├── article.ejs       # Article detail page (guest)
    ├── login.ejs         # Login page
    ├── admin.ejs         # Admin dashboard
    └── addblog.ejs       # Add/Edit article form
```

## Pages Overview

### Guest Section

#### Home Page (`/`)
- Displays list of all published articles
- Shows article titles and publication dates
- Links to individual article pages
- Clean, readable layout

#### Article Page (`/article/:filename`)
- Full article content display
- Publication date
- Formatted text rendering
- Back to home navigation

### Admin Section

#### Login Page (`/login`)
- Simple login form
- Username and password fields
- Session creation on successful login
- Error messages for failed attempts

#### Admin Dashboard (`/admin`)
- Protected route (requires authentication)
- List of all articles with management options
- Add new article button
- Edit and delete buttons for each article
- Session validation

#### Add/Edit Article Page (`/addblog` or `/addblog/:filename`)
- Form with title and content fields
- Auto-generates filename from title
- Date automatically set on creation
- Save/Update functionality

## Authentication

### Basic Authentication Implementation

The blog uses session-based authentication:

1. **Login Process:**
   - User submits credentials via login form
   - Server validates against hardcoded credentials
   - Session created on successful login
   - Redirect to admin dashboard

2. **Session Management:**
   - Sessions stored server-side
   - Session cookie sent to client
   - All admin routes check for valid session
   - Logout functionality to destroy session

3. **Protected Routes:**
   - `/admin` - Dashboard
   - `/addblog` - Add/Edit article
   - All POST/DELETE operations

### Security Notes

⚠️ **Important:** This implementation uses basic authentication suitable for learning purposes. For production:
- Use environment variables for credentials
- Implement proper password hashing (bcrypt)
- Use secure session configuration
- Add CSRF protection
- Implement rate limiting
- Use HTTPS

## Data Storage

### Article Storage Format

Articles are stored as individual JSON files in the `blogs/` directory:

```json
{
  "title": "What is JavaScript?",
  "content": "JavaScript is a programming language...",
  "date": "2024-01-15"
}
```

### File Naming Convention
- Filename derived from article title
- Lowercase with hyphens replacing spaces
- Example: "What is JavaScript?" → `what-is-javascript.json`

### File Operations
- **Create:** New JSON file created on article addition
- **Read:** Files read on page load
- **Update:** Existing file overwritten on edit
- **Delete:** File removed from filesystem

## Technical Details

### Technologies Used

#### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Template Engine:** EJS (Embedded JavaScript)
- **Session Management:** express-session
- **File System:** Node.js fs module

#### Frontend
- **HTML:** Semantic markup
- **CSS:** Custom styling (style.css)
- **No JavaScript:** Pure HTML forms

### Dependencies

```json
{
  "express": "^4.18.x",
  "ejs": "^3.1.x",
  "express-session": "^1.17.x"
}
```

### Key Features Implementation

1. **Server-Side Rendering:**
   - EJS templates render HTML on server
   - Dynamic content injection
   - No client-side JavaScript required

2. **Form Handling:**
   - Standard HTML forms
   - POST requests for data submission
   - Server processes and responds

3. **File System Storage:**
   - Articles stored as JSON files
   - Direct filesystem reads/writes
   - Simple, database-free architecture

4. **Session Management:**
   - express-session middleware
   - Cookie-based sessions
   - Server-side session storage

## API Routes

### Public Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Home page with article list |
| GET | `/article/:filename` | Individual article page |
| GET | `/login` | Login page |

### Protected Routes (Require Authentication)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/admin` | Admin dashboard |
| GET | `/addblog` | Add new article form |
| GET | `/addblog/:filename` | Edit article form |
| POST | `/addblog` | Create new article |
| POST | `/addblog/:filename` | Update existing article |
| DELETE | `/delete/:filename` | Delete article |
| POST | `/logout` | Logout and destroy session |

### Authentication Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/login` | Process login credentials |
| POST | `/logout` | Logout user |

## Development

### Local Development

1. **Make changes to code:**
   - Modify `index.js` for routes/logic
   - Edit EJS templates in `views/`
   - Update styles in `public/style.css`

2. **Test changes:**
   ```bash
   node index.js
   ```

3. **Testing scenarios:**
   - Test guest access to articles
   - Test admin login/logout
   - Test article CRUD operations
   - Test authentication protection
   - Test error handling

### Development Tips

- Articles automatically saved to `blogs/` directory
- Restart server after backend changes
- Frontend changes reflect immediately
- Check console for error messages
- Test with multiple browsers

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhancement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/enhancement`)
5. Open a Pull Request

### Contribution Ideas

- [ ] **Rich Text Editor:** Add WYSIWYG editor for articles
- [ ] **Image Upload:** Support for article images
- [ ] **Categories/Tags:** Organize articles by topic
- [ ] **Search Functionality:** Search articles by title/content
- [ ] **Pagination:** Add pagination for article list
- [ ] **Comments System:** Allow reader comments
- [ ] **Draft System:** Save articles as drafts
- [ ] **Markdown Support:** Write articles in Markdown
- [ ] **Database Integration:** Move from files to database
- [ ] **User Management:** Multiple admin users

## Future Enhancements

Potential improvements for this project:

- [ ] **Database Storage:** Replace JSON files with MongoDB/PostgreSQL
- [ ] **Rich Content:** Markdown or WYSIWYG editor
- [ ] **Media Upload:** Image and file attachment support
- [ ] **SEO Optimization:** Meta tags and sitemap
- [ ] **RSS Feed:** Subscribe to blog updates
- [ ] **Social Sharing:** Share buttons for articles
- [ ] **Analytics:** Track views and engagement
- [ ] **Comments:** Reader interaction system
- [ ] **Categories/Tags:** Better content organization
- [ ] **Search:** Full-text search functionality
- [ ] **Responsive Design:** Mobile-optimized layout
- [ ] **API Version:** RESTful API for frontend frameworks

## Educational Value

This project demonstrates:

- **Web Server Development:** Building with Express.js
- **Template Engines:** Using EJS for dynamic HTML
- **Authentication:** Session-based user authentication
- **CRUD Operations:** Complete data management
- **File System Operations:** Reading/writing files with Node.js
- **Form Handling:** Processing HTML form submissions
- **Routing:** Organizing application endpoints
- **Middleware:** Using Express middleware
- **Security Basics:** Protecting admin routes
- **MVC Pattern:** Separating concerns in web apps


## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- **Project Source:** [roadmap.sh Personal Blog Project](https://roadmap.sh/projects/personal-blog)
- **Framework:** [Express.js](https://expressjs.com/)
- **Template Engine:** [EJS](https://ejs.co/)
- **Author:** [RushikeshGhodke](https://github.com/rushikeshghodke)

---

**Note:** This project is part of the roadmap.sh backend development learning path. It demonstrates practical skills in web development, authentication, CRUD operations, and server-side rendering.

## Quick Start

```bash
# Clone and run in 4 steps
git clone https://github.com/yourusername/personal-blog.git
cd personal-blog
npm install
node index.js
```

Visit `http://localhost:3000` to start blogging! ✍️📝