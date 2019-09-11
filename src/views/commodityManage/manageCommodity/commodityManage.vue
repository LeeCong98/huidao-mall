<template>
  <div class="root-container commodityManage">
    <Headline title="商品管理" label="商品列表">
      <el-button class="add-button" @click="addCommodity" type="danger">新增</el-button>
    </Headline>
    <Search :inputArr="inputArr" @to-search="byConditionSearch">
      <div class="search-group">
        <div class="search-item" v-for="(item, index) in options" :key="item.label">
          <em class="select-label" style="font-size: 14px;color: #666;">{{ item.label }}</em>
          <el-select v-model="condition[index]" :style="{ width: '150px'}">
            <el-option
              v-for="unit in item.select"
              :key="unit.listName"
              :label="unit.category_name"
              :value="unit.category_id"
            ></el-option>
          </el-select>
        </div>
      </div>
    </Search>
    <listPanel class="grap" :notTitle="true">
      <div>
        <el-table
          :data="tableData"
          :style="{ width: '100%' }"
          header-align="center"
          class="table-container"
          :row-class-name="tableRowClassName"
        >
          <el-table-column align="center" prop="itemId" label="编号"></el-table-column>
          <el-table-column align="center" prop="itemName" label="名称"></el-table-column>
          <el-table-column align="center" prop="coverImg" label="缩略图">
            <template slot-scope="scope">
              <img class="thumb-container" :src="scope.row.coverImg" alt />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="价格"></el-table-column>
          <el-table-column align="center" prop="num" label="库存量"></el-table-column>
          <el-table-column align="center" prop="isShow" label="商品状态">
            <template slot-scope="{ row }">
              <span>{{ row.isShow === 'Y' ? '上架中' : '已下架'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="categoryName" label="分类"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="opeartion-container">
                <el-button
                  size="mini"
                  :disabled="scope.row.isShow === 'Y'"
                  @click="changStatus(scope.row.itemId, scope.row.isShow, 'Y', scope.$index)"
                >上架</el-button>
                <el-button
                  size="mini"
                  type="warning"
                  :disabled="scope.row.isShow === 'N'"
                  @click="changStatus(scope.row.itemId, scope.row.isShow, 'N', scope.$index)"
                >下架</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  :disabled="scope.row.isShow === 'Y'"
                  @click="deleteCommodity(scope.row.itemId, scope.$index)"
                >删除</el-button>
                <el-button
                  size="mini"
                  :disabled="scope.row.isShow === 'Y'"
                  @click="editCommodity(scope.row.itemId)"
                >编辑</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </listPanel>
    <!-- Page组件 -->
    <Pageinate
      class="page-container"
      :pageSize="pageSize"
      :total="total"
      :receive="true"
      @receivePage="getPageSize"
      @receiveCurrent="getCurrentPage"
    />
  </div>
</template>

<script>
import Headline from '../../../components/headline.vue'
import Search from '../../../components/search.vue'
import listPanel from '../../../components/list.vue'
import Pageinate from '../../../components/paginate.vue'
import CommodityModel from '../../../Http/commoditymanage/commodityManage/commodityManage'
import { alertInfo, remove } from './../../../assets/js/common.js'
export default {
  name: 'goodsManage',
  data () {
    return {
      pageSize: 10,
      total: 0,
      inputArr: ['请输入商品名称'],
      tableData: [],
      options: [{}],
      condition: [null],
      searchInnner: '',
      mode: 'normal'
    }
  },
  components: {
    Headline,
    Search,
    listPanel,
    Pageinate
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (row.num <= 50) {
        return 'warning-line'
      }
      return ''
    },
    /**
     * 更改商品状态判断
     */
    statusJuage (itemId, isShow, type) {
      if (itemId === undefined || isShow === undefined) {
        alertInfo.call(this, {
          type: 'error',
          cont: '系统错误'
        })
        return false
      }
      if (isShow === type) {
        alertInfo.call(this, {
          type: 'error',
          cont: type === 'Y' ? '商品已是上架状态' : '商品已是下架状态'
        })
        return false
      }
      return true
    },
    // 跳转至增加商品的页面
    addCommodity () {
      this.$router.push({
        path: '/addcommodity'
      })
    },
    // 改变商品状态
    changStatus (itemId, isShow, expect, index) {
      if (this.statusJuage(itemId, isShow, expect)) {
        CommodityModel.changeCommodityStatus(
          {
            itemId,
            isShow: expect
          },
          ({ data }) => {
            this.tableData[index].isShow = expect
            alertInfo.call(this, {
              type: 'success',
              cont: expect === 'Y' ? '商品上架成功' : '商品下架成功'
            })
          },
          ({ data: { message } }) => {
            alertInfo.call(this, {
              type: 'error',
              cont: message
            })
          }
        )
      }
    },
    // 删除商品操作
    deleteCommodity (itemId, index) {
      if (this.tableData[index].isShow !== 'N') {
        return alertInfo.call(this, {
          type: 'error',
          cont: '删除失败，该商品依然在上架中'
        })
      } else {
        remove.call(this, () => {
          CommodityModel.deleteCommodity(
            {
              itemId: itemId
            },
            ({ data }) => {
              if (data.message === '成功') {
                // 静态删除当前数据
                this.tableData.splice(index, 1)
                this.total = this.tableData.length
              }
            },
            () => {
              alertInfo.call(this, {
                cont: '删除失败',
                type: 'error'
              })
            }
          )
        })
      }
    },
    // 跳转至编辑页，并将对应数据传递
    editCommodity (id) {
      this.$router.push({
        path: '/editCommodity',
        query: {
          commodityId: id,
          type: 'edit'
        }
      })
    },
    // 监听页码变化的参数
    getPageSize () {},
    // 根据页码进行商品列表查询
    getCurrentPage (val) {
      if (val.currentPage === undefined) return false
      if (this.mode === 'normal') {
        CommodityModel.getCommodityList(
          {
            current: val.currentPage,
            size: this.pageSize
          },
          ({
            data: {
              data: { itemShop }
            }
          }) => {
            if (itemShop) {
              this.total = itemShop.total
              this.tableData = itemShop.records
            } else {
              alertInfo.call(this, {
                type: 'warning',
                cont: '获取商品数据失败！'
              })
            }
          },
          () => {
            this.total = 0
            this.tableData = []
            alertInfo.call(this, {
              type: 'warning',
              cont: '获取商品数据失败！'
            })
          }
        )
      } else if (this.mode === 'search') {
        this.getByCategoryAndName(this.searchInnner, val.currentPage)
      }
    },
    // 获取分布分类
    getCategory () {
      CommodityModel.getCategoryAll(
        ({ data: { data } }) => {
          this.$set(this.options, 0, {
            label: '请选择分类',
            select: [
              {
                category_name: '请选择分类',
                category_id: null
              }
            ].concat(data)
          })
          // this.categoryOPtions = data
        },
        () => {
          alertInfo.call(this, {
            cont: '分类数据获取失败',
            type: 'danger'
          })
        }
      )
    },
    // 按照分类和商品名搜索
    byConditionSearch (val) {
      function valCheck (key, that) {
        if (this[key].length === 0 || this[key][0].length === 0) {
          this.mode = 'normal'
          return false
        }
        return true
      }
      this.total = 0
      // 搜索
      if (valCheck.apply(val, ['input', this]) || this.condition[0] !== null) {
        this.mode = 'search'
        this.searchInnner = val
        this.getByCategoryAndName(val, 1)
        // 模糊搜索
      } else {
        this.mode = 'normal'
        this.total = 15
        this.getCurrentPage({
          currentPage: 1
        })
      }
    },
    /**
     * 按商品名称和商品分类去查询
     */
    getByCategoryAndName (val, pageinate) {
      CommodityModel.getCommodityByIdOrCategory(
        {
          itemName: val.input[0] === '' ? null : val.input[0],
          categoryId: this.condition[0],
          current: pageinate,
          size: this.pageSize
        },
        ({ data: { data } }) => {
          this.tableData = data.itemShop.records
          this.total = data.itemShop.total
        },
        ({ data }) => {
          // 搜索失败直接清空
          this.tableData = []
          this.total = this.tableData.length
          alertInfo.call(this, {
            type: 'error',
            cont: data.message
          })
        }
      )
    },
    // 页面初始化数据
    pageDataInit () {
      this.getCurrentPage({
        currentPage: 1
      })
      this.getCategory()
    }
  },
  created () {
    this.pageDataInit()
  }
}
</script>
