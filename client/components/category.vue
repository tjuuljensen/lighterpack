<style lang="scss">

.lpQtySubtotal {
    padding-right: 25px; /* Accommodates delete column */
}

.lpPriceSubtotal { /* unused? */
    padding-right: 4px;
}

.lpPreviewMode {
    h2.lpCategoryName {
        font-size: 18px;
        margin: 0;
    }

    .lpItemsFooter {
        .lpQtySubtotal {
            padding-right: 0;
        }
    }
}

</style>

<template>
    <li :id="category.id" class="lpCategory">
        <ul class="lpItems lpDataTable">
            <li class="lpHeader lpItemsHeader">
                <span v-if="!isPreviewMode" class="lpHandleCell">
                    <div class="lpHandle lpCategoryHandle" title="Reorder this category" />
                </span>
                <input v-if="!isPreviewMode" v-focus-on-create="category._isNew" type="text" :value="category.name" placeholder="Category Name" class="lpCategoryName lpSilent" @input="updateCategoryName">
                <h2 v-if="isPreviewMode" class="lpCategoryName">{{ category.name }}</h2>
                <span v-if="library.optionalFields['price']" class="lpPriceCell">Price</span>
                <span class="lpWeightCell">Weight</span>
                <span class="lpQtyCell">qty</span>
                <span v-if="!isPreviewMode" class="lpRemoveCell"><a class="lpRemove lpRemoveCategory" title="Remove this category" @click="removeCategory(category)"><i class="lpSprite lpSpriteRemove" /></a></span>
            </li>
            <item v-for="itemContainer in itemContainers" :key="itemContainer.item.id" :item-container="itemContainer" :category="category" />
            <li class="lpFooter lpItemsFooter">
                <span v-if="!isPreviewMode" class="lpAddItemCell">
                    <a class="lpAdd lpAddItem" @click="newItem"><i class="lpSprite lpSpriteAdd" />Add new item</a>
                </span>
                <span v-if="library.optionalFields['price']" class="lpPriceCell lpNumber lpSubtotal">
                    {{ category.subtotalPrice | displayPrice(library.currencySymbol) }}
                </span>
                <span class="lpWeightCell lpNumber lpSubtotal">
                    <span class="lpDisplaySubtotal">{{ category.subtotalWeight | displayWeight(library.totalUnit) }}</span>
                    <span class="lpSubtotalUnit lpWeightUnit">{{ library.totalUnit }}</span>
                </span>
                <span class="lpQtyCell lpSubtotal">
                    <span class="lpQtySubtotal">{{ category.subtotalQty }}</span>
                </span>
                <span v-if="!isPreviewMode" class="lpRemoveCell" />
            </li>
        </ul>
    </li>
</template>

<script>
import item from './item.vue';

const utilsMixin = require('../mixins/utils-mixin.js');

export default {
    name: 'Category',
    components: {
        item,
    },
    mixins: [utilsMixin],
    props: ['category'],
    computed: {
        library() {
            return this.$store.state.library;
        },
        itemContainers() {
            return this.category.categoryItems
                .filter(categoryItem => !this.library.optionalFields.hideZeroQty || parseFloat(categoryItem.qty) !== 0)
                .map(categoryItem => ({ categoryItem, item: this.library.getItemById(categoryItem.itemId) }));
        },
        isPreviewMode() {
            return this.$store.state.previewMode;
        },
    },
    methods: {
        newItem() {
            this.$store.commit('newItem', { category: this.category, _isNew: true });
        },
        updateCategoryName(evt) {
            this.$store.commit('updateCategoryName', { id: this.category.id, name: evt.target.value });
        },
        removeCategory(category) {
            const callback = function () {
                this.$store.commit('removeCategory', category);
            };
            const speedbumpOptions = {
                body: 'Are you sure you want to delete this category? This cannot be undone.',
            };
            bus.$emit('initSpeedbump', callback, speedbumpOptions);
        },
    },
};
</script>
