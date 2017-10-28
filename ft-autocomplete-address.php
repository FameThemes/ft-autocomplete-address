<?php
/*
Plugin Name: FT Autocomplete Address
Plugin URL: https://www.famethemes.com/
Description: Add Google address suggestions autocomplete for any field.
Version: 1.0.0
Author: FameThemes, shrimp2t
Author URI: https://www.famethemes.com/
*/

class FT_Autocomplete_Address {
    function __construct()
    {
        add_action( 'wp_enqueue_scripts', array( $this, 'scripts' ) );
    }

    function scripts(){
        wp_enqueue_script( 'google-map', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBCbxvAvej2OjLp6vW3SITGRuP7fRBobAQ&libraries=places' );
        wp_enqueue_script( 'ft-autocomplete-address', plugins_url('autocomplete.js', __FILE__) );
    }
}

new FT_Autocomplete_Address();