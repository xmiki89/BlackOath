const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const server = https.createServer(options, (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.method === 'GET' && req.url.startsWith('/get-role')) {
        const params = new URL(req.url, 'http://localhost').searchParams;
        const name = params.get('name') || '';
        const nachname = params.get('nachname') || '';
        const filePath = path.join(__dirname, 'member stuff', `${name} ${nachname}.txt`);
        
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            const roleLine = lines.find(line => line.startsWith('Member:') || line.startsWith('Rolle:'));
            const role = roleLine ? roleLine.split(': ')[1] : 'Member';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ role }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ role: 'Member' }));
        }
    } else if (req.method === 'POST' && req.url === '/delete-member') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { name, nachname } = JSON.parse(body);
                const filePath = path.join(__dirname, 'member stuff', `${name} ${nachname}.txt`);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Deleted');
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error deleting file');
            }
        });
    } else if (req.method === 'POST' && req.url === '/save-vertrag') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { vertragsname, material, ziel, mitglieder, stueckData } = JSON.parse(body);
                const dir = path.join(__dirname, 'member stuff');
                if (!fs.existsSync(dir)) fs.mkdirSync(dir);
                const datum = new Date().toLocaleString('de-DE');
                let inhalt = `${vertragsname}\nDatum: ${datum}\n\n`;
                mitglieder.forEach(m => {
                    const menge = stueckData[m] || 0;
                    const nochAbzugeben = Math.max(ziel - menge, 0);
                    inhalt += `Menge: ${menge} Stk. ${material}\n`;
                    inhalt += `Noch abzugeben: ${nochAbzugeben} Stk. ${material}\n`;
                    inhalt += `Beteiligt: ${m}\n\n`;
                });
                const filePath = path.join(dir, `${vertragsname} - ${datum.replace(/[/:]/g, '-')}.txt`);
                fs.writeFileSync(filePath, inhalt);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('OK');
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error');
            }
        });
    } else if (req.method === 'POST' && req.url === '/update-role') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { name, nachname, role } = data;
                const dir = path.join(__dirname, 'member stuff');
                const filePath = path.join(dir, `${name} ${nachname}.txt`);
                
                if (fs.existsSync(filePath)) {
                    let content = fs.readFileSync(filePath, 'utf8');
                    const lines = content.split('\n');
                    
                    // Entferne bestehende Rolle-Zeile
                    const filteredLines = lines.filter(line => !line.startsWith('Member:') && !line.startsWith('Rolle:'));
                    
                    // Füge neue Rolle hinzu
                    filteredLines.push(`Member: ${role}`);
                    
                    const newContent = filteredLines.join('\n');
                    fs.writeFileSync(filePath, newContent);
                    
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Role updated successfully');
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Member file not found');
                }
            } catch (error) {
                console.error('Error updating role:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error updating role');
            }
        });
    } else if (req.method === 'POST' && (req.url === '/save-password' || req.url === '/save-member')) {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                if (req.url === '/save-member') {
                    const data = JSON.parse(body);
                    const { name, nachname, email, id } = data;
                    const dir = path.join(__dirname, 'member stuff');
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
                    const filePath = path.join(dir, `${name} ${nachname}.txt`);
                    const content = `Name: ${name}\nNachname: ${nachname}\nEmail: ${email || ''}\nID: ${id}\n`;
                    fs.writeFileSync(filePath, content);
                } else {
                    const filePath = path.join(__dirname, 'Password.txt');
                    fs.appendFileSync(filePath, body);
                }
                
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Member saved successfully');
            } catch (error) {
                console.error('Error saving member:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error saving member');
            }
        });
    } else {
        // Serve static files
        const fs = require('fs');
        const path = require('path');
        
        let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
        const extname = path.extname(filePath);
        let contentType = 'text/html';
        
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
        }
        
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`HTTPS Server running at https://localhost:${PORT}`);
});
