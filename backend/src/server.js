import http from 'http';
import url from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

globalThis.fetch = fetch;

const port = 5000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const requestHandler = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'POST' && parsedUrl.pathname === '/api/generateLocation') {
        try {
            let body = '';

            // Collect data from the POST request body
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                console.log('Request Body:', body); // Log the request body

                const parsedBody = JSON.parse(body); // Parse the body content

                const prompt = `Recommend a place to visit based on the following input: "${parsedBody.query}".
                Please return the result in **JSON format** with the following fields:
                - "name": The name of the place
                - "description": A brief description of the place
                - "reason": Why this place would be suitable
                - "address": The address for the location to be used with Google Maps.`;

                // Send the prompt to Gemini for generating the response
                const result = await model.generateContent(prompt);

                // Assuming the result is already a valid JSON string
                console.log('Raw Response from Gemini:', result.response.text());

                // Remove Markdown
                const cleanedText = result.response
                    .text()
                    .replace(/```json|```/g, '')
                    .trim();

                const recommendation = JSON.parse(cleanedText);

                console.log('Generated Recommendation:', recommendation);

                // Send response to the client
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ response: recommendation }));

            });
        } catch (error) {
            console.error('Error processing request:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};


const server = http.createServer(requestHandler);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
