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
    const slugToDelete = req.params.slug;
    const blogsDir = path.join(__dirname, 'blogs');

    try {
        const files = fs.readdirSync(blogsDir);
        let deleted = false;

        files.forEach(file => {
            if (file.endsWith('.json')) {
                const filePath = path.join(blogsDir, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const blogData = JSON.parse(fileContent);

                if (Array.isArray(blogData)) {
                    const updatedBlogs = blogData.filter(b => b.slug !== slugToDelete);

                    // If something was removed, update the file
                    if (updatedBlogs.length < blogData.length) {
                        if (updatedBlogs.length === 0) {
                            fs.unlinkSync(filePath);
                        } else {
                            fs.writeFileSync(filePath, JSON.stringify(updatedBlogs, null, 2));
                        }
                        deleted = true;
                    }
                } else {
                    if (blogData.slug === slugToDelete) {
                        fs.unlinkSync(filePath);
                        deleted = true;
                    }
                }
            }
        });

        if (deleted) {
            console.log(`Blog with slug "${slugToDelete}" deleted successfully`);
        } else {
            console.log(`Blog with slug "${slugToDelete}" not found`);
        }

    } catch (error) {
        console.error('Error deleting blog:', error);
    }

    res.redirect('/admin');
});

app.get('/admin/add-blog', requireAuth, (req, res) => {
    res.render('addblog', {
        title: "Add Blog",
        error: null
    })
});

app.post('/admin/add-blog', requireAuth, (req, res) => {
    const { title, content, date, slug } = req.body;

    if (!title || !content || !date || !slug) {
        return res.render('addBlog', {
            title: "Add new blog",
            error: "All fields are required"
        })
    }

    const blogs = getAllBlogs();
    const slugExists = blogs.some(b => b.slug === slug);

    if (slugExists) {
        return res.render('addblog', {
            title: 'Add New Blog',
            username: req.session.username,
            error: 'A blog with this slug already exists'
        });
    }

    try {
        const newBlog = {
            title,
            content,
            date,
            slug
        };

        const filename = `${slug}.json`;
        const filePath = path.join(__dirname, 'blogs', filename);

        fs.writeFileSync(filePath, JSON.stringify([newBlog], null, 2));

        console.log(`Blog "${title}" created successfully`);
        res.redirect('/admin');

    } catch (error) {
        console.error('Error creating blog:', error);
        res.render('addblog', {
            title: 'Add New Blog',
            username: req.session.username,
            error: 'Error creating blog post'
        });
    }
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