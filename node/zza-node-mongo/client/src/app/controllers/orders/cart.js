﻿(function(angular) {
    'use strict';

    angular.module("app")
           .controller( 'cart', cart );

        // **************************************
        // Annotated construction function
        // **************************************

        function cart( dataservice, pricing)
        {
            var vm   = this;
            var cart = dataservice.cartOrder;

                vm.hasExtraCost= false;
                vm.cartOrder   = cart;
                vm.updateCosts = calculateCosts;
                vm.removeItem  = removeItem;

            dataservice.ready( calculateCosts );

            calculateCosts();

            // *********************************************************
            // Internal methods
            // *********************************************************

            function calculateCosts()
            {
                cart = dataservice.cartOrder;

                vm.haveItems = (cart.orderItems.length > 0);
                if ( vm.haveItems )
                {
                    var total = pricing.calcOrderItemsTotal( cart );
                    vm.hasExtraCost = pricing.orderHasExtraCostOptions( cart );
                }
            }

            function removeItem( item )
            {
                //don't need to remove if item is an entity (e.g, SQL version)
                dataservice.cartOrder.removeItem(item);
                dataservice.draftOrder.addItem(item);

                calculateCosts();
            }
        }

})(this.angular);