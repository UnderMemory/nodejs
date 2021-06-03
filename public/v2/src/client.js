const pages = {
    basket: undefined,
    products: undefined,
    order: undefined,
    register: undefined,
    login: undefined,
};

var basket = [];
/*
{
    productID: 1,
    quantity: 12
}
*/

var products = [];

window.onload = function() {
    for (var i in pages) {
        pages[i] = $('#' + i);
    }
    fetchProducts();
    fetchBasket();
    navigateTo('products');

    $('.nav-link').click(function() {
        navigateTo($(this).data('target'));
    });

    $(document).on('click','.add-product', function() {
        addToBasket($(this).data('target'));
    });

    $(document).on('click', '.basket-delete', function() {
        deleteFromBasket($(this).data('target'));
    });

    // changement de l'input du panier
    $(document).on('change', '.basket-change-quantity', function() {
        basketChangeQuantity($(this).data('target'), $(this).val());
    });

    renderBasket();

    $('#btn-register').click(register);
    $('#btn-login').click(login);
    restoreLogin();
}

function restoreLogin(){
    $.get('/login', (data) => {
        if(data.user) {
            console.log('welcome back', data.user)
        }
    });
}

function login(){
    $.ajax({
        type: "POST",
        url: '/login',
        data: JSON.stringify({
            login: $('#loginLogin').val(),
            pw: $('#loginPw').val(),
        }),
        success: (res) => 
            console.log('POST login reponse', res),
        error: (err) =>
            console.error('POST login error', err.responseText),
        contentType: 'application/json',
    });
}

function register(){
    const dataForm = {
        login: $('#registerLogin').val(),
        pw: $('#registerPw').val(),
        email: $('#registerEmail').val(),
    };
    console.log('Inscription !', dataForm);

    //TODO gérer les erreur de formulaire

    $.ajax({
        type: "POST",
        url: '/register',
        data: JSON.stringify(dataForm),
        success: (res) => 
            console.log('POST register reponse', res),
        error: (err) =>
            console.error('POST register error', err.responseText),
        contentType: 'application/json',
    });
}


function fetchProducts() {
    $.get('/products', (dataProducts) => {
        products = dataProducts;
        renderProducts(products);
    });
}

function fetchBasket() {
    $.get('/basket', (dataBasket) => {
        basket = dataBasket;
        renderBasket();
    });
}

function postBasket() {
    $.ajax({
        type: "POST",
        url: '/basket',
        data: JSON.stringify({basket}),
        success: (res) => 
            console.log('POST basket reponse', res),
        error: (err) =>
            console.error('POST basket error', err.responseText),
        contentType: 'application/json',
      });
}

function deleteFromBasket(productID) {
    const basketItem = basketFind(productID);
    if (!basketItem) {
        console.error('Le produit ' + productID + ' n\'existe pas dans le panier');
        return;
    }
    basket.splice(basket.indexOf(basketItem), 1);
    postBasket();
    renderBasket();
}

function addToBasket(productID) {
    if (basketFind(productID)) {
        basketChangeQuantity(productID, 1, true);
    } else {
        basket.push({
            productID,
            quantity: 1,
        });
        renderBasket();
    }
}

function basketFind(productID) {
    return basket.find(b => b.productID == productID);
}

function getProductByID(productID) {
    return products.find(p => p.id == productID);
}

function basketChangeQuantity(productID, value, increment) {
    const product = basketFind(productID);

    if (!product) {
        console.log(productID, value)
        return console.error('Produit inconnu dans le panier');
        // pareil ==> (a peu près) throw 'Produit inconnu dans le panier';
    }

    if (increment) {
        product.quantity += value;
    } else {
        product.quantity = value >> 0;
    }

    if (product.quantity == 0) {
        deleteFromBasket(productID);
    } else {
        renderBasket();
    }
}

const templateBasket = `
<tr>
  <th scope="row">{readableIndex}</th>
  <td>{name}</td>
  <td>{price}€</td>
  <td><input class="basket-change-quantity" data-target="{productID}" value="{quantity}" /></td>
  <td>{totalPrice}€</td>
  <td>
    <button type="button" class="btn btn-outline-danger basket-delete"
        data-target="{productID}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>
    </button>
</td>
</tr>
`;
function renderBasket() {
    postBasket();
    const $basketList = $('.basket-list');
    const $basketNotEmpty = $('.basket-not-empty');
    const $basketEmpty = $('.basket-empty');

    var content = '';
    if (basket.length == 0) {
        $basketNotEmpty.hide();
        $basketEmpty.show();
        content = 'Votre panier est vide';
    } else {
        $basketNotEmpty.show();
        $basketEmpty.hide();
        for (let i = 0; i < basket.length; ++i) {
            let product = getProductByID(basket[i].productID);
            content += templateBasket.replaceAll('{productID}', product.id)
                .replaceAll('{readableIndex}', i + 1)
                .replaceAll('{name}', product.name)
                .replaceAll('{price}', product.price)
                .replaceAll('{quantity}', basket[i].quantity)
                .replaceAll('{totalPrice}',
                    basket[i].quantity * product.price);
        }
    }
    $basketList.html(content);
}

function navigateTo(pageName) {
    if (!pages[pageName]) {
        console.error('La page ' + pageName + ' n\'existe pas');
        throw 'NO PAGE NAMED ' + pageName; 
    }
    for (var i in pages) {
        pages[i].hide();
    }
    pages[pageName].show();
}

const templateProduct = `
<div class="col-md-3 product-item">
    <div class="card">
        <img src="imgs/products/{id}.png" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">{name}</h5>
        <p class="card-text">{description}</p>
        <p>{price}</p>
        <button class="btn btn-primary add-product"
            data-target="{id}">
            Ajouter au panier
        </button>
        </div>
    </div>
</div>
`;

function renderProducts() {
    const $productList = $('#products .list');

    var content = '';
    if (products.length == 0) {
        content = 'Pas de produits enregistrés';
    } else {
        for (let i = 0; i < products.length; ++i) {
            let p = products[i];
            content += templateProduct
                .replaceAll('{id}', p.id)
                .replaceAll('{name}', p.name)
                .replaceAll('{description}', p.description)
                .replaceAll('{price}', p.price + '€');
        }
    }
    $productList.html(content);
}

