var router = (() => {
    let navigo;

    function init() {
        navigo = new Navigo(null, false);

        navigo.on('/gallery', () => {            
                
                data.gallery.get()
                    .then(console.log)
                    .catch(console.log)            
        })
    }

    return {
        init
    }
})();

export { router };