<template>
  <div>
    <el-form-item v-for="(field, name) in fields" :label="field.label" :key="name">
      <el-select-field
        v-if="['select', 'select2'].includes(field.type)"
        :field="field"
        :value="value[name]"
        @input="update(name, arguments[0])"
      ></el-select-field>

      <el-radio-group
        v-else-if="['radiolist'].includes(field.type)"
        :value="value[name]"
        @input="update(name, arguments[0])"
      >
        <el-radio
          v-for="option in field.options"
          :key="option.value"
          :label="option.value"
        >{{option.text}}</el-radio>
      </el-radio-group>

      <el-input
        v-else-if="['textarea'].includes(field.type)"
        type="textarea"
        :value="value[name]"
        @input="update(name, arguments[0])"
      ></el-input>

      <el-upload
        v-else-if="['image', 'file', 'audio', 'video'].includes(field.type)"
        :field="field"
        :value="value[name]"
        :data="{type: name}"
        :action="API_URI + 'upload'"
        :headers="authHeaders"
        :limit="field.multiple ? 10 : 1"
        list-type="picture-card"
      >
        <i class="el-icon-plus"></i>
      </el-upload>

      <div v-else-if="['switch'].includes(field.type)">
        <el-switch
          :title="JSON.stringify(value[name])"
          :value="value[name]"
          @input="update(name, arguments[0])"
        ></el-switch>
        {{value[name]}}
      </div>

      <el-html-field
        v-else-if="['html'].includes(field.type)"
        :value="value[name]"
        @input="update(name, arguments[0])"
      ></el-html-field>

      <el-date-picker
        :style="{width: field.width || '12rem'}"
        type="daterange"
        v-else-if="['date', 'datetime'].includes(field.type)"
        v-bind="field"
        :value="value[name]"
        @input="update(name, arguments[0])"
      ></el-date-picker>

      <div v-else-if="['object'].includes(field.type)" class="border rounded py-3">
        <el-form-fields
          :value="get(value, [name], {})"
          @input="update(name, arguments[0])"
          :fields="field.fields"
        ></el-form-fields>
      </div>

      <el-row v-else-if="['array'].includes(field.type)" class="border rounded py-3">
        <el-col :md="field.item_cols * 2" v-for="(item, index) in value[name]" :key="`${name}-${index}`">
          <el-form-fields
            :value="get(value, [name, index], {})"
            @input="update([name, index], arguments[0])"
            :fields="field.fields"
          ></el-form-fields>
        </el-col>
        <el-col :md="field.item_cols * 2">
          <i class="el-icon-plus" @click="addItem(name)"></i>
        </el-col>
      </el-row>

      <el-input v-else :value="value[name]" @input="update(name, arguments[0])"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import ElSelectField from "./fields/SelectField";
import ElHtmlField from "./fields/HtmlField";
import { mapGetters } from "vuex";
import { get, set } from "lodash";
export default {
  name: "el-form-fields",
  components: {
    ElSelectField,
    ElHtmlField
  },
  props: {
    value: {},
    fields: {}
  },
  computed: {
    ...mapGetters(["authHeaders"])
  },
  methods: {
    get: get,
    getValue() {
      return Object.assign({}, this.value);
    },
    update(key, val) {
      const value = this.getValue();
      set(value, key, val);
      this.$emit("input", value);
    },
    addItem(name) {
      const value = this.getValue();
      if (!value[name]) {
        value[name] = [];
      }
      value[name].push({});
      this.$emit("input", value);
    }
  }
};
</script>

