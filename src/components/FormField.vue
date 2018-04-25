<template>
  <b-form-select v-if="['select'].includes(field.type)" 
   :formatter="getFormatter(field, value)" :id="id" :options="options"
   v-bind="field" :value="selectedValue" @input="handleSelect" ></b-form-select> 
   
  <div v-else-if="['select2'].includes(field.type)">
    <b-select :name="name" @search="getAjaxOptions" label="text" v-bind="field" :options="options"
   :value="selectedValue" @input="handleSelect" :placeholder="field.placeholder || ''" selectLabel="" />
  </div>
  <b-tree-select v-else-if="['tree', 'treeselect'].includes(field.type)" v-bind="field" v-model="model" />
  <!-- <b-select v-if="['select', 'select2'].includes(field.type)" track-by="value" label="text" @input="model = arguments[0]" :id="id" v-bind="field" :title="value" /> -->
  <b-date-picker v-else-if="['date'].includes(field.type)" :name="name" v-bind="field" v-model="model" />

  <b-form-radio-group v-else-if="['radiolist'].includes(field.type)" :name="name" v-model="model">
    <b-form-radio :key="choice.value" :value="choice.value" v-for="choice in field.options">{{choice.text}}</b-form-radio>
  </b-form-radio-group>

  <b-form-checkbox-group :name="name" v-else-if="['checkboxlist'].includes(field.type)" v-model="model">
    <b-form-checkbox :key="choice.value" :value="choice.value" v-for="choice in field.options">{{choice.text}}</b-form-checkbox>
  </b-form-checkbox-group>

  <b-form-textarea :name="name" v-else-if="['textarea'].includes(field.type)" :id="id" v-model="model" v-bind="field" :rows="field.rows || 3" />

  <!-- <b-uploader v-else-if="['image', 'file', 'audio'].includes(field.type)" :id="id" v-model="model" v-bind="field" /> -->
  <component :is="field.autoUpload === false ? 'b-form-file' : 'b-form-uploader'" v-else-if="['image', 'file', 'audio', 'video'].includes(field.type)"
  :field="field" v-model="model" :id="id" :name="name" :parent="parent" />
  <div v-else-if="['switch', 'checkbox'].includes(field.type)">
    <b-switch variant="success" v-bind="field" pill type="3d" :id="id" v-model="model" />
  </div>

  <!-- <b-ueditor :state="state" v-else-if="['wysiwyg', 'html'].includes(field.type)" :id="id" v-bind="field" v-model="model" /> -->
  <b-html-editor :state="state" v-else-if="['wysiwyg', 'html'].includes(field.type)" :id="id" v-bind="field" v-model="model"
  :content="model" @change="model = arguments[0]" />

  <div v-else-if="['json'].includes(field.type)">
    <b-form-textarea :id="id" v-model="model" v-bind="field" :rows="field.rows || 5" />
     <!-- <v-jsoneditor v-if="model" :value="JSON.parse(model)" 
     @input="model = JSON.stringify(arguments[0])"
     :options="{}" /> -->
  </div>

  <div v-else-if="field.fields">
    <div v-if="['array'].includes(field.type) || field.is_array || parent.is_array">

      <b-table hover bordered :items="model" :fields="myFields" v-if="field.is_table || parent.is_table">
        <template v-for="(child, k) in myFields" :slot="k" slot-scope="row">
          <b-form-field v-model="model[row.index][k]" :name="k" :key="k" :field="child" :id="`input_${row.index}_${k}`" />
        </template>
        <template slot="HEAD__actions" slot-scope="row">
          <b-btn size="sm" @click="model.push({});">
            <i class="icon-plus"></i> {{$t('actions.add')}}
          </b-btn>
        </template>
        <template slot="_actions" slot-scope="row">
          <b-btn size="sm" @click="model.splice(row.index + 1, 0, {});">
            <i class="icon-plus"></i> {{$t('actions.add')}}
          </b-btn>
          <b-btn size="sm" @click="model.splice(row.index, 1);">
            <i class="icon-trash"></i> {{$t('actions.delete')}}
          </b-btn>
        </template>
      </b-table>
      
      <b-draggable v-model="model" v-else>
        <transition-group tag="div" class="row">
          <b-col v-for="(item, i) in model" :key="i" cols :lg="field.item_cols || 6">
            <b-card>
              <b-row slot="header" class="justify-content-between">
                <b-col>No. {{i + 1}}</b-col>
                <b-col right class="text-right">
                  <b-btn size="sm" @click="model.splice(i, 1)">
                    <i class="icon-trash"></i> {{$t('actions.delete')}}</b-btn>
                </b-col>
              </b-row>

              <b-form-group v-for="(child, key) in myFields" :key="key" v-bind="child" :label-for="`input_${name}_${i}_${key}`">
                <b-form-field v-model="model[i][key]" :parent="parent" :name="`${name}.${i}.${key}`" :field="child" :id="`input_${name}_${i}_${key}`" />
              </b-form-group>
            </b-card>
          </b-col>
          <b-col cols :lg="field.item_cols || 6" :key="-1" class="d-flex align-items-center justify-content-center">
            <b-btn size="lg" class="p-5" block @click="model = !model? [] : model; model.push({})">
              <i class="fa fa-plus"></i>
            </b-btn>
          </b-col>
        </transition-group>
      </b-draggable>
    </div>

    <div v-else-if="['object'].includes(field.type)">
      <b-card>
        <b-form-group v-for="(child, key) in myFields" :key="key" v-bind="child" :label-for="`input_${name}_${key}`">
          <b-form-field v-model="model[key]" :parent="parent" :name="key" :field="child" :id="`input_${name}_${key}`" />
        </b-form-group>
      </b-card>
    </div>
    <div v-else>
      <b-form-group v-for="(child, key) in myFields" :key="key" v-bind="child" :label-for="`input_${name}_${key}`">
        <b-form-field v-model="model[key]" :parent="parent" :name="key" :field="child" :id="`input_${name}_${key}`" />
      </b-form-group>
    </div>
  </div>

  <b-input-group v-else>
    <b-input-group-prepend is-text v-if="field.icon || field.left">
      <i :class="field.icon" v-if="field.icon"></i>
      <span v-else v-html="field.left"></span>
    </b-input-group-prepend>
    <b-form-input :state="state" :id="id" v-bind="field" v-model="model" :formatter="getFormatter(field, value)" />
  </b-input-group>
