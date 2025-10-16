import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.use(express.static('public'));

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

app.get('/api/data', (req, res) => {
    res.json({
        title: "Hello from API",
        message: "This data is coming from an API endpoint!"
    })
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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});