window.onload = function () {
    //fetch public data
    fetchItems();

    //bind events (=> attacher les évènements sur la page)
    $('#login-btn').click(login);

    //check is logged status
   checkIsLogged(loggedStatusChange);
};

function login() {
    const data = {
        login: $('input.login').val(),
        password: $('input.password').val()
    }
    // $.post('/test', data, (data) => {
    //     console.log('Reponse du post', data);
    // })
    $.ajax({
        type: "POST",
        url: '/login',
        data: JSON.stringify(data),
        success: (res) => {
            loggedStatusChange(true);
        },
        error: (err) => {
            console.error('POST error', err.responseText);
            $('#login .error').html(err.responseText).show();
        },
        contentType: 'application/json'
      });
};

/**
 * loggedStatusChange
 * @param {Boolean} isLogged 
 * call this when the logged status change
 */
function loggedStatusChange(isLogged) {
    console.log('callbackcheckIsLogged', isLogged);
    $('#login .error').hide()
    $('#loading').hide();
    $('#logged').toggle(isLogged);
    $('#login').toggle(!isLogged);

    if(isLogged){
        //fetch user or private data
    }
};

function checkIsLogged(callback){
    console.log('isLogged');
    $.get('/login', (data) =>{
        console.log('isLogged result', data);
        callback(data.isLogged);
    });
}

function fetchItems(){
    $.get('/items', (data) => showItems(data.items));
}

function showItems(items){
    console.log("showItems", items);
    var html = '<ul>'
    items.forEach((item,i) =>{
        let itemHtml = '<li>';
        for(var k in item){
            switch (k){
                case 'img':
                itemHtml += '<img src="' + item[k] + '" />';
                break;
            
            default:    
            itemHtml += k + ': ' + item[k] + '<br/>'
            }
        }
        itemHtml += '</li>';

        html += itemHtml;
    });
    //   for (var i = 0; i < items.length; ++i) {
    //     var item = items[i];

    //     var itemHtml = '<li>';
    //     //k = key
    //     for(var k in item){
    //         itemHtml += k + ': ' + item[k] + '<br/>'
    //     }
        // itemHtml += '</li>';

        // html += itemHtml;
    //   }
      html += '</ul>';
      $('#items').html(html);

      $('#items').click(() => {
        const data = {
            login: '',
            pw: ''
        }
    
        $.ajax({
            type: "POST",
            url: '/items',
            data: JSON.stringify(data),
            success: (res) => 
                console.log('POST reponse', res),
            contentType: 'application/json',
            dataType:"json"
          });
    });
}

function autreTrucs() {
        // $.get("/test", function( data ) {
    //   console.log("Data Loaded: ", data );
    // });

    $('#btn-test').click(() => {
        const data = {
            login: '',
            pw: ''
        }
        // $.post('/test', data, (data) => {
        //     console.log('Réponse du post', data);
        // })
        $.ajax({
            type: "POST",
            url: '/test',
            data: JSON.stringify(data),
            success: (res) => 
                console.log('POST reponse', res),
            contentType: 'application/json',
            dataType:"json"
          });
    });
}


function register() {
    const data = {
        email: $('input.email').val(),
        login: $('input.login').val(),
        password: $('input.password').val()
    }

    $.ajax({
        type: "POST",
        url: '/register',
        data: JSON.stringify(data),
        success: (res) => {
            loggedStatusChange(true);
        },
        error: (err) => {
            console.error('POST error', err.responseText);
            $('#register .error').html(err.responseText).show();
        },
        contentType: 'application/json'
      });
};