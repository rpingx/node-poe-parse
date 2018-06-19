<template>
    <div class="form-group">
        <label class="col-md-2 control-label">
            <slot name="label"></slot>
        </label>
        <div class="col-md-8">
            <slot></slot>
        </div>
        <div class="col-md-2">
            <slot name="button"></slot>
        </div>
    </div>
</template>