// Minimal product listing, quick-view modal and cart (localStorage)
const PRODUCTS = [
	{ id: 1, name: 'Classic Runner', price: 3499, img: 'archive/shoes_converted.jpg', category: 'men', desc: 'Comfortable everyday running shoe.' },
	{ id: 2, name: 'Urban Sneaker', price: 2999, img: 'archive/generated-image.png', category: 'men', desc: 'Sleek urban sneaker for daily wear.' },
	{ id: 3, name: 'Elite Pro', price: 4999, img: 'archive/generated-image (1).png', category: 'men', desc: 'High-performance trainer.' },
	{ id: 4, name: 'Soul Chelsea', price: 2499, img: 'archive/Gemini_Generated_Image_6upoqo6upoqo6upo.png', category: 'men', desc: 'Stylish Chelsea-style runner.' },
	{ id: 5, name: 'Blue Flash', price: 5499, img: 'archive/Gemini_Generated_Image_27g5gx27g5gx27g5.png', category: 'women', desc: 'Bold colorway running shoe.' }
];

const productGrid = document.getElementById('product-grid');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');
const modal = document.getElementById('quickview-modal');
const modalContent = modal.querySelector('.modal-content');

function formatPrice(n){ return `₹${n}`; }

function renderProducts(list){
	productGrid.innerHTML = '';
	list.forEach(p => {
		const article = document.createElement('article');
		article.className = 'product-card';
		article.innerHTML = `
			<img class="product-img" src="${p.img}" alt="${p.name}" />
			<h3>${p.name}</h3>
			<p class="price">${formatPrice(p.price)}</p>
			<div class="actions">
				<button class="btn btn-quick" data-id="${p.id}">Quick view</button>
				<button class="btn btn-add" data-add="${p.id}">Add to cart</button>
			</div>
		`;
		productGrid.appendChild(article);
	});
}

function getFiltered(){
	const cat = categoryFilter.value;
	let list = PRODUCTS.slice();
	if(cat !== 'all') list = list.filter(p => p.category === cat);
	const sort = sortSelect.value;
	if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
	if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
	return list;
}

function openQuickView(id){
	const p = PRODUCTS.find(x=>x.id==id);
	if(!p) return;
	modalContent.innerHTML = `
		<img src="${p.img}" alt="${p.name}" />
		<div class="modal-details">
			<h3>${p.name}</h3>
			<p class="price">${formatPrice(p.price)}</p>
			<p>${p.desc}</p>
			<div style="margin-top:12px;"><button class="btn btn-add" data-add="${p.id}">Add to cart</button></div>
		</div>
	`;
	modal.setAttribute('aria-hidden','false');
}

function closeModal(){
	modal.setAttribute('aria-hidden','true');
	modalContent.innerHTML = '';
}

// cart (localStorage)
function getCart(){
	try{ return JSON.parse(localStorage.getItem('soluxe_cart')||'[]'); }catch(e){ return []; }
}
function saveCart(c){ localStorage.setItem('soluxe_cart', JSON.stringify(c)); updateCartBadge(); }
function addToCart(id){
	const cart = getCart();
	const item = cart.find(x=>x.id==id);
	if(item) item.qty += 1; else cart.push({ id, qty:1 });
	saveCart(cart);
}

function updateCartBadge(){
	let badge = document.querySelector('.cart-badge');
	const total = getCart().reduce((s,i)=>s+i.qty,0);
	if(!badge){
		// create small badge in header
		const header = document.querySelector('.header-inner');
		const node = document.createElement('div');
		node.className = 'cart';
		node.innerHTML = `<a href="#" aria-label="Cart">Cart</a><span class="cart-badge">${total}</span>`;
		header.appendChild(node);
	} else {
		badge.textContent = total;
	}
}

// event delegation
document.addEventListener('click', (e)=>{
	const q = e.target.closest('[data-id]');
	if(q && q.dataset.id){ openQuickView(q.dataset.id); return; }
	const a = e.target.closest('[data-add]');
	if(a){ addToCart(Number(a.dataset.add)); return; }
	if(e.target.closest('[data-close]')){ closeModal(); }
});

categoryFilter.addEventListener('change', ()=> renderProducts(getFiltered()));
sortSelect.addEventListener('change', ()=> renderProducts(getFiltered()));

// close modal when clicking ESC
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });

// initial render
renderProducts(getFiltered());
updateCartBadge();

