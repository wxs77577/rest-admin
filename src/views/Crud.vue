<template>
  <avue-crud
    ref="crud"
    :option="config.option"
    :page="config.page"
    :table-loading="loading"
    @row-update="update"
    @row-save="create"
    @row-del="remove"
    @refresh-change="refresh"
    @search-change="search"
    @search-reset="resetSearch"
    @current-change="changePage"
    @size-change="changePageSize"
    @sort-change="changeSort"
    v-model="form"
    :data="data"
  >
  </avue-crud>
</template>

<script>
import Vue from "vue"
import Avue from "@smallwei/avue"
import "@smallwei/avue/lib/index.css"
import $api from "../crud-api"

Vue.use(Avue)

export default {
  props: {
    resource: String,
    pk: {
      type: String,
      default: "_id",
    },
  },
  data() {
    return {
      form: {},
      where: {},
      sort: {},
      loading: false,
      data: [],
      config: {
        option: {},
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
        },
      },
    }
  },
  computed: {},
  watch: {
    resource: {
      immediate: true,
      handler: "getConfig",
    },
  },
  methods: {
    getQuery() {
      const { prop = this.pk, order } = this.sort
      const { currentPage = 1, pageSize = 10 } = this.config.page
      return {
        skip: (currentPage - 1) * pageSize,
        page: currentPage,
        limit: pageSize,
        where: this.where,
        sort: { [prop]: order === "ascending" ? 1 : -1 },
      }
    },
    reset() {
      this.config.page.currentPage = 1
      this.config.page.total = 0
      this.config.page.pageSize = 10
      this.config.page.pageSizes = [10, 20, 50, 100]
      this.where = {}
      this.sort = {}
    },
    async getConfig() {
      const config = await $api.getConfig(this.resource)
      config.option.translate = false
      Object.assign(this.config, config)
      await this.find(true)
    },
    async find(reset = false) {
      this.loading = true
      if (reset) {
        this.reset()
      }
      try {
        const { data, total } = await $api.find(this.resource, this.getQuery())
        this.data = data
        this.config.page.total = total
      } catch (e) {
        this.$message.error(e.message)
      }
      this.loading = false
    },
    async create(row, done, loading) {
      try {
        await $api.create(row)
        done()
        this.$message.success(`创建成功`)
        await this.find(true)
      } catch (e) {
        loading()
      }
    },
    async update(row, index, done, loading) {
      try {
        await $api.update(this.resource, row[this.pk], row)
        done()
        this.$message.success(`更新成功`)
        await this.find()
      } catch (e) {
        loading()
      }
    },
    async remove(row) {
      try {
        await this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        await $api.delete(this.resource, row[this.pk])
        this.$message.success(`删除成功`)
        await this.find()
      } catch (e) {
        // 已取消
      }
    },
    async search(where, done) {
      done && done()
      this.where = { ...where }
      this.resetCurrentPage()
      await this.find()
    },
    async refresh() {
      await this.find(true)
    },
    async resetCurrentPage() {
      this.config.page.currentPage = 1
    },
    async resetSearch() {
      await this.find(true)
    },
    async changePage(page) {
      this.config.page.currentPage = page
      await this.find()
    },
    async changePageSize(pageSize) {
      this.resetCurrentPage()
      this.config.page.pageSize = pageSize
      await this.find()
    },
    async changeSort(sort) {
      this.resetCurrentPage()
      this.sort = sort
      await this.find()
    },
  },
}
</script>
