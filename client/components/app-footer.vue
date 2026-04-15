<style lang="scss">
@import "../css/_globals";

.lpAppFooter {
    align-items: flex-end;
    color: #777;
    display: grid;
    gap: $spacingMedium;
    grid-template-columns: 1fr auto 1fr;
    margin-top: 150px;
    padding: 0 0 20px;
    position: relative;
    z-index: $aboveDialog;
}

.lpFooterRight {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    text-align: right;
}

.lpFooterContact {
    text-align: center;
}

.lpThemeControls {
    align-items: center;
    display: flex;
    gap: 12px;
}

.lpThemeButton {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    opacity: 0.75;
    padding: 2px;

    &:hover,
    &.lpActive {
        opacity: 1;
    }
}

.lpThemeToggle {
    background: #d9e1e8;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    height: 10px;
    padding: 0;
    position: relative;
    width: 25px;

    &::after {
        background: #fff;
        border-radius: 50%;
        content: "";
        height: 8px;
        left: 1px;
        position: absolute;
        top: 1px;
        transition: left $transitionDurationFast;
        width: 8px;
    }

    &.lpDark::after {
        left: 16px;
    }
}

.lpThemeSeparator {
    color: #999;
}
</style>

<template>
    <div class="lpAppFooter">
        <div class="lpFooterCredits">
            Site by <a class="lpHref" href="https://www.github.com/tjuuljensen/lighterpack" target="_blank" rel="noopener noreferrer">tjuuljensen</a>.</br> 
            Based on <a class="lpHref" href="https://github.com/galenmaly/lighterpack" target="_blank" rel="noopener noreferrer">LighterPack</a> by Galen Maly and <a class="lpHref" href="https://github.com/galenmaly/lighterpack/graphs/contributors" target="_blank" rel="noopener noreferrer">friends</a>.
        </div>

        <div class="lpFooterContact">
            Copyleft 2019
            <span class="lpThemeSeparator">-</span>
            <a class="lpHref" href="https://github.com/tjuuljensen/lighterpack/issues">Contact</a>
        </div>

        <div class="lpFooterRight">
            <div class="lpFooterVersion">
                v{{ version }}
            </div>
            <div class="lpThemeControls" aria-label="Theme controls">
                <button class="lpThemeButton" type="button" title="Use system theme" aria-label="Use system theme" @click="setTheme('system')">&#8635;</button>
                <button :class="{'lpThemeButton': true, lpActive: theme === 'light'}" type="button" title="Light mode" aria-label="Light mode" @click="setTheme('light')">&#9728;</button>
                <button :class="{'lpThemeToggle': true, lpDark: activeTheme === 'dark'}" type="button" title="Toggle dark mode" aria-label="Toggle dark mode" @click="toggleTheme" />
                <button :class="{'lpThemeButton': true, lpActive: theme === 'dark'}" type="button" title="Dark mode" aria-label="Dark mode" @click="setTheme('dark')">&#9790;</button>
            </div>
        </div>
    </div>
</template>

<script>
const packageInfo = require('../../package.json');

const themeStorageKey = 'lighterpackTheme';

export default {
    name: 'AppFooter',
    data() {
        return {
            theme: 'system',
            systemTheme: 'light',
        };
    },
    computed: {
        version() {
            return packageInfo.version;
        },
        activeTheme() {
            if (this.theme === 'system') {
                return this.systemTheme;
            }
            return this.theme;
        },
    },
    beforeMount() {
        this.theme = localStorage.getItem(themeStorageKey) || 'system';
        this.setSystemTheme();
        this.applyTheme();

        if (window.matchMedia) {
            this.systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            if (this.systemThemeQuery.addEventListener) {
                this.systemThemeQuery.addEventListener('change', this.onSystemThemeChange);
            } else if (this.systemThemeQuery.addListener) {
                this.systemThemeQuery.addListener(this.onSystemThemeChange);
            }
        }
    },
    beforeDestroy() {
        if (!this.systemThemeQuery) {
            return;
        }
        if (this.systemThemeQuery.removeEventListener) {
            this.systemThemeQuery.removeEventListener('change', this.onSystemThemeChange);
        } else if (this.systemThemeQuery.removeListener) {
            this.systemThemeQuery.removeListener(this.onSystemThemeChange);
        }
    },
    methods: {
        setTheme(theme) {
            this.theme = theme;
            if (theme === 'system') {
                localStorage.removeItem(themeStorageKey);
            } else {
                localStorage.setItem(themeStorageKey, theme);
            }
            this.applyTheme();
        },
        toggleTheme() {
            this.setTheme(this.activeTheme === 'dark' ? 'light' : 'dark');
        },
        setSystemTheme() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.systemTheme = 'dark';
            } else {
                this.systemTheme = 'light';
            }
        },
        onSystemThemeChange(evt) {
            this.systemTheme = evt.matches ? 'dark' : 'light';
            if (this.theme === 'system') {
                this.applyTheme();
            }
        },
        applyTheme() {
            document.documentElement.classList.toggle('lpThemeDark', this.activeTheme === 'dark');
            document.documentElement.classList.toggle('lpThemeLight', this.activeTheme === 'light');
            bus.$emit('themeChanged');
        },
    },
};
</script>
