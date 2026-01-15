const fs = require('fs');
const path = require('path');
const https = require('https');

// --- CONFIGURATION ---
const TOKEN = process.env.GITHUB_TOKEN;
const REPO_NAME = 'autodate';
const OWNER = 'tita-n';

if (!TOKEN || !OWNER) {
    console.error('Error: Please set GITHUB_TOKEN and your GitHub username in the script.');
    process.exit(1);
}

const IGNORE_LIST = ['node_modules', 'dist', '.git', 'package-lock.json', 'upload_log.txt', 'upload_log_2.txt'];

async function request(method, url, data = null) {
    const options = {
        method,
        headers: {
            'Authorization': `token ${TOKEN}`,
            'User-Agent': 'autodate-uploader',
            'Accept': 'application/vnd.github.v3+json',
        }
    };

    if (data) {
        options.headers['Content-Type'] = 'application/json';
    }

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(body ? JSON.parse(body) : {});
                } else {
                    const error = new Error(`Request failed (${res.statusCode}): ${body}`);
                    error.responseBody = body;
                    error.statusCode = res.statusCode;
                    reject(error);
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

function getAllFiles(dir, allFiles = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (IGNORE_LIST.includes(file)) return;
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, allFiles);
        } else {
            allFiles.push(filePath);
        }
    });
    return allFiles;
}

async function upload() {
    try {
        console.log(`Target: ${OWNER}/${REPO_NAME}`);

        // 1. Ensure Repo exists
        try {
            await request('GET', `https://api.github.com/repos/${OWNER}/${REPO_NAME}`);
        } catch (e) {
            console.log('Creating new repository...');
            try {
                await request('POST', 'https://api.github.com/user/repos', { name: REPO_NAME });
            } catch (err) {
                // Might already exist but 404'd earlier or some other issue
                console.log('Repo creation attempt finished.');
            }
        }

        const files = getAllFiles(process.cwd());
        console.log(`Uploading ${files.length} blobs...`);

        const treeEntries = [];
        for (const filePath of files) {
            const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
            const content = fs.readFileSync(filePath, { encoding: 'base64' });

            try {
                const blob = await request('POST', `https://api.github.com/repos/${OWNER}/${REPO_NAME}/git/blobs`, {
                    content: content,
                    encoding: 'base64'
                });

                treeEntries.push({
                    path: relativePath,
                    mode: '100644', // normal file
                    type: 'blob',
                    sha: blob.sha
                });
                console.log(`Blob created: ${relativePath}`);
                // Small delay to prevent hitting concurrent limits
                await new Promise(r => setTimeout(r, 100));
            } catch (err) {
                console.error(`Failed to create blob for ${relativePath}:`, err.message);
                // Continue if possible or throw
                if (err.statusCode === 422 && err.responseBody.includes('already exists')) {
                    // Handle duplicate if needed, but blobs are deduplicated by SHA anyway.
                    // 422 usually means something else for blobs.
                }
                throw err;
            }
        }

        // 2. Get base commit and tree
        let baseCommitSha = null;
        let baseTreeSha = null;
        try {
            const ref = await request('GET', `https://api.github.com/repos/${OWNER}/${REPO_NAME}/git/refs/heads/main`);
            baseCommitSha = ref.object.sha;
            const commit = await request('GET', ref.object.url);
            baseTreeSha = commit.tree.sha;
            console.log(`Found base commit ${baseCommitSha}`);
        } catch (e) {
            console.log('No base commit found (first commit).');
        }

        // 3. Create tree
        console.log('Creating tree...');
        const tree = await request('POST', `https://api.github.com/repos/${OWNER}/${REPO_NAME}/git/trees`, {
            tree: treeEntries,
            base_tree: baseTreeSha
        });

        // 4. Create commit
        console.log('Creating commit...');
        const commit = await request('POST', `https://api.github.com/repos/${OWNER}/${REPO_NAME}/git/commits`, {
            message: 'Initial commit: autodate library complete',
            tree: tree.sha,
            parents: baseCommitSha ? [baseCommitSha] : []
        });

        // 5. Update ref
        console.log('Updating reference...');
        try {
            await request('PATCH', `https://api.github.com/repos/${OWNER}/${REPO_NAME}/git/refs/heads/main`, {
                sha: commit.sha,
                force: true
            });
        } catch (e) {
            // If branch doesn't exist, create it
            await request('POST', `https://api.github.com/repos/${OWNER}/${REPO_NAME}/git/refs`, {
                ref: 'refs/heads/main',
                sha: commit.sha
            });
        }

        console.log('\nSuccess! Your project is now on GitHub.');
        console.log(`URL: https://github.com/${OWNER}/${REPO_NAME}`);
    } catch (error) {
        console.error('\nUpload failed:', error.message);
        if (error.responseBody) console.error('Response:', error.responseBody);
    }
}

upload();
