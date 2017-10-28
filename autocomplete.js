jQuery( document ).ready( function( $ ){

    var autocomplete = [];

    var selectors = [ {
        field: '#card_address',
        fills: {
            address: '#card_address',
            city: '#card_city',
            state: '[name="card_state"]',
            postal_code: '#card_zip',
            country: '#billing_country'
        }
    } ];

    var GConfig =  {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'short_name',
        postal_code: 'short_name'
    };

    var ask_geolocate = false;

    function InitAutoComplete( selectors ){
        $.each( selectors,  function( index, config ){

            var field = $( config.field );
            if ( ! field.length ) {
                return ;
            }

            var auto;
            // Create the autocomplete object, restricting the search to geographical
            // location types.
            auto = new google.maps.places.Autocomplete(
                field[0],
                {
                    //types: ['geocode', 'regions', 'address']
                    types: ['address']
                }
            );

            /*
            field.on( 'focus', function(){
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        console.log( position );
                        var geolocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        var geocoder = new google.maps.Geocoder();
                        geocoder.geocode( geolocation , function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[1]) {
                                    for (var i = 0; i < results.length; i++) {
                                        if (results[i].types[0] === "locality") {
                                            var city = results[i].address_components[0].short_name;
                                            var state = results[i].address_components[2].short_name;
                                            $("input[name='location']").val(city + ", " + state);
                                        }
                                    }
                                }
                                else {
                                    console.log("No reverse geocode results.")
                                }
                            }
                            else {
                                console.log("Geocoder failed: " + status)
                            }
                        });


                    });
                }
            } );
            */

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            auto.addListener('place_changed', function(){
                // Get the place details from the autocomplete object.
                var place = auto.getPlace();

                var data = {};
                $.each( GConfig, function( key, name_Type ){
                    data[ key ] = null;
                });
                // Get data From MAP
                if ( place.address_components.length ) {
                    for (var i = 0; i < place.address_components.length; i++) {
                        var addressType = place.address_components[i].types[0];
                        if (GConfig[addressType]) {
                            var val = place.address_components[i][GConfig[addressType]];
                            data[ addressType ] = val;
                        }
                    }
                }
                console.log( 'Pleace', place );
                console.log( 'V', data );


                $.each( config.fills, function( key, selector ){
                    var el = $( selector );
                    if ( el.prop("tagName") === 'SELECT' ) {
                        $( 'option', el ).removeAttr( 'selected' );
                    } else {
                        el.val( '' );
                    }

                    switch ( key ) {
                        case 'address':
                            if ( data.street_number && data.route ) {
                                el.val( data.street_number +' ' +data.route );
                            }
                            break;
                        case 'state':

                            if ( data.administrative_area_level_1 ) {
                                if ( el.prop("tagName") === 'SELECT' ) {
                                    $( 'option[value="'+data.administrative_area_level_1+'"]', el ).attr( 'selected', 'selected' );
                                } else {
                                    el.val( data.administrative_area_level_1 );
                                }
                            }

                            $( document.body ).on('edd_cart_billing_address_updated', function( ){
                                var el =  $( selector );
                                if ( el.prop("tagName") === 'SELECT' ) {
                                    $( 'option[value="'+data.administrative_area_level_1+'"]', el ).attr( 'selected', 'selected' );
                                } else {
                                    el.val( data.administrative_area_level_1 );
                                }
                            });

                            break;
                        case 'city':
                            if ( data.locality ) {
                                el.val( data.locality );
                            } else {
                                // administrative_area_level_1
                                el.val( data.administrative_area_level_1 );
                            }
                            break;
                        case 'postal_code':
                            el.val( data.postal_code );
                            break;
                        case 'country':
                            el.val( data.country ).trigger( 'change' );
                            break;
                    }
                }  );


            });

            autocomplete[ index ] = auto;



        } );




    }


    $( 'body' ).on( 'edd_gateway_loaded', function(){
        InitAutoComplete( selectors );
    } );



    function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} *
             *
             */
            (document.getElementById('autocomplete')),
            {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);
    }


    function geolocate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                autocomplete.setBounds(circle.getBounds());
            });
        }
    }

} );