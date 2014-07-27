Silverstripe frontend admin
=============================

A module for editing page content form the front end of your website using TinyMCE 4. (if you logged in and have edit permissions)
You can edit HTMLText db objects and Varchar db objects in the frontend.
A flyout menu containing the cms admin is also injected into the front end, so you can make changes in admin without leaving the front end.

##Requirements
* SilverStripe 3.x

##Installation
>###Composer
* On the command line, cd into your sites root folder
* Run `composer require gdmedia/silverstripe-frontend-admin dev-master`
* Run dev/build?flush=all in your browsers

>###Manually
* Download the module from https://github.com/gurudigital/frontend-admin/archive/master.zip
* Extract the files into your silverstripe root folder
* Run dev/build?flush=all in your browsers

##To do
* Test it more, especially around permissions

##Screenshots
####Admin closed, TinyMCE active
![Alt text](https://github.com/gurudigital/frontend-admin/raw/master/assets/screenshots/Silverstripe-Frontend-Editor-TinyMCE-4.png?raw=true?raw=true "Frontend editor open")

####Admin open
![Alt text](https://github.com/gurudigital/frontend-admin/raw/master/assets/screenshots/Silverstripe-Frontend-Admin.png?raw=true "Frontend admin open")

