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

    if (req.method === 'GET' && parsedUrl.pathname === '/api/generateLocation') {
        try {
            const prompt = "Write a story about a magic backpack.";

            const result = await model.generateContent(prompt);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ response: result.response.text() }));
        } catch (error) {
            console.error('Error generating content:', error);
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
