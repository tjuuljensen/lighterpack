<style lang="scss">
@import "../css/_globals";

.lpPreviewButton {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font: inherit;
    font-weight: 600;
    padding: 0;

    &:hover {
        color: $blue1;
    }
}

.lpPreviewGlyph {
    color: currentColor;
    display: inline-block;
    height: 14px;
    margin-right: 5px;
    position: relative;
    top: 2px;
    width: 14px;
}

.lpPreviewGlyphEye {
    border: 2px solid currentColor;
    border-radius: 10px 2px;
    transform: rotate(45deg) scale(0.85);

    &::after {
        background: currentColor;
        border-radius: 50%;
        content: "";
        height: 4px;
        left: 3px;
        position: absolute;
        top: 3px;
        width: 4px;
    }
}

.lpPreviewGlyphEdit {
    background: currentColor;
    border-radius: 2px;
    height: 4px;
    transform: rotate(-45deg);
    width: 14px;

    &::after {
        border-bottom: 2px solid transparent;
        border-left: 4px solid currentColor;
        border-top: 2px solid transparent;
        content: "";
        position: absolute;
        right: -4px;
        top: 0;
    }
}
</style>

<template>
    <span v-if="isSignedIn" class="headerItem">
        <button class="lpPreviewButton" type="button" @click="togglePreviewMode">
            <i :class="['lpPreviewGlyph', previewMode ? 'lpPreviewGlyphEdit' : 'lpPreviewGlyphEye']" />
            {{ previewMode ? 'Edit' : 'Preview' }}
        </button>
    </span>
</template>

<script>
export default {
    name: 'PreviewToggle',
    computed: {
        isSignedIn() {
            return this.$store.state.loggedIn;
        },
        previewMode() {
            return this.$store.state.previewMode;
        },
    },
    methods: {
        togglePreviewMode() {
            this.$store.commit('togglePreviewMode');
        },
    },
};
</script>
