Silverstripe frontend admin
=============================

A module for editing page content form the front end of your website using TinyMCE 4. (if you logged in and have edit permissions)
You can edit all HTMLText db objects ( and all Varchar db objects *Coming soon*) in the frontend.
A flyout menu containing the cms admin is also injected into the front end, so you can make changes in admin without leaving the front end

<h2>Requirements</h2>
<ul>
<li>SilverStripe 3.x</li>
</ul>

<h2>Installation</h2>
<h3>Composer</h3>
<ul>
<li>On the command line, cd into your sites root folder</li>
<li>run composer require gdmedia/silverstripe-frontend-admin dev-master</li>
<li>Run dev/build?flush=all in your browsers</li>
</ul>
<h3>Manually</h3>
<ul>
<li>Download the module from https://github.com/gurudigital/frontend-admin/archive/master.zip</li>
<li>Extract the files into your silverstripe root folder</li>
<li>Run dev/build?flush=all in your browsers</li>
</ul>

<h2>To do</h2>
<ul>
<li>Test it more, especially around permissions</li>
<li>Get media embed working</li>
</ul>
<h2>Known Issues</h2>
<ul>
<li>Embedding external media via the Silverstripe MediaFrom (such as youtube) does not work as expected.<br>When viewing the page, only the thumbnail shows.<br/>When editing a page with an embedded element, only the shortcode is shown</li>
</ul>

<h2>Screenshots</h2>
####Admin closed, TinyMCE active
![Alt text](assets/screenshots/Silverstripe-Frontend-Editor-TinyMCE-4.png?raw=true "Frontend editor open")

####Admin open
![Alt text](assets/screenshots/Silverstripe-Frontend-Admin.png?raw=true "Frontend admin open")

