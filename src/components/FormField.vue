<template>
   <!-- <b-form-select v-if="['select', 'select2'].includes(field.type)" :formatter="getFormatter(field, value)" :id="id" v-bind="field" :options="options" @input="model = arguments[0]" :title="value" />  -->
  <b-select v-if="['select', 'select2'].includes(field.type)" label="text" v-bind="field" :options="options" :value="selected" @input="selected = arguments[0]" :on-search="getAjaxOptions"></b-select>
  <!-- <b-select v-if="['select', 'select2'].includes(field.type)" track-by="value" label="text" @input="model = arguments[0]" :id="id" v-bind="field" :title="value" /> -->
  <b-date-picker v-else-if="['date'].includes(field.type)" v-bind="field" v-model="model" />

  <b-form-radio-group v-else-if="['radiolist'].includes(field.type)" v-model="model">
    <b-form-radio :key="choice.value" :value="choice.value" v-for="choice in field.options">{{choice.text}}</b-form-radio>
  </b-form-radio-group>

  <b-form-checkbox-group v-else-if="['checkboxlist'].includes(field.type)" v-model="model">
    <b-form-checkbox :key="choice.value" :value="choice.value" v-for="choice in field.options">{{choice.text}}</b-form-checkbox>
  </b-form-checkbox-group>

  <b-form-textarea v-else-if="['textarea'].includes(field.type)" :id="id" v-model="model" v-bind="field" :rows="field.rows || 3" />

  <!-- <b-uploader v-else-if="['image', 'file', 'audio'].includes(field.type)" :id="id" v-model="model" v-bind="field" /> -->
  <div v-else-if="['image', 'file', 'audio', 'video'].includes(field.type)">

    <div class="">
      <b-form-file ref="file" :id="id" v-model="model" v-bind="field" @input="upload" />

    </div>
    <div class="preview" v-show="value">
      <component controls :is="field.type == 'image' ? 'img' : field.type" v-if="['audio', 'video', 'image'].includes(field.type)" :alt="value" :src="preview(value)" v-b-modal="'modal_input_' + name" class="my-2" center v-bind="field.preview" style="max-height: 300px;max-width: 100%;" />
    </div>

    <b-modal :title="field.label" :id="'modal_input_' + name">
      <b-img :src="preview(value)" class="my-2" center fluid />
    </b-modal>
  </div>

  <b-switch variant="success" v-bind="field" pill type="3d" v-else-if="['switch'].includes(field.type)" :id="id" v-model="model" />

  <b-ueditor :state="state" v-else-if="['wysiwyg', 'html'].includes(field.type)" :id="id" v-bind="field" v-model="model" />

  <div v-else-if="['json'].includes(field.type)">
    <b-form-textarea :id="id" v-model="model" v-bind="field" :rows="field.rows || 3" />
  </div>

  <div v-else-if="field.fields">
    <div v-if="['array'].includes(field.type) || parent.isArray">
      <b-table hover bordered :items="model" :fields="myFields" v-if="parent.isTable">
        <template v-for="(child, k) in myFields" :slot="k" slot-scope="row">
          <b-form-field v-model="model[row.index][k]" :name="k" :key="k" :field="child" :id="`input_${row.index}_${k}`" />
        </template>
        <template slot="HEAD_actions" slot-scope="row">
          <b-btn size="sm" @click="model.push({});">
            <i class="icon-plus"></i> 添加
          </b-btn>
        </template>
        <template slot="actions" slot-scope="row">
          <b-btn size="sm" @click="model.splice(row.index, 1);$snotify.success('删除成功')">
            <i class="icon-trash"></i> 删除
          </b-btn>
        </template>
      </b-table>
      <b-draggable v-model="model" v-else>
        <transition-group tag="div" class="row">
          <b-col v-for="(item, i) in model" :key="i" cols :lg="6" :xl="4">
            <b-card>
              <b-row slot="header" class="justify-content-between">
                <b-col>No. {{i + 1}}</b-col>
                <b-col right class="text-right">
                  <b-btn size="sm" @click="model.splice(i, 1);$snotify.success('删除成功')">
                    <i class="icon-trash"></i> 删除</b-btn>
                </b-col>
              </b-row>

              <b-form-group v-for="(child, key) in myFields" :key="key" v-bind="child" :label-for="`input_${name}_${i}_${key}`">
                <b-form-field v-model="model[i][key]" :name="key" :field="child" :id="`input_${name}_${i}_${key}`" />
              </b-form-group>
            </b-card>
          </b-col>
          <b-col cols lg="6" xl="4" :key="-1" class="d-flex align-items-center justify-content-center">
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
          <b-form-field v-model="model[key]" :name="key" :field="child" :id="`input_${name}_${key}`" />
        </b-form-group>
      </b-card>
    </div>
    <div v-else>
      <b-form-group v-for="(child, key) in myFields" :key="key" v-bind="child" :label-for="`input_${name}_${key}`">
        <b-form-field v-model="model[key]" :name="key" :field="child" :id="`input_${name}_${key}`" />
      </b-form-group>
    </div>
  </div>

  <b-input-group v-else>
    <b-input-group-addon v-if="field.icon || field.left">
      <i :class="field.icon" v-if="field.icon"></i>
      <span v-else v-html="field.left"></span>
    </b-input-group-addon>
    <b-form-input :state="state" :id="id" v-bind="field" v-model="model" :formatter="getFormatter(field, value)" />
  </b-input-group>
