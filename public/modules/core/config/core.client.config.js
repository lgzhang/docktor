'use strict';

// Configuring the Sites module
angular.module('sites').run(['Menus', 'Authentication',
    function (Menus, Authentication) {

        if (Authentication.user && Authentication.user.role && Authentication.user.role === 'admin') {
            Menus.addMenuItem('topbar', 'Admin', 'admin', 'dropdown', '/admin(.*)?');
            Menus.addSubMenuItem('topbar', 'admin', 'List Users', 'admin/users');
            Menus.addSubMenuItem('topbar', 'admin', 'List Daemons', 'admin/daemons');
            Menus.addSubMenuItem('topbar', 'admin', 'List Sites', 'admin/sites');
            Menus.addSubMenuItem('topbar', 'admin', 'List Services', 'admin/services');
            Menus.addSubMenuItem('topbar', 'admin', 'New Group', 'admin/groups/create');
        }
    }
]);