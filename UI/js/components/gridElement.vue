
<template>
    <div class="col-sm-6 col-xs-12">
        <div class="row">
            <div class="col-xs-3">
                <label class="control-label" style="text-align: left;"><slot name="label"></slot></label>
            </div>
            <div class="col-xs-8">
                <div class="form-group btn-group" style="width: 100%;">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>