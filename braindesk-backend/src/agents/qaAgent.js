import { Agent, tool } from "@openai/agents";
import { z } from "zod";
import { executeApiTest } from "../tools/apiTesterTool.js";

// Agent ke liye Tool wrapper
const test_api_tool = tool({
  name: "test_api_endpoint",
  description: "Executes an HTTP request to test an API endpoint and returns the status, response time, and data.",
  parameters: z.object({
    url: z.string().describe("The full URL of the API to test"),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]).describe("HTTP method"),
    //  FIX: Removed .optional(). Agent MUST send at least "{}"
    body: z.string().describe("A JSON stringified object for the payload. If no body is needed, send '{}'."),
    headers: z.string().describe("A JSON stringified object for headers. If no headers are needed, send '{}'.")
  }),
  async execute({ url, method, body, headers }) {
    let parsedBody = {};
    let parsedHeaders = {};
    
    try {
        // Agar body/headers mein "{}" aaya toh usko parse kar lenge
        if (body && body !== "{}" && body !== "") parsedBody = JSON.parse(body);
        if (headers && headers !== "{}" && headers !== "") parsedHeaders = JSON.parse(headers);
    } catch (e) {
        console.log("[QA Agent] JSON Parse Error: Agent sent invalid JSON string.");
    }

    const result = await executeApiTest(url, method, parsedBody, parsedHeaders);
    return JSON.stringify(result);
  }
});

export const qaAgent = new Agent({
  name: "QA Automation Agent",
  model: "gpt-4o-mini",
  instructions: `
        You are an Elite QA Automation Engineer. You perform intelligent, stateful HTTP API testing.
        
        CRITICAL WORKFLOW & CHAINING RULES:
        1. Understand the Request: If the user just provides a base URL, ask them for the specific endpoints or the expected JSON payload schema before testing.
        2. Deduce Payload: If the user provides an endpoint (e.g., /register), deduce standard fields if missing.
        3. 🚨 RANDOM DATA: ALWAYS generate a highly randomized email (e.g., "testuser_" + random numbers + "@example.com") for Registration APIs to avoid 'Duplicate Key' database errors.
        4. Stateful Testing (Chaining): FIRST use 'test_api_endpoint' on Registration. THEN, use those EXACT same credentials to test the Login API.

        🛑 ANTI-LOOP MECHANISM: 
        - If a server returns a Network Error or 500, DO NOT RETRY. Assume the server is down or broken.
        - Maximum 1 attempt per test case. Accept the failure, mark as "Fail", and move on.
        - Generate 1 positive test, and at least 2 negative edge cases (e.g., wrong password, missing field).
        
        FINAL OUTPUT FORMAT (SEXY MARKDOWN):
        Always present your findings in a highly professional Markdown table:
        
        ### 🧪 API QA Automation Report
        | Test Scenario | Target API | Payload Sent | Status | Time (ms) | Result |
        |---------------|------------|--------------|--------|-----------|--------|
        | Register User | \`/register\`| \`{email: "..."}\` | 201 | 120 | ✅ Pass |
        
        **Bug Analysis & Recommendations:**
        [Write a short, sharp analysis of the API's behavior, pointing out any security or logic flaws.]
    `,
  tools: [test_api_tool]
});