<?php

/**
 *
 * @see https://github.com/michelsteege/silverstripe-frontend-editing
 */
class FrontendEditorHTMLText extends HTMLText
{

    /**
     * Set the value on the field.
     * Optionally takes the whole record as an argument,
     * to pick other values.
     *
     * @param mixed $value
     * @param array $record
     */
    public function setValue($value, $record = null)
    {
        FrontendEditing::setValue($this, $value, $record);
        parent::setValue($value, $record);
    }

    /**
     * Returns the string which will be used in the template
     * @return string
     */
    public function forTemplate()
    {
        $isEditable = FrontendEditing::editingEnabled() && FrontendEditing::isEditable($this);
        if ($isEditable) {
            $this->processShortcodes = false;
        }
        $value = parent::forTemplate();
        if ($isEditable) {
            $randId = uniqid();
            $value  = '<div id="'.$randId.'" contenteditable=true class="frontend-editable frontend-editable-html" data-feclass="'.FrontendEditing::getClassName($this).'" data-feid="'.FrontendEditing::getID($this).'" data-fefield="'.$this->name.'">'.$value.'</div>';
        }
        return $value;
    }
}