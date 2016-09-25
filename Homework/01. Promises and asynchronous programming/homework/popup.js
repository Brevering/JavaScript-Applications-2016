(function () {
    let div = document.getElementById('target'),
        btn = document.getElementById('btn');

    function showDiv() {
        btn.style.display = 'none';
        div.style.display = 'block';
    }

    function redirect() {
        window.location = 'http://google.com/';
    }

    let promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 4000);
    })

    
    function onError() {
        div.innerText = 'Unexpected error';
    }

    function onClick() {
        showDiv();

        promise
            .then(redirect)
            .catch(onError)
    }

    window.onload = btn.addEventListener('click', onClick, false);
} ())