</template>

<script>
import BDraggable from "vuedraggable";
import BTreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.min.css"
// import BSelect from "vue-multiselect"
import BSelect from "vue-select";
// import "vue-multiselect/dist/vue-multiselect.min.css"
import BDatePicker from "vue2-datepicker";
// import BUeditor from "./UEditor"
import BFormUploader from "./FormUploader";
// import BJsonEditor  from "./JsonEditor"
// import BJsonEditor from "vue-jsoneditor"
import Vue from "vue";
import _ from "lodash";

// import "jsoneditor/dist/jsoneditor.min.css"

// Vue.use(BJsonEditor);
export default {
  components: {
    // BUeditor,
    BDatePicker,
    BSelect,
    BFormUploader,
    // BJsonEditor,
    BDraggable,
    BTreeSelect
  },
  props: {
    id: {
      required: true
    },
    parent: {},
    value: {},
    field: {},
    state: {},
    name: {}
  },
  computed: {
    isSelect() {
      return ["select", "select2"].includes(this.field.type);
    },
    isSelect2() {
      return ["select2"].includes(this.field.type);
    },
    myFields() {
      let fields = this.field.fields;
      if (typeof fields == "string") {
        const rel = this.parent[fields];
        if (!rel) {
          return {};
        }
        try {
          fields = JSON.parse(rel);
        } catch (e) {
          fields = {};
        }
      }
      if (this.parent.is_table) {
        fields._actions = { label: this.$t("actions.actions") };
      }

      return fields;
    },
    description() {
      if (this.field.limit) {
        const { width, height, size } = this.field.limit;
        if (width && height) {
          return `尺寸：${width}x${height}`;
        }
        return;
      }
      return this.field.description;
    },
    filteredValue() {
      let defaultValue = this.value;
      if (!this.defaultValue) {
        if (["object", "json"].includes(this.field.type)) {
          defaultValue = {};
        }
        if (["array"].includes(this.field.type) || this.field.multiple) {
          defaultValue = [];
        }
      }
      // console.log(defaultValue);
      return defaultValue;
    },
    isArrayValue() {
      return (
        this.field.multiple ||
        this.field.is_array ||
        this.field.type == "array" ||
        this.field.is_table
      );
    }
  },
  data() {
    const isArray =
      this.field.multiple ||
      this.field.is_array ||
      this.field.type == "array" ||
      this.field.is_table;
    return {
      options: this.field.options || [],
      model: isArray && !this.value ? [] : this.value,
      oldValue: _.clone(this.value),
      selectedValue: isArray && !this.value ? [] : this.value
    };
  },
  watch: {
    model(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    handleSelect(val) {
      if (this.isSelect2) {
        if (this.isArrayValue) {
          val = _.uniq(_.map(val, "value"));
        } else {
          val = val ? val.value : null;
        }
      }
      this.$emit("input", val);
    },
    getFormatter(field, value) {
      if (field.format) {
        return eval(field.format);
      }
      return v => v;
    },

    getAjaxOptions(q) {
      if (!this.field.ajaxOptions) {
        return;
      }
      const options = this.field.ajaxOptions;
      if (!options.where) {
        options.where = {};
      }
      options.where[options.text] = q;
      this.$http
        .get(options.resource + "/options", {
          params: options
        })
        .then(({ data }) => {
          this.options = data;
        });
    },
    initOptionsForSelect2() {
      const parentOptions = this.parent[this.name + "_data"];
      if (parentOptions) {
        this.options = this.options.concat(parentOptions);
      }
    }
  },
  mounted() {},
  created() {
    if (this.field.ajaxOptions && this.field.ajaxOptions.search !== true) {
      this.getAjaxOptions();
    }
    if (this.isSelect2) {
      this.initOptionsForSelect2();
      if (this.isArrayValue) {
        this.selectedValue = _.filter(
          this.options,
          v => this.value && this.value.includes(v.value)
        );
      } else {
        this.selectedValue = _.find(this.options, v => this.value == v.value);
      }
    }
  }
};
</script>
