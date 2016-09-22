
(function () {
    
    var myPromise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((pos) => {
            resolve(pos);
        })
    });
    function parsePosition(pos) {
        
        return {
            lat: pos.coords.latitude,
            long: pos.coords.longitude,            
        };
    }
    function displayMap(pos){              
        var src = `http://maps.googleapis.com/maps/api/staticmap?center=${pos.lat},${pos.long}&zoom=17&size=500x500&sensor=false`;        
        map = document.getElementById('map');
        map.setAttribute('src', src);     
        return map;    
    }

    

    myPromise
        .then(parsePosition)
        .then(displayMap)      
        .catch(function(error){
            console.log(error);                        
        });
} ());