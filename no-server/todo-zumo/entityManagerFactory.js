/*
 * entityManagerFactory creates the model and delivers a new EntityManager
 */
(function (){
    'use strict';
    angular.module('app').factory('entityManagerFactory',
        ['$q', 'breeze', 'config', 'wip-service', service]);

    function service($q, breeze, config, wip){
        var manager;
        configureBreeze();

        var emFactory =  {
            getEntityManager: getEntityManager
        };
        return emFactory;
        //////////////////////
        function configureBreeze(){
            // use Breeze Labs mobile services dataservice adapter to query and save
            var adapter = breeze.config.initializeAdapterInstance('dataService', 'azure-mobile-services', true);
            adapter.mobileServicesInfo = {url: config.appUrl, appKey: config.appKey};
            adapter.Q = $q;
        }

        function getEntityManager(){
            if (!manager) {
                var serviceName = config.appUrl + "tables/";
                manager =  new breeze.EntityManager(serviceName);
                setMetadata(manager);
                wip.initialize(manager, 'TodoItem');
            }
            return manager;
        }

        function setMetadata(manager) {
            var store = manager.metadataStore;
            var helper = new breeze.config.MetadataHelper('model', breeze.AutoGeneratedKeyType.Identity);
            var DT = breeze.DataType;
            store.addDataService(manager.dataService);
            addTodoItem();

            function addTodoItem() {
                var et = {
                    name: "TodoItem",
                    defaultResourceName: "TodoItem",
                    dataProperties: {
                        id:       { dataType: DT.Guid },
                        text:     { maxLength: 50, nullOk: false  },
                        complete: { dataType: DT.Boolean, nullOk: false }
                    }
                };
                helper.addTypeToStore(store, et);

                /**********************************************
                 * Add non-persistent ("unmapped") members:
                 * ---------------------------------------
                 * read-only 'entityStateName' indicating the entity's change-state
                 * Two styles:
                 *   ES5 defineProperty (via Object.defineProperty)
                 *   function on prototype
                 **********************************************/
                function TodoItem(){
                    // ES5 defineProperty, bind to entityStateName
                    Object.defineProperty(this, 'entityStateName', {
                        enumerable: true,
                        get: function(){
                            return this.entityAspect ? this.entityAspect.entityState.name: 'Detached';}
                    });
                };
                // Style #2: function on the prototype, bind to entityStateName()
                //TodoItem.prototype.entityStateName = function(){return this.entityAspect.entityState.name};
                store.registerEntityTypeCtor('TodoItem', TodoItem);
                return et;
            }
        }
    }
})();
