<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <title></title>
        <% base_tag %>
    </head>
    <body class="$CSSClasses" style="background: url(framework/admin/images/textures/bg_cms_main_content.png) #e6eaed;">
        <div class='cms ui-dialog' style="width: 100%; border: none !important; border-radius: 0; position: relative">
            <div class='htmleditorfield-dialog htmleditorfield-mediadialog ui-dialog-content ui-widget-content'>
                <% with $EditorToolbar %>
                <% if $Up.fromType=="MediaForm" %>
                $MediaForm
                <% else_if $Up.fromType=="LinkForm" %>
                $LinkForm
                <% end_if %>
                <% end_with %>
            </div>
        </div>
        <a id="linkHolder" href="" style="display: none"></a>
        <img id="imageHolder" src="" style="display: none"/>
    </body>
</html>