(function( angular ) {
    'use strict';

    angular.module( "app" )
           .config( routeStates )
           .run(reportStateChanges);

    function routeStates($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('app',
            {
                url: '',
                views: {
                    'header': {
                        templateUrl: 'app/views/header.html'
                    },
                    'content': {
                        templateUrl: 'app/views/welcome.html'
                    },
                    'footer': {
                        templateUrl: 'app/views/footer.html'
                    }
                }
            })
                .state( 'app.welcome',
                {
                    url : '/welcome',
                    views : {
                        'content@' : {
                            templateUrl: 'app/views/welcome.html'
                        }
                    }
                })
                .state( 'app.about',
                {
                    url : '/about',
                    views : {
                        'content@' : {
                            templateUrl: 'app/views/about.html'
                        }
                    }
                })
                .state( 'app.order',
                {
                    // This is the shell layout for the Order dashboard (e.g. order.html)
                    // which has an orderSidebar area and an order content area
                    url : '/order',
                    views : {
                        'content@' : {
                            templateUrl: 'app/views/orders/order.html'
                        },
                        'orderSidebar@app.order' : {
                            templateUrl: 'app/views/orders/orderSidebar.html'
                        },
                        'content@app.order' : {
                            // NOTE: Blank until filled by a more specific app.order state
                        }
                    }
                })
                    .state( 'app.order.item',
                    {
                        // An OrderItem editor state
                        // The state the user picks an OrderItem from one of the orders
                        url : '/:orderId/:productType/:orderItemId',
                        views : {
                            'content@app.order' : {
                                templateUrl : 'app/views/orders/orderItem.html'
                            }
                        }
                    })
                    .state( 'app.order.product',
                    {
                        // An OrderItem editor state
                        // The state after a user picks a product from a product menu
                        url : '^/menu/:productType/:productId',
                        views : {
                            'content@app.order' : {
                                templateUrl : 'app/views/orders/orderItem.html'
                            }
                        }
                    })
                    .state( 'app.order.cart',
                    {
                        // This state shows the Cart items list view
                        url : '/cart',
                        views : {
                            'content@app.order' : {
                                templateUrl : 'app/views/orders/cart.html'
                            }
                        }
                    })

                .state( 'app.menu',
                {
                    // This state shows the Product listings (pizzas, salads, drinks)
                    // from which a product can be selected; selection navigates to the
                    // the produce details page.
                    url: '/menu/:productType',
                    views : {
                        'content@' : {
                            templateUrl: 'app/views/menu/menu.html'
                        },
                        'orderSidebar@app.menu' : {
                            templateUrl: 'app/views/orders/orderSidebar.html'
                        }
                    }
                });

        $urlRouterProvider
            .when( '/menu', '/menu/pizza'  ) // Switch to Pizza listing view
            .otherwise('/menu/pizza');       // Return to the main ordering screen
    }

    function reportStateChanges($rootScope, $log, config){
        if (config.debug) {
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    $log.log("stateChangeStart: from '"+fromState.name + "' to '"+ toState.name+"'");
                });

            $rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState, fromParams, error){
                    $log.log("stateChangeError: from '"+fromState.name + "' to '"+ toState.name+"' with error: "+error);
                });

            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams){
                    $log.log("stateChangeSuccess: from '"+fromState.name + "' to '"+ toState.name+"'");
                });
        }
    }

}( this.angular ));