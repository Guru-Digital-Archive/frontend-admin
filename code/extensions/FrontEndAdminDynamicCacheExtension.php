<?php

if (class_exists("DynamicCacheExtension")) {

    class FrontEndAdminDynamicCacheExtension extends DynamicCacheExtension {

        public function updateEnabled(&$enabled) {
            global $databaseConfig;
            if (Session::get("loggedInAs")) {
                if (!DB::getConn() && $databaseConfig) {
                    DB::connect($databaseConfig);
                }
                $enabled = !Injector::inst()->create('LeftAndMain')->canView();
            } else {
                $enabled = true;
            }
        }

    }

}