<style lang="scss">

#importJSONValidate {
    width: 420px;
}

#json {
    height: 1px;
    left: -999px;
    overflow: hidden;
    position: absolute;
    width: 1px;
}

</style>

<template>
    <div id="importJSON">
        <modal id="importJSONValidate" :shown="shown" @hide="shown = false">
            <h2>Confirm your import</h2>
            <div id="importJSONData">
                <p>
                    Import "{{ listName }}" with {{ importData.categories.length }} categories and {{ importData.items.length }} items.
                </p>
            </div>
            <a id="importJSONConfirm" class="lpButton" @click="importList">Import List</a>
            <a class="lpButton close" @click="shown = false">Cancel Import</a>
        </modal>
        <form id="jsonUpload">
            <input id="json" type="file" name="json" accept="application/json,.json">
        </form>
    </div>
</template>

<script>
import modal from './modal.vue';

export default {
    name: 'ImportJson',
    components: {
        modal,
    },
    data() {
        return {
            jsonInput: false,
            importData: {
                list: {},
                categories: [],
                items: [],
            },
            shown: false,
        };
    },
    computed: {
        listName() {
            return this.importData.list.name || 'New list';
        },
    },
    mounted() {
        this.jsonInput = document.getElementById('json');
        this.jsonInput.onchange = this.importJSON;

        bus.$on('importJSON', () => {
            this.jsonInput.click();
        });
    },
    methods: {
        importJSON(evt) {
            const file = evt.target.files[0];

            if (!file) {
                return;
            }
            if (file.size > 1000000) {
                alert('File is too big');
                return;
            }
            if (file.name.substring(file.name.length - 5).toLowerCase() !== '.json') {
                alert('Please select a JSON file.');
                return;
            }

            const reader = new FileReader();

            reader.onload = ((theFile) => {
                this.validateImport(theFile.target.result);
                this.jsonInput.value = '';
            });

            reader.readAsText(file);
        },
        validateImport(input) {
            let importData;

            try {
                importData = JSON.parse(input);
            } catch (err) {
                alert('Unable to load JSON - please verify the format.');
                return;
            }

            if (!importData || importData.type !== 'lighterpack-list' || !importData.list || !Array.isArray(importData.list.categoryIds) || !Array.isArray(importData.categories) || !Array.isArray(importData.items)) {
                alert('Unable to load JSON - please verify the format.');
                return;
            }

            this.importData = importData;
            this.shown = true;
        },
        importList() {
            try {
                this.$store.commit('importJSON', this.importData);
                this.shown = false;
            } catch (err) {
                alert('Unable to import JSON - please verify the format.');
            }
        },
    },
};
</script>
