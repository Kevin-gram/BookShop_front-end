const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/api', createProxyMiddleware({
    target: 'http://localhost:4004',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // remove /api prefix when forwarding to the target
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Access-Control-Allow-Origin', '*');
        proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
}));

app.listen(3000, () => {
    console.log('Proxy server is running on http://localhost:3000');
});