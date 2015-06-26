<?php

if (class_exists("DynamicCacheExtension")) {

    class FrontEndAdminDynamicCacheExtension extends DynamicCacheExtension {

        public function updateEnabled(&$enabled) {
            if ($enabled) {
                if (Session::get("loggedInAs")) {
                    $this->checkAndConnectDB();
                    $enabled = !Injector::inst()->create('LeftAndMain')->canView();
                } else {
                    $enabled = true;
                }
            }
        }

        private function checkAndConnectDB() {
            global $databaseConfig;
            if (!DB::getConn() && $databaseConfig) {
                DB::connect($databaseConfig);
            }
        }

    }

}