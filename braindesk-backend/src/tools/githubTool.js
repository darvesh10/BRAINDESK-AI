import axios from 'axios';
import { User } from '../models/User.js';

const getGithubSetup = async (userId) => {
    console.log(`\n[GitHub Tool] 🔍 Fetching GitHub token for user: ${userId}`);
    const user = await User.findById(userId);
    if (!user || !user.githubToken) {
        console.log(`[GitHub Tool] ❌ Error: GitHub is not connected!`);
        throw new Error("GitHub is not connected.");
    }
    
    console.log(`[GitHub Tool] 🌐 Validating token with GitHub...`);
    const userRes = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${user.githubToken}` }
    });
    console.log(`[GitHub Tool] ✅ Authorized as User: ${userRes.data.login}`);
    return { token: user.githubToken, username: userRes.data.login };
};

// 1. READ FILE
export const readGithubFile = async (userId, repoName, fileName) => {
    try {
        console.log(`\n[GitHub Tool - READ] 📖 Request to read: '${fileName}' from '${repoName}'`);
        const { token, username } = await getGithubSetup(userId);
        
        console.log(`[GitHub Tool - READ] 📡 Fetching file from GitHub API...`);
        const res = await axios.get(`https://api.github.com/repos/${username}/${repoName}/contents/${fileName}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const content = Buffer.from(res.data.content, 'base64').toString('utf-8');
        console.log(`[GitHub Tool - READ] ✅ Success! Read ${content.length} characters.`);
        return { success: true, content };
    } catch (error) {
        console.log(`[GitHub Tool - READ] ❌ File not found!`);
        return { success: false, error: "File not found or repository does not exist." };
    }
};

// 2. PUSH / UPDATE FILE
export const pushGithubFile = async (userId, repoName, fileName, fileContent) => {
    try {
        console.log(`\n[GitHub Tool - PUSH] 🚀 Request to push: '${fileName}' to '${repoName}'`);
        const { token, username } = await getGithubSetup(userId);

        console.log(`[GitHub Tool - PUSH] 🏗️ Attempting to create repo (if not exists)...`);
        try {
            await axios.post('https://api.github.com/user/repos', { name: repoName, auto_init: true }, { headers: { Authorization: `Bearer ${token}` } });
            console.log(`[GitHub Tool - PUSH] ✨ New repo created!`);
        } catch (e) {
            console.log(`[GitHub Tool - PUSH] ℹ️ Repo already exists. Proceeding...`);
        }

        let fileSha;
        console.log(`[GitHub Tool - PUSH] 🔍 Checking if file exists to get SHA ID...`);
        try {
            const getFileRes = await axios.get(`https://api.github.com/repos/${username}/${repoName}/contents/${fileName}`, { headers: { Authorization: `Bearer ${token}` } });
            fileSha = getFileRes.data.sha;
            console.log(`[GitHub Tool - PUSH] 📎 File found! SHA: ${fileSha}`);
        } catch (e) {
            console.log(`[GitHub Tool - PUSH] 🆕 File is new, no SHA needed.`);
        }

        const contentBase64 = Buffer.from(fileContent).toString('base64');
        const payload = { message: `AI Auto-Commit: Updated ${fileName}`, content: contentBase64 };
        if (fileSha) payload.sha = fileSha;

        console.log(`[GitHub Tool - PUSH] 📤 Uploading data to GitHub...`);
        await axios.put(`https://api.github.com/repos/${username}/${repoName}/contents/${fileName}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        
        console.log(`[GitHub Tool - PUSH] 🎉 SUCCESS! File pushed.`);
        return { success: true, url: `https://github.com/${username}/${repoName}/blob/main/${fileName}` };
    } catch (error) {
        console.error(`[GitHub Tool - PUSH] ❌ Error:`, error.response?.data?.message || error.message);
        return { success: false, error: error.response?.data?.message || "Failed to push file to GitHub." };
    }
};

// 3. DELETE FILE
export const deleteGithubFile = async (userId, repoName, fileName) => {
    try {
        console.log(`\n[GitHub Tool - DELETE FILE] 🗑️ Request to delete file: ${fileName}`);
        const { token, username } = await getGithubSetup(userId);
        
        const getFileRes = await axios.get(`https://api.github.com/repos/${username}/${repoName}/contents/${fileName}`, { headers: { Authorization: `Bearer ${token}` } });
        const fileSha = getFileRes.data.sha;

        console.log(`[GitHub Tool - DELETE FILE] 💥 Executing delete...`);
        await axios.delete(`https://api.github.com/repos/${username}/${repoName}/contents/${fileName}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { message: `AI Auto-Commit: Deleted ${fileName}`, sha: fileSha }
        });
        
        console.log(`[GitHub Tool - DELETE FILE] ✅ Success! File deleted.`);
        return { success: true, message: `File ${fileName} has been deleted successfully.` };
    } catch (error) {
        console.log(`[GitHub Tool - DELETE FILE] ❌ Error: File not found.`);
        return { success: false, error: "File not found or couldn't be deleted." };  
    }
};

