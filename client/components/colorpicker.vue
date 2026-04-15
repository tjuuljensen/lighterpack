<style lang="scss">
.lpColorPickerContent {
    text-align: center;
}

.lpColorPickerHex {
    margin-top: 8px;
    width: 82px;
}
</style>

<template>
    <Popover id="lpPickerContainer" :shown="shown" @hide="shown = false">
        <span slot="target" class="lpLegend" :style="{'background-color': color}" @click="shown = true" />
        <div slot="content" class="lpColorPickerContent">
            <VueColorPicker :width="150" :height="150" :disabled="false" :start-color="color" :value="hexColor" @color-change="onColorChange" />
            <input
                v-model="hexColor"
                class="lpColorPickerHex"
                type="text"
                maxlength="7"
                placeholder="#000000"
                aria-label="HTML color code"
                @change="onHexColorChange"
                @keyup.enter="onHexColorChange"
            >
        </div>
    </Popover>
</template>

<script>
import VueColorPicker from 'vue-color-picker-wheel';
import Popover from './popover.vue';

export default {
    name: 'ColorPicker',
    components: {
        VueColorPicker,
        Popover,
    },
    props: [
        'color',
    ],
    data() {
        return {
            shown: false,
            hexColor: this.normalizeHexColor(this.color) || '#000000',
        };
    },
    watch: {
        color(newColor) {
            const hexColor = this.normalizeHexColor(newColor);
            if (hexColor) {
                this.hexColor = hexColor;
            }
        },
    },
    methods: {
        onColorChange(newColor) {
            const hexColor = this.normalizeHexColor(newColor);
            if (!hexColor) {
                return;
            }

            this.hexColor = hexColor;
            this.$emit('colorChange', hexColor);
        },
        onHexColorChange() {
            const hexColor = this.normalizeHexColor(this.hexColor);
            if (!hexColor) {
                this.hexColor = this.normalizeHexColor(this.color) || '#000000';
                return;
            }

            this.hexColor = hexColor;
            this.$emit('colorChange', hexColor);
        },
        normalizeHexColor(color) {
            if (!color) {
                return null;
            }

            const match = String(color).trim().match(/^#?([a-f0-9]{3}|[a-f0-9]{6})$/i);
            if (!match) {
                return null;
            }

            let hex = match[1].toLowerCase();
            if (hex.length === 3) {
                hex = hex.split('').map((char) => `${char}${char}`).join('');
            }

            return `#${hex}`;
        },
    },
};

</script>
