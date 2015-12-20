<?php

/**
 *
 * @see https://github.com/michelsteege/silverstripe-frontend-editing
 */
class FrontendEditorText extends Text
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
        $value = parent::forTemplate();
        if (FrontendEditing::editingEnabled() && FrontendEditing::isEditable($this)
                // If this is a link, its probably in a href, so dont wrap it
                // Whish there was a way to tell if fields are being rendered in an HTML attribute
                && $this->Name !== "Link") {
            $value = '<span class="frontend-editable frontend-editable-text" data-feclass="' . FrontendEditing::getClassName($this) . '" data-feid="' . FrontendEditing::getID($this) . '" data-fefield="' . $this->name . '">' . $value . '</span>';
        }
        return $value;
    }
}
