function displayRestaurants(category) {
    var table = document.getElementById("restaurantsTable");
    var restaurantCount = 0;
    var message = "";
    message = category
    document.getElementById("summary").textContent = message;
    document.getElementById("parent").textContent = "";

    table.innerHTML = "";
    totalRestaurants = restaurant_array.length;
    for (var count = 0; count < totalRestaurants; count++) {
        if (restaurant_array[count]) {
            var thumbnail = restaurant_array[count].logo;
            var title = restaurant_array[count].name;
            var rating = restaurant_array[count].rating;
            var cell = '<div class="card col-md-3">' +
                '<img class="card-img-top" src="' + thumbnail + '" alt="Card image cap">' +
                '<div class="card-body">' +
                '<i class="far fa-comment fa-lg" style="float:left;cursor:pointer" data-toggle="modal" data-target="#commentModal" item="' + count + '" onClick="showRestaurantComments(this)"></i>' +
                '<h5 class="card-title" style="cursor:pointer; padding-left:30px;" data-toggle="modal" data-target="#restaurantModal" item="' + count + '" onClick="showRestaurantDetails(this)">Name:' + title + '</h5>' +
                '<h5 class="card-title" style="cursor:pointer; padding-left:30px;" data-toggle="modal" data-target="#restaurantModal" item="' + count + '" onClick="showRestaurantDetails(this)">Rating: ' + rating + '</h5>' +
                '</div>'
            '</div>'


            table.insertAdjacentHTML('beforeend', cell);
            restaurantCount++;
        }
    }


}

