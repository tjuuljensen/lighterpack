<style lang="scss">
@import "../css/_globals";

#listDescriptionContainer {
    margin: 25px 0;

    &.lpPreviewDescription {
        margin: 25px 0 35px;
    }

    h3,
    p {
        display: inline-block;
        margin: 0 0 5px;
    }

    h3 {
        margin-right: 10px;
    }

    textarea {
        min-height: 65px;
        width: 100%;
    }
}

.lpMarkdownPreview {
    p {
        margin: 0 0 5px;
    }

    h2 {
        border-bottom: 1px solid #aaa;
    }

    hr {
        border: 0;
        border-top: 1px solid #aaa;
        margin: 25px 0;
    }

    *:last-child {
        margin-bottom: 0;
    }
}

#getStarted {
    background: darken($background1, 10%);
    display: flex;
    flex-direction: column;
    height: 220px;
    justify-content: center;
    line-height: 1.6;
    padding: $spacingLarge;

    h2 {
        font-size: 24px;
        line-height: 1;
    }

    h2,
    p,
    ol {
        margin: 0 0 $spacingMedium;

        &:last-child {
            margin-bottom: 0;
        }
    }
}

</style>

<template>
    <div :class="{'lpListBody': true, lpPreviewMode: isPreviewMode}">
        <div v-if="isListNew && !isPreviewMode" id="getStarted">
            <h2>Welcome to LighterPack!</h2>
            <p>Here's what you need to get started:</p>
            <ol>
                <li>Click on things to edit them. Give your list and category a name.</li>
                <li>Add new categories and give items weights to start the visualization.</li>
                <li v-if="!isLocalSaving">
                    When you're done, share your list with others!
                </li>
            </ol>
            <p v-if="isLocalSaving" class="lpWarning">
                <strong>Note:</strong> Your data is being saved to your local computer. In order to share your lists please register an account.
            </p>
        </div>
        <list-summary v-if="!isListNew || isPreviewMode" :list="list" />


        <div style="clear: both;" />

        <div v-if="shouldShowListDescription" id="listDescriptionContainer" :class="{lpPreviewDescription: isPreviewMode}">
            <h3 v-if="!isPreviewMode">List Description</h3> <p v-if="!isPreviewMode">(<a href="https://guides.github.com/features/mastering-markdown/" target="_blank" class="lpHref">Markdown</a> supported)</p>
            <textarea v-if="!isPreviewMode" id="listDescription" v-model="list.description" v-autogrow @input="updateListDescription" />
            <div v-if="isPreviewMode" class="lpMarkdownPreview" v-html="renderedDescription" />
        </div>

        <ul class="lpCategories">
            <category v-for="category in categories" :key="category.id" :category="category" />
        </ul>

        <hr v-if="!isPreviewMode">

        <a v-if="!isPreviewMode" class="lpAdd addCategory" @click="newCategory"><i class="lpSprite lpSpriteAdd" />Add new category</a>
    </div>
</template>

<script>
import category from './category.vue';
import listSummary from './list-summary.vue';

const renderMarkdown = require('../utils/markdown.js');
const dragula = require('dragula');

export default {
    name: 'List',
    components: {
        listSummary,
        category,
        categoryDragStartIndex: false,
        itemDragId: false,
    },
    mixins: [],
    data() {
        return {
            onboardingCompleted: false,
            itemDrake: null,
            categoryDrake: null,
        };
    },
    computed: {
        library() {
            return this.$store.state.library;
        },
        list() {
            return this.$store.getters.activeList;
        },
        categories() {
            return this.list.categoryIds.map(id => this.library.getCategoryById(id));
        },
        isListNew() {
            return this.list.totalWeight === 0;
        },
        isLocalSaving() {
            return this.$store.state.saveType === 'local';
        },
        isPreviewMode() {
            return this.$store.state.previewMode;
        },
        renderedDescription() {
            return renderMarkdown(this.list.description);
        },
        shouldShowListDescription() {
            if (this.isPreviewMode) {
                return Boolean(this.list.description);
            }
            return this.library.optionalFields['listDescription'];
        },
    },
    watch: {
        categories() {
            Vue.nextTick(() => {
                this.handleItemReorder();
            });
        },
        isPreviewMode() {
            Vue.nextTick(() => {
                if (this.isPreviewMode) {
                    this.destroyDragHandlers();
                } else {
                    this.handleCategoryReorder();
                    this.handleItemReorder();
                }
            });
        },
    },
    mounted() {
        this.handleCategoryReorder();
        this.handleItemReorder();
    },
    methods: {
        newCategory() {
            this.$store.commit('newCategory', this.list);
        },
        updateListDescription() {
            this.$store.commit('updateListDescription', this.list);
        },
        handleItemReorder() {
            if (this.isPreviewMode) {
                return;
            }
            if (this.itemDrake) {
                this.itemDrake.destroy();
            }
            const $categoryItems = Array.prototype.slice.call(document.getElementsByClassName('lpItems'));
            const drake = dragula($categoryItems, {
                moves($el, $source, $handle, $sibling) {
                    return $handle.classList.contains('lpItemHandle');
                },
                accepts($el, $target, $source, $sibling) {
                    if (!$sibling || $sibling.classList.contains('lpItemsHeader')) {
                        return false; // header and footer are technically part of this list - exclude them both.
                    }
                    return true;
                },
            });
            drake.on('drag', ($el, $target, $source, $sibling) => {
                this.itemDragId = parseInt($el.id); // fragile
            });
            drake.on('drop', ($el, $target, $source, $sibling) => {
                const categoryId = parseInt($target.parentElement.id); // fragile
                this.$store.commit('reorderItem', {
                    list: this.list, itemId: this.itemDragId, categoryId, dropIndex: getElementIndex($el) - 1,
                });
                drake.cancel(true);
            });
            this.itemDrake = drake;
        },
        handleCategoryReorder() {
            if (this.isPreviewMode) {
                return;
            }
            if (this.categoryDrake) {
                this.categoryDrake.destroy();
            }
            const $categories = document.getElementsByClassName('lpCategories')[0];
            const drake = dragula([$categories], {
                moves(el, $source, $handle, $sibling) {
                    return $handle.classList.contains('lpCategoryHandle');
                },
            });
            drake.on('drag', ($el, $target, $source, $sibling) => {
                this.categoryDragStartIndex = getElementIndex($el);
            });
            drake.on('drop', ($el, $target, $source, $sibling) => {
                this.$store.commit('reorderCategory', { list: this.list, before: this.categoryDragStartIndex, after: getElementIndex($el) });
                drake.cancel(true);
            });
            this.categoryDrake = drake;
        },
        destroyDragHandlers() {
            if (this.itemDrake) {
                this.itemDrake.destroy();
                this.itemDrake = null;
            }
            if (this.categoryDrake) {
                this.categoryDrake.destroy();
                this.categoryDrake = null;
            }
        },
    },
};
</script>
