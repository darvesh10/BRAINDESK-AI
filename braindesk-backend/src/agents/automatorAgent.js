import { Agent, tool } from "@openai/agents";
import { z } from "zod";
import { readGithubFile, pushGithubFile, deleteGithubFile,} from "../tools/githubTool.js";

const github_read_tool = tool({
    name: "github_read_file",
    description: "Reads the content of an existing file from a GitHub repository.",
    parameters: z.object({ repoName: z.string(), fileName: z.string(), userId: z.string() }),
    async execute({ repoName, fileName, userId }) {
        const res = await readGithubFile(userId, repoName, fileName);
        return res.success ? res.content : res.error;
    }
});

const github_push_tool = tool({
    name: "github_push_file",
    description: "Creates or updates a file in a GitHub repository with new code.",
    parameters: z.object({ repoName: z.string(), fileName: z.string(), fileContent: z.string(), userId: z.string() }),
    async execute({ repoName, fileName, fileContent, userId }) {
        const res = await pushGithubFile(userId, repoName, fileName, fileContent);
        return res.success ? `Success! File pushed. Link: ${res.url}` : res.error;
    }
});

const github_delete_file_tool = tool({
    name: "github_delete_file",
    description: "Deletes a specific FILE from a GitHub repository.",
    parameters: z.object({ repoName: z.string(), fileName: z.string(), userId: z.string() }),
    async execute({ repoName, fileName, userId }) {
        const res = await deleteGithubFile(userId, repoName, fileName);
        return res.success ? res.message : res.error;
    }
});



export const automatorAgent = new Agent({
    name: "Automator Action Agent",
    model: "gpt-4o-mini",
   instructions: `
        You are an elite GitHub Automation Engineer. You execute precise actions on the user's GitHub repositories.
        
        CRITICAL WORKFLOW:
        1. MODIFY/UPDATE file: Use 'github_read_file' -> modify code -> use 'github_push_file'.
        2. CREATE file/repo: Use 'github_push_file'.
        3. DELETE a specific FILE: Use 'github_delete_file'.
        4. DELETE ENTIRE REPOSITORY: 🛑 NEVER attempt this. If asked, politely decline, explaining that AI agents are restricted from deleting entire repos for security reasons. Tell them to do it manually.
        
        FORMATTING YOUR RESPONSE:
        - Always confirm the success or failure of your action.
        - Use clean Markdown. Example:
          ✅ **Action Successful:** File \`index.html\` has been updated.
          🔗 **Link:** [View Commit](url)
        - Be concise and professional.
    `,
    tools: [github_read_tool, github_push_tool, github_delete_file_tool]
});