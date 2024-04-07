import { getProducts, getProduct } from './services/api.js';
import { createOrder, retrieveOrder } from './services/klarna.js';
import express from 'express';
import { config } from 'dotenv';

config();

const app = express();

app.get('/', async (req, res) => {
	// Your existing route handling logic
	const products = await getProducts();
	const markup = products
		.map((p) => {
			console.log('Image URL:', p.title); // Log image URL
			return `<div class="product-card">
                <div class="product-img">
                    <img src="${p.images}" alt="${p.title}"/>
                </div>
                <div class="product-info">
					<h3>${p.title}</h3>
                    <p>${p.price} kr</p>
                    <button onclick="window.location.href='/product/${p.id}'">Buy</button>
                </div>
            </div>`;
		})
		.join(' ');
		//comment

	const wrapperMarkup = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

			<style>

			::-webkit-scrollbar {
				display: none;
			}
			
			html {
				scrollbar-width: none;
				-ms-overflow-style: none;
			}
			
			body {
				font-family: 'Arial', sans-serif;
				background-color: #1C1B1E;
				margin: 0;
				padding: 0;
				display: flex;
				justify-content: center;
				color: white;
			}
	
			.container {
				width: 100vw;
				display: flex;
				justify-content: center;
				flex-direction: column;
			}

			.header {
				box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.3);
				text-align: center;
				width: 100%;
				background-color: #303032;
				margin-bottom: 20px;
				color: rgb(245,124,0);
			}

			.products-container {
				display: flex;
				justify-content: center;
				width: 100%;
				flex-wrap: wrap;
			}
	
			.product-card {
				box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.3);
				background-color: #353437;
				display: flex;
				flex-direction: column;
				justify-content: start;
				align-items: center;
				width: 300px;
				height: 480px;
				margin: 20px;
				border-radius: 15px;
				padding: 15px;

			}
	
			.product-img img {
				box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.3);
				width: 100%;
				border-radius: 15px;
			}
	
			.product-info {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: start;
				flex-wrap: wrap;
				width: 80%;
				height: 80%;
			}

			.product-info h3 {
				font-weight: 600;
				font-size: 14px;
			}

			.product-card button {
				border: none;
				border-radius: 5px;
				width: 64px;
				padding: 8px 0;
				background-color: rgb(245,124,0);
				font-size: 14px;
				color: black;
				cursor: pointer;
				margin-top: 10px;
				font-weight: 600;
			}
	
			.product-card button:hover {
				border-radius: 15px;
				background-color: rgb(255,80,0);
				color: white;
				font-weight: 600;
			}
		</style>
            <title>Shop</title>
        </head>
        <body>

            <div class="container">
			<div class="header">
				<h1>MJ Klarna Fake Store</h1>
			</div>

			<div class="products-container">
				${markup}
			</div>
                
            </div>

			
        </body>
        </html>
    `;

	res.send(wrapperMarkup);
});

app.get('/product/:id', async function (req, res) {
	// Your existing route handling logic
	try {
		const { id } = req.params;
		const product = await getProduct(id);
		const klarnaJsonResponse = await createOrder(product);
		const html_snippet = klarnaJsonResponse.html_snippet;
		res.send(html_snippet);
	} catch (error) {
		res.send(error.message);
	}
});

app.get('/confirmation', async function (req, res) {
	// Your existing route handling logic
	const order_id = req.query.order_id;
	const klarnaJsonResponse = await retrieveOrder(order_id);
	const html_snippet = klarnaJsonResponse.html_snippet;
	res.send(html_snippet);
});

app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
});