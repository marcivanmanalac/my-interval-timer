const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'profiles.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the Vue client dist directory
// In Docker, we'll map/copy client/dist to a static folder or just use this relative path
const staticPath = path.join(__dirname, '../client/dist');
app.use(express.static(staticPath));

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    console.log('Creating profiles.json');
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

// API Routes
app.get('/api/profiles', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        try {
            const json = JSON.parse(data || '[]');
            res.json(json);
        } catch (e) {
            console.error(e);
            res.json([]);
        }
    });
});

app.post('/api/profiles', (req, res) => {
    const profiles = req.body;
    if (!Array.isArray(profiles)) {
        return res.status(400).json({ error: 'Expected an array of profiles' });
    }

    fs.writeFile(DATA_FILE, JSON.stringify(profiles, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to save data' });
        }
        res.json({ success: true });
    });
});

app.delete('/api/profiles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        try {
            let profiles = JSON.parse(data || '[]');
            const originalLength = profiles.length;
            profiles = profiles.filter(p => p.id !== id);

            if (profiles.length === originalLength) {
                return res.status(404).json({ error: 'Profile not found' });
            }

            fs.writeFile(DATA_FILE, JSON.stringify(profiles, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Failed to save data' });
                }
                res.json({ success: true });
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Server error' });
        }
    });
});

app.get('/api/settings', (req, res) => {
    fs.readFile(SETTINGS_FILE, 'utf8', (err, data) => {
        if (err) {
            // Return defaults if file doesn't exist
            return res.json({});
        }
        try {
            const json = JSON.parse(data || '{}');
            res.json(json);
        } catch (e) {
            console.error(e);
            res.json({});
        }
    });
});

app.post('/api/settings', (req, res) => {
    const settings = req.body;
    fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to save settings' });
        }
        res.json({ success: true });
    });
});

// Catch-all for SPA
app.get(/(.*)/, (req, res) => {
    // Only serve index.html if we are not hitting an API
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Not found' });
    }
    const indexPath = path.join(staticPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Client not built or found');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
