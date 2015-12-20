<?php

if (class_exists("DynamicCacheExtension")) {
    class FrontEndAdminDynamicCacheExtension extends DynamicCacheExtension
    {

        public function updateEnabled(&$enabled)
        {
            if ($enabled && Session::get("loggedInAs")) {
                $this->checkAndConnectDB();
                $enabled = !Injector::inst()->create('LeftAndMain')->canView();
            }
        }

        private function checkAndConnectDB()
        {
            global $databaseConfig;
            if (!DB::getConn() && $databaseConfig) {
                DB::connect($databaseConfig);
            }
        }
    }
}
