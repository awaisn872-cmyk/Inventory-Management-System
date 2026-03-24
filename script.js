let products = JSON.parse(localStorage.getItem('products'))||[];

function saveData(){ localStorage.setItem('products', JSON.stringify(products)); }

const navButtons = document.querySelectorAll('.nav button');
const viewTitle = document.getElementById('view-title');
const viewContainer = document.getElementById('view-container');
const templates = {};
document.querySelectorAll('template').forEach(t=>templates[t.id.replace('tpl-','')]=t);

function setActiveView(view){
  navButtons.forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  viewTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
  renderView(view);
}

navButtons.forEach(b=>b.addEventListener('click', ()=> setActiveView(b.dataset.view)));

function renderView(view){
  viewContainer.innerHTML='';
  const tpl=templates[view];
  if(!tpl){ viewContainer.textContent='Not Available'; return; }
  viewContainer.appendChild(tpl.content.cloneNode(true));
  if(view==='dashboard') renderDashboard();
  if(view==='add') bindAdd();
  if(view==='update') bindUpdate();
  if(view==='delete') bindDelete();
  if(view==='list') bindList();
}

// Dashboard
function renderDashboard(){
  document.getElementById('stat-total').textContent = products.length;
  const totalStock = products.reduce((sum,p)=>sum+(p.qty||0),0);
  document.getElementById('stat-stock').textContent = totalStock;

  const ctx=document.getElementById('stockChart').getContext('2d');
  new Chart(ctx,{
    type:'bar',
    data:{
      labels:products.map(p=>p.pid),
      datasets:[{label:'Stock Quantity',data:products.map(p=>p.qty),backgroundColor:products.map(()=> 'rgba(43,108,176,0.7)')}]
    },
    options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
  });
}

// Add Product
function bindAdd(){
  const form=document.getElementById('addForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=form.name.value.trim();
    const pid=form.pid.value.trim();
    const qty=parseInt(form.qty.value);
    if(products.find(p=>p.pid==pid)){ alert('Product ID already exists'); return;}
    products.push({name,pid,qty});
    saveData(); alert('Product added'); form.reset(); renderDashboard();
  });
}

// Update Product
function bindUpdate(){
  const form=document.getElementById('updateForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const pid=form.pid.value.trim();
    const product=products.find(p=>p.pid==pid);
    if(!product){ alert('Product not found'); return;}
    if(form.name.value.trim()) product.name=form.name.value.trim();
    if(form.qty.value) product.qty=parseInt(form.qty.value);
    saveData(); alert('Product updated'); form.reset(); renderDashboard();
  });
}

// Delete Product
function bindDelete(){
  const form=document.getElementById('deleteForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const pid=form.pid.value.trim();
    const index=products.findIndex(p=>p.pid==pid);
    if(index===-1){ alert('Product not found'); return;}
    products.splice(index,1);
    saveData(); alert('Product deleted'); renderDashboard();
  });
}

// List Products
function bindList(){
  const tbody=document.getElementById('productTable');
  const searchInput=document.getElementById('searchProd');
  function renderList(){
    tbody.innerHTML='';
    const filter = searchInput.value.toLowerCase();
    products.filter(p=>p.pid.includes(filter)||p.name.toLowerCase().includes(filter)).forEach(p=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${p.name}</td><td>${p.pid}</td><td>${p.qty}</td>`;
      tbody.appendChild(tr);
    });
  }
  searchInput.addEventListener('input', renderList);
  renderList();
}

setActiveView('dashboard');