import { data } from './data.js';
import { templateLoader as tl} from './template-loader.js';

var router = (() => {
    let navigo;

    function init() {
        navigo = new Navigo(null, false);

        navigo.on('/threads', () => {
            Promise.all([data.threads.get(), tl.get('threads')])                                            
            .then(([data, template]) => {
                console.log(data);
                $('#content').html(template(data))})
            .then(console.log)
            .catch(console.log)
        })
        .on('/gallery', () => {
            Promise.all([data.gallery.get(), tl.get('gallery')])                                            
            .then(([data, template]) => $('#content').html(template(data)))
            .catch(console.log)            
        })
    }

    return {
        init
    }
})();

export { router };