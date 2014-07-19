<?php

//Object::useCustomClass('HTMLText', 'FrontendEditingHTMLText', true);
//Object::useCustomClass('Varchar', 'FrontendEditingVarchar', true);

Object::add_extension('Page_Controller', 'FrontendAdminControllerExtension');
Object::add_extension('Page', 'FrontendEditingPageExtension');
