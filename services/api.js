import fetch from 'node-fetch';

export async function getProducts() {
	// const res = await fetch(process.env.FAKE_STORE_API_URL + '/products');
	const res = await fetch(`${process.env.FAKE_STORE_API_URL}/products/?categoryId=5`);
	const products = await res.json();
	return products;
}

export async function getProduct(id) {
	const res = await fetch(`${process.env.FAKE_STORE_API_URL}/products/${id}`);
	const product = await res.json();
	return product;
}