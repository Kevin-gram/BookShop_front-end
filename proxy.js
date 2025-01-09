import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(cors());

app.use("/odata", createProxyMiddleware({
    target: "http://localhost:4004",
    changeOrigin: true,
    pathRewrite: {
        '^/odata': '/odata/v4/catalog/Books'
    }
}));

app.listen(3000, () => {
    console.log('Proxy server running at http://localhost:3000');
});