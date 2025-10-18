import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 3000;

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: "SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}))

function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        return res.redirect('/login');
    }
}

// Function to read all blog files
function getAllBlogs() {
    const blogsDir = path.join(__dirname, 'blogs');
    const blogs = [];

    try {
        const files = fs.readdirSync(blogsDir);

        files.forEach(file => {
            if (file.endsWith('.json')) {
                const filePath = path.join(blogsDir, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const blogData = JSON.parse(fileContent);

                // If it's an array, spread the blogs, otherwise push the single blog
                if (Array.isArray(blogData)) {
                    blogs.push(...blogData);
                } else {
                    blogs.push(blogData);
                }
            }
        });

        // Sort blogs by date (newest first)
        blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    } catch (error) {
        console.error('Error reading blogs:', error);
    }

    return blogs;
}

app.get('/', (req, res) => {
    const blogs = getAllBlogs();

    res.render('index', {
        title: 'Personal Blog',
        blogs: blogs
    });
});

// Add this route after the home route
app.get('/blog/:slug', (req, res) => {
    const blogs = getAllBlogs();
    console.log(req.params.slug);

    const blog = blogs.find(b => b.slug === req.params.slug);
    console.log(blog)
    if (blog) {
        res.render('article', {
            title: blog.title,
            blog: blog
        });
    } else {
        res.status(404).send('Blog not found');
    }
});

app.get('/login', (req, res) => {
    if (req.session.authenticated) {
        return res.redirect('/admin');
    }
    res.render('login', {
        title: 'Admin Login',
        error: null
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.authenticated = true;
        req.session.username = username;
        res.redirect('/admin');
    } else {
        res.render('login', {
            title: 'Admin Login',
            error: 'Invalid username or password'
        });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        }
        res.redirect('/');
    });
});

app.get('/admin', requireAuth, (req, res) => {
    const blog = getAllBlogs();
    res.render('admin', {
        title: "Admin Dashboard",
        username: req.session.username,
        blogs: blog
    });
});

app.post('/admin/delete/:slug', requireAuth, (req, res) => {
    console.log(req.url.slug);
});

app.get('/api/data', (req, res) => {
    res.json({
        title: "Hello from API",
        message: "This data is coming from an API endpoint!"
    })
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});