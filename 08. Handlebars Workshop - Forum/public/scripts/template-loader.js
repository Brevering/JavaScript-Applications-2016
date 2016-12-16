const templateLoader = (() => {

    const cache = {};

    function get(templateName){
        return new Promise((resolve, reject) => {

        if (cache[templateName]){
            resolve(cache[templateName]);
        }
        else {
            
                $.get(`../templates/${templateName}.handlebars`)
                .done((data) => {
                    let template = Handlebars.compile(data);
                    cache[templateName] = template;
                    resolve(template);
                })
                .fail(reject); 
            }         
        })
    }


    return {
        get
    }
})();

export { templateLoader };