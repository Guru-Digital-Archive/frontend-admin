<?php

define('FRONTEND_ADMIN_DIR', basename(dirname(__FILE__)));

SS_Object::useCustomClass('Boolean', 'FrontEndBoolean', true);
SS_Object::useCustomClass('Enum', 'FrontEndEnum', true);
//SS_Object::useCustomClass('Image', 'FrontEndImage', true);
SS_Object::useCustomClass('HTMLText', 'FrontendEditorHTMLText', true);
SS_Object::useCustomClass('Text', 'FrontendEditorText', true);
SS_Object::useCustomClass('Varchar', 'FrontendEditorVarchar', true);

//Image::add_extension('FrontEndImageExtension');

SS_Object::add_extension('Page_Controller', 'FrontendEditingControllerExtension');
SS_Object::add_extension('Page', 'FrontendAdminPageExtension');

if (class_exists("DynamicCacheExtension")) {
    SS_Object::add_extension('DynamicCache', 'FrontEndAdminDynamicCacheExtension');
}
