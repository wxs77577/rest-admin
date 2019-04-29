<template>
  <el-select-field v-if="['select', 'select2'].includes(field.type)" :field="field" v-model="model"></el-select-field>

  <el-radio-group v-else-if="['radiolist'].includes(field.type)" v-model="model">
    <el-radio
      v-for="option in field.options"
      :key="option.value"
      :label="option.value"
    >{{option.text}}</el-radio>
  </el-radio-group>

  <el-input v-else-if="['textarea'].includes(field.type)" type="textarea" v-model="model"></el-input>

  <el-upload
    v-else-if="['image', 'file', 'audio', 'video'].includes(field.type)"
    :field="field"
    v-model="model"
    :data="{type: name}"
    :action="API_URI + 'upload'"
    :headers="authHeaders"
    :limit="field.multiple ? 10 : 1"
    list-type="picture-card"
  >
    <i class="el-icon-plus"></i>
  </el-upload>
  
  <el-switch
    v-else-if="['switch'].includes(field.type)"
    :title="JSON.stringify(value)"
    v-model="model"
  ></el-switch>

  <el-html-field v-else-if="['html'].includes(field.type)" v-model="model"></el-html-field>

  <el-date-picker
    :style="{width: field.width || '12rem'}"
    type="daterange"
    v-else-if="['date', 'datetime'].includes(field.type)"
    v-bind="field"
    v-model="model"
  ></el-date-picker>

  <div v-else-if="['object'].includes(field.type)" class="border rounded py-3">
    <el-fields v-model="model" :fields="field.fields"></el-fields>
  </div>

  <el-table
    v-else-if="['array'].includes(field.type) && (field.is_table)"
    class="border rounded py-3"
    :data="value"
  >
    <el-table-column
      v-for="(child, key) in field.fields"
      :key="key"
      :prop="key"
      :label="child.label"
    >
      <template slot="header" slot-scope="scope">
        <el-button @click="addItem(-1)" v-if="key === '_actions'">
          <i class="el-icon-plus"></i>
        </el-button>
        <span v-else>{{child.label}}</span>
      </template>
      <div slot-scope="scope">
        <div v-if="key === '_actions'">
          <el-button @click="addItem(scope.$index)">
            <i class="el-icon-plus"></i>
          </el-button>
          <el-button @click="removeItem(scope.$index)">
            <i class="el-icon-minus"></i>
          </el-button>
        </div>
        <el-field
          v-else
          :value="get(value, [scope.$index, key])"
          @input="update([scope.$index, key], arguments[0])"
          :field="child"
          :name="key"
        ></el-field>
      </div>
    </el-table-column>
    <el-table-column prop="_actions"></el-table-column>
  </el-table>
  <el-row v-else-if="['array'].includes(field.type)" class="border rounded py-3">
    <el-col :md="field.item_cols * 2" v-for="(item, index) in value" :key="`${name}-${index}`">
      <el-fields
        :value="get(value, index, {})"
        @input="update(index, arguments[0])"
        :fields="field.fields"
      ></el-fields>
    </el-col>
    <el-col :md="field.item_cols * 2" class=" text-center">
      <div class="el-upload--picture-card m-auto" @click="addItem(value.length - 1)">
        <i class="el-icon-plus" ></i>
      </div>
    </el-col>
  </el-row>

  <el-input v-else v-model="model"></el-input>
</template>

<script>
import ElSelectField from "./SelectField";
import ElHtmlField from "./HtmlField";
import { mapGetters } from "vuex";
import { get, set, isObject, cloneDeep } from "lodash";
export default {
  name: "el-field",
  components: {
    ElSelectField,
    ElHtmlField
  },
  props: {
    name: {},
    value: {},
    field: {}
  },
  computed: {
    ...mapGetters(["authHeaders", "currentLanguage"]),
    isIntlInput() {
      if (['select', 'select2'].includes(this.field.type)) {
        return false
      }
      return this.field.intl || this.field.multilingual;
    },
    model: {
      get() {
        if (this.isIntlInput) {
          return get(this.value, this.currentLanguage, "");
        }
        return this.value;
      },
      set(val) {
        let value = cloneDeep(this.value)
        if (this.isIntlInput) {
          if (!value) {
            value = {}
          }
          value[this.currentLanguage] = val
        } else {
          value = val
        }
        this.$emit("input", value);
      }
    }
  },
  methods: {
    get: get,
    getValue() {
      if (this.field.type === "array") {
        return this.value ? this.value.slice(0) : [];
      }
      return Object.assign({}, this.value);
    },
    update(key, val) {
      const value = this.getValue();
      set(value, key, val);
      this.$emit("input", value, this.currentLanguage);
    },
    removeItem(index) {
      const value = this.getValue();
      value.splice(index, 1);
      this.$emit("input", value);
    },
    addItem(index) {
      const value = this.getValue();
      value.splice(index + 1, 0, {});
      this.$emit("input", value);
    }
  }
};
</script>

