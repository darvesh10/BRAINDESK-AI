import axios from 'axios';

// Ye hamara core function hai jo API hit karega
export const executeApiTest = async (url, method, body = {}, headers = {}) => {
    try {
        console.log(`\n[API Tester] 🕵️‍♂️ Testing ${method.toUpperCase()} ${url}...`);
        
        const startTime = Date.now(); // Response time measure karne ke liye
        
        const response = await axios({
            url,
            method: method.toUpperCase(),
            data: body,
            headers,
            // MASTERSTROKE: Axios ko bol rahe hain ki 400/500 errors pe crash mat hona, 
            // balki usko bhi as a normal response return karna taaki Agent usko padh sake.
            validateStatus: () => true 
        });
        
        const endTime = Date.now();

        console.log(`[API Tester] ✅ Received Status: ${response.status}`);
        
        return {
            success: true,
            status: response.status,
            timeMs: endTime - startTime,
            data: response.data
        };
    } catch (error) {
        // Ye catch block sirf tab chalega jab server bilkul band ho (Network Error)
        console.log(`[API Tester] ❌ Network Error: Server might be down.`);
        return {
            success: false,
            error: error.message
        };
    }
}; 