</template>

<script>
import bDraggable from "vuedraggable";

import bSelect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css"
import bDatePicker from "vue2-datepicker";
import bUeditor from "./UEditor";
import Vue from "vue";
import _ from "lodash";

export default {
  components: {
    bUeditor,
    bDatePicker,
    bSelect,
    bDraggable
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
    selected: {
      set(val) {
        const sel = _.isArray(val) ? _.map(val, "value") : val.value;
        // this.model = sel;
        this.selectedValue = val
        this.$emit('input', sel)
      },
      get() {
        return this.selectedValue;
      }
    },
    isSelect() {
      return ["select", "select2"].includes(this.field.type);
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
      if (this.parent.isTable) {
        fields.actions = { label: "操作" };
      }

      return fields;
    },
    description() {
      if (this.field.limit) {
        const { width, height, size } = this.field.limit;
        return `尺寸要求：${width}x${height}像素，小于${parseInt(size / 1024)}KB`;
      }
      return field.description;
    }
  },
  data() {
    let defaultValue = this.value;
    if (["object", "json"].includes(this.field.type) && !this.value) {
      // defaultValue = {}
    }
    return {
      options: this.field.options,
      model: defaultValue,
      oldValue: null,
      selectedValue: null
    };
  },
  watch: {
    value: "syncValue",
    model(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    handleSelect(val) {
      if (Array.isArray(val)) {
        _.mapValues(val, v => {
          v.label = v.replace();
        });
        this.model = _.map(val, "value");
        console.log(val);

        // this.selected =
      } else {
        this.model = val ? val.value : null;
      }
    },
    getFormatter(field, value) {
      if (field.format) {
        return eval(field.format);
      }
      return v => v;
    },
    reset(error) {
      if (error) {
        this.$snotify.error(error);
      }
      this.model = this.oldValue;
      return false;
    },
    upload() {
      if (!this.model) {
        return;
      }
      const fd = new FormData();
      fd.append("file", this.model);
      fd.append("type", this.name);

      const src = URL.createObjectURL(this.model);

      const doUpload = () => {
        this.$http.post("upload", fd).then(({ data }) => {
          this.model = data.url;
        });
      };

      const { width, height, size } = this.field.limit || {};

      if (this.model.size > size) {
        return this.reset(`请上传小于${parseInt(size / 1024)}KB的文件`);
      }

      if (this.model.type.match(/^image/)) {
        let file = new Image();
        file.src = src;
        file.onload = () => {
          if (this.field.limit) {
            if (file.naturalHeight != height || file.naturalWidth != width) {
              return this.reset(`请上传${width}x${height}像素的图片`);
            }
          }
          doUpload();
        };
      } else {
        doUpload();
      }
    },
    preview(file) {
      if (!file) {
        return;
      }
      if (typeof file === "string") {
        return file;
      }
      return URL.createObjectURL(file);
    },
    syncValue() {
      this.model = this.value;
      console.log('sync value', this.oldValue, this.name);
      
      if (!this.oldValue && this.value) {
        this.oldValue = this.value;

        let selectedValue = this.value;
        const ref = this.field.ref;
        if (ref) {
          const [rel, field] = ref.split(".");
          const key = "_id";

          if (_.isArray(this.value)) {
            selectedValue = [];
            if (this.field.ajaxOptions) {
              _.filter(this.parent[rel], v => {
                if (this.value.includes(v[key])) {
                  selectedValue.push({
                    value: v[key],
                    text: v[field]
                  });
                }
              });
            } else {
              // console.log(this.field.options);
              _.filter(this.field.options, v => {
                if (this.value.includes(v.value)) {
                  selectedValue.push(v);
                }
              });
            }
          } else {
            selectedValue = {
              value: this.value,
              text: _.get(this.parent, ref)
            };
          }
        }

        console.log('sync selected value',this.oldValue, selectedValue);
        this.selectedValue = selectedValue;
      }
    },
    getAjaxOptions(q) {
      if (!this.field.ajaxOptions) {
        return;
      }
      const options = this.field.ajaxOptions;
      if (!options.where) {
        options.where = {}
      }
      options.where[options.text] = q
      this.$http
        .get(options.resource + "/options", {
          params: options
        })
        .then(({ data }) => {
          this.options = data;
        });
    }
  },
  mounted() {
    this.syncValue();
    if (this.field.ajaxOptions && this.field.ajaxOptions.search !== true) {
      // this.getAjaxOptions();
    }
  },
  created() {}
};
</script>
