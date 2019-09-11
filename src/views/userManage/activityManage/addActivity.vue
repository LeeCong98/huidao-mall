<template>
  <div class="root-container">
    <Headline title="用户管理" label="活动新增/编辑" />
    <div class="from-group clearfix">
      <div class="form-item">
        <span>活动名称：</span>
        <el-input placeholder="请输入内容" class="form-input" v-model="activityName"></el-input>
      </div>
      <div class="form-item">
        <span>活动类型：</span>
        <el-cascader :props="propertyFormat" :options="typeOptions" v-model="selectedOptions"></el-cascader>
      </div>
      <div class="form-item">
        <span>开启时间：</span>
        <el-date-picker
          class="form-datetime"
          v-model="startTime"
          type="datetime"
          placeholder="选择日期时间"
          size
        ></el-date-picker>
      </div>
      <div class="form-item">
        <span>结束时间：</span>
        <el-date-picker
          class="form-datetime"
          v-model="endTime"
          type="datetime"
          placeholder="选择日期时间"
        ></el-date-picker>
      </div>
      <div class="form-item">
        <span>活动封面</span>
        <el-upload
          :action="$store.state.singleUpload"
          list-type="picture-card"
          :file-list="fileList"
          :auto-upload="true"
          :limit="1"
          name="file"
          :on-success="upLoad"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" style="width: 100%;height: 100%;" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              style="width: 100%;height: 100%;"
              :src="file.url"
              alt
            />
            <span class="el-upload-list__item-actions">
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <a
                  v-if="!disabled"
                  class="el-upload-list__item-delete download-cont"
                  :href="file.url"
                  download
                >
                  <i class="el-icon-download"></i>
                </a>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <div class="toast">
          <p>限上传一张缩略图</p>
          <p>图片尺寸最佳为180X180像素</p>
        </div>
      </div>
      <div class="form-item">
        <span>活动规则：</span>
        <textarea v-model="activityRule"></textarea>
      </div>
    </div>
    <div class="btn-list">
      <el-select v-model="value" @change="optionsChange" clearable placeholder="请选择分类">
        <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-input v-model="input" @change="search" placeholder="请输入商品名称"></el-input>
      <button type="button" @click="selectAll">选中所有商品</button>
      <button type="button" @click="deleteCommodity">删除</button>
      <button type="button" @click="activitySubmit">添加</button>
    </div>
    <listPanel class="grap" title="活动商品" style="margin: 0;">
      <div>
        <el-table
          :data="tableData"
          :style="{ width: '100%' }"
          header-align="center"
          :row-style="{height: '164px'}"
          ref="multipleTable"
          :row-key="getRowKeys"
          @selection-change="handleSelect"
          class="table-container"
        >
          <el-table-column :reserve-selection="true" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="itemId" label="编号"></el-table-column>
          <el-table-column align="center" prop="itemName" label="名称"></el-table-column>
          <el-table-column align="center" label="缩略图">
            <template slot-scope="scope">
              <img style="width: 100%;height: 100%;" :src="scope.row.coverImg" alt />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="价格"></el-table-column>
          <el-table-column align="center" prop="activityPrice" label="活动价格"></el-table-column>
          <el-table-column align="center" prop="listParent" label="分类"></el-table-column>
        </el-table>
        <Pageinate
          style="marginTop: 10px;"
          :pageSize="pageSize"
          @receiveCurrent="currentChanges"
          :total="(value.length > 0 || input.length > 0) ? searchData.length : checkList.length"
        />
      </div>
    </listPanel>
    <div class="footer">
      <div class="control-container">
        <el-button type="danger" @click="handleSub('N')">保存</el-button>
        <el-button type="danger" @click="handleSub('Y')">保存并开启</el-button>
        <el-button type="info" @click="handleCancle">取消</el-button>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="60%"
      class="dialog"
      center
      :lockScroll="false"
    >
      <div class="btn-list">
        <el-select v-model="dialogValue" @change="dialogSelectChange" clearable placeholder="请选择分类">
          <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-input v-model="dialogInput" @change="dialogSearch" placeholder="请输入商品名称"></el-input>
      </div>
      <listPanel class="grap" :title="dialogTitle">
        <el-table
          class="table-container"
          ref="dialogMultipleTable"
          :data="tableList"
          :row-key="getRowKeys"
          :row-style="{height: '164px'}"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column :reserve-selection="true" type="selection" width="55"></el-table-column>
          <el-table-column prop="itemId" align="center" label="编号" width="120"></el-table-column>
          <el-table-column align="center" prop="itemName" label="名称" width="120"></el-table-column>
          <el-table-column align="center" label="缩略图" show-overflow-tooltip>
            <template slot-scope="scope">
              <img style="width: 100%;height: 100%;" :src="scope.row.coverImg" alt />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="价格" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="address" label="规格属性" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="categoryId" label="分类" show-overflow-tooltip></el-table-column>
        </el-table>
      </listPanel>
      <Pageinate :pageSize="pageSize" @receiveCurrent="handleCurrentChange" :total="selectRecord" />
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="default" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Headline from '../../../components/headline.vue'
import listPanel from '../../../components/list.vue'
import Pageinate from '../../../components/paginate.vue'
import {
  remove,
  examineInfoComplete,
  formatDate
} from '../../../assets/js/common'

export default {
  data () {
    return {
      activityName: '',
      startTime: '',
      endTime: '',
      activityBanner: [],
      activityRule: '',
      dialogVisible: false,
      dialogImageUrl: '',
      tableData: [],
      typeOptions: [],
      centerDialogVisible: false,
      selectRecord: 30,
      pageSize: 5,
      dialogTitle: '商品列表',
      fileList: [],
      tableList: [],
      checkList: [],
      options: [],
      selectList: [],
      value: '',
      dialogValue: '',
      currentChange: false,
      disabled: false,
      input: '',
      dialogInput: '',
      searchData: [],
      selectedOptions: [],
      propertyFormat: {
        value: 'preferenceId',
        label: 'preferenceType',
        children: 'preferenceItems'
      },
      verify: [
        { activityName: '活动名称为空' },
        { startTime: '开始时间为空' },
        { endTime: '结束时间为空' },
        { fileList: '缩略图为空' },
        { activityRule: '活动规则为空' },
        { tableData: '商品列表为空' }
      ]
    }
  },
  components: {
    Headline,
    listPanel,
    Pageinate
  },
  created () {
    this.$http.sortManage.sortAll().then(
      res => {
        this.options = res.data.data
      },
      (err) => {
        this.$message({
          type: 'error',
          message: err.data.message
        })
      }
    )
    this.$http.activityManage.getActivityCategory.call(this)
  },
  methods: {
    handleDownload (file) { },
    handleRemove (file) {
      if (!this.disabled) {
        this.fileList.pop()
      }
    },
    getRowKeys (row) {
      return row.itemId
    },
    // 图片上传
    upLoad (response, file, fileList) {
      let img = {}
      img.url = img.name = response.data
      this.fileList[0] = img
    },
    // 根据页码获取数据
    getPageData (index) {
      this.$http.activityManage.getAllPX('', index, this.pageSize).then(
        res => {
          this.selectRecord = res.data.data.itemCount
          this.tableList = res.data.data.itemInfos
        },
        (err) => {
          this.$message({
            type: 'error',
            message: err.data.message
          })
        }
      )
    },
    // 全部选中
    toggleSelection (rows) {
      let flag = true
      if (rows) {
        rows.forEach(row => {
          if (
            this.$refs.multipleTable.selection.toString() !==
            this.checkList.toString()
          ) {
            this.$refs.multipleTable.toggleRowSelection(row, true)
            flag = false
          }
        })
        if (flag) {
          rows.forEach(row => {
            this.$refs.multipleTable.clearSelection()
          })
        }
      }
    },
    defaultSelect (rows) {
      this.$refs.dialogMultipleTable.clearSelection()
      if (rows.length > 0) {
        rows.forEach(row => {
          this.$refs.dialogMultipleTable.toggleRowSelection(row, true)
        })
      } else {
        this.$refs.dialogMultipleTable.clearSelection()
      }
    },
    // 点击添加按钮，将dialog显示
    activitySubmit () {
      this.centerDialogVisible = true
      this.selectRecord = -1
      this.getPageData(1)
      this.$nextTick(() => {
        this.defaultSelect(this.checkList)
      })
    },
    // dialog中页码改变重新获取数据
    handleCurrentChange ({ currentPage }) {
      if (this.dialogValue.length > 0 || this.dialogInput.length > 0) {
        this.dialogShopSearch(currentPage)
        return
      }
      this.getPageData(currentPage)
    },
    // 获取选中的商品
    handleSelectionChange (val) {
      this.checkList = val
    },
    // dialog中点击保存
    handleConfirm () {
      this.tableData = this.checkList.slice(0, this.pageSize)
      this.centerDialogVisible = false
    },
    // 页面保存按钮
    handleSub (status) {
      const suc = examineInfoComplete.call(this, this.verify)
      if (suc !== true) {
        this.$message({
          type: 'warning',
          message: suc,
          lockScroll: false
        })
        return
      }
      const activityItem = []
      this.checkList.forEach(item => {
        activityItem.push({
          itemId: item.itemId,
          price: item.price
        })
      })
      const mock = {
        activityInfo: {
          activityName: this.activityName,
          activityImg: this.fileList[0].url,
          startTime: formatDate(
            new Date(this.startTime),
            'yyyy-MM-dd hh:mm:ss'
          ),
          endTime: formatDate(new Date(this.endTime), 'yyyy-MM-dd hh:mm:ss'),
          activityStatus: status,
          rule: this.activityRule,
          preferenceItemId: this.selectedOptions[1],
          preferenceId: this.selectedOptions[0]
        },
        activityItem
      }
      if (this.mode === 'update') {
        mock.activityInfo.activityId = this.$route.params.id
        this.$http.activityManage.update(mock).then(res => {
          this.$message({
            type: 'success',
            message: '保存成功',
            lockScroll: false
          })
          this.$router.back(-1)
        }, (err) => {
          this.$message({
            type: 'error',
            message: err.data.message
          })
        })
        return
      }
      this.$http.activityManage.addCommodity(mock).then(
        res => {
          this.$message({
            type: 'success',
            message: '保存成功',
            lockScroll: false
          })
          this.$router.back(-1)
        },
        (err) => {
          this.$message({
            type: 'error',
            message: err.data.message
          })
        }
      )
    },
    // 点击取消，路由跳转
    handleCancle () {
      this.$confirm('你确定放弃编辑吗', '警告', {
        confirmButtonText: '返回活动页面',
        cancelButtonText: '继续编辑',
        type: 'warning',
        lockScroll: false
      })
        .then(() => {
          //
          this.$router.back(-1)
        })
        .catch(() => { })
    },
    // 删除一个活动商品
    deleteCommodity () {
      if (this.selectList.length === 0) {
        this.$message({
          type: 'success',
          message: '没有选中内容',
          lockScroll: false
        })
        return
      }
      remove.call(this, () => {
        this.checkList = this.checkList.filter(item => {
          let flag = true
          for (let i = 0; i < this.selectList.length; i++) {
            if (item.itemId === this.selectList[i].itemId) {
              flag = false
            }
          }
          return flag
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.tableData = this.checkList.slice(0, this.pageSize)
        this.selectInfo()
        this.$refs.multipleTable.clearSelection()
      })
    },
    selectInfo () {
      let arr = []
      if (this.input.trim() === '') {
        if (this.value !== '') {
          arr = this.checkList.filter(item => {
            return item.listParent === this.value
          })
        } else {
          this.tableData = this.checkList.slice(0, this.pageSize)
          return
        }
      } else {
        if (this.value !== '') {
          arr = this.checkList.filter(item => {
            return (
              item.listParent === this.value &&
              item.itemName.search(this.input.trim()) !== -1
            )
          })
        } else {
          arr = this.checkList.filter(item => {
            return item.itemName.search(this.input.trim()) !== -1
          })
        }
      }
      this.searchData = arr
      this.tableData = this.searchData.slice(0, this.pageSize)
    },
    // 搜索活动商品
    search () {
      this.selectInfo()
    },
    // 添加的活动商品分页
    currentChanges ({ currentPage }) {
      if (this.value.length > 0 || this.input.length > 0) {
        this.tableData = this.searchData.slice(
          (currentPage - 1) * this.pageSize,
          currentPage * this.pageSize
        )
        return
      }
      this.tableData = this.checkList.slice(
        (currentPage - 1) * this.pageSize,
        currentPage * this.pageSize
      )
    },
    // 选中所有商品
    selectAll () {
      this.toggleSelection(this.checkList)
    },
    // 改变活动商品的选中
    handleSelect (val) {
      this.selectList = val
    },
    // select选择改变
    optionsChange () {
      this.selectInfo()
    },
    // 添加的活动商品搜索
    dialogSelectChange () {
      this.dialogShopSearch(1)
    },
    // 添加的活动商品搜索
    dialogSearch () {
      this.dialogShopSearch(1)
    },
    dialogShopSearch (current) {
      this.$http.activityManage
        .getDialogSearch(
          current,
          this.pageSize,
          this.dialogInput,
          this.dialogValue
        )
        .then(
          res => {
            this.selectRecord = res.data.data.itemCount
            this.tableList = res.data.data.itemInfos
          },
          (err) => {
            this.$message({
              type: 'error',
              message: err.data.message
            })
          }
        )
    }
  }
}
</script>
<style lang="scss" scoped>
.from-group {
  box-sizing: border-box;
  padding: 0px 13px;
  > div {
    margin-top: 20px;
    width: 660px;
  }
  .form-item {
    line-height: 20px;
    border-radius: 4px;
    text-align: left;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid rgba(187, 187, 187, 1);
    padding: 10px 20px;
    display: flex;
    align-items: center;
    > span,
    > div {
      margin: 0px 15px;
    }
    .form-datetime,
    .form-input,
    textarea {
      width: 600px;
    }
    textarea {
      height: 114px;
      border-radius: 10px;
    }
  }
}
.btn-list {
  position: absolute;
  display: flex;
  justify-content: space-between;
  z-index: 100;
  right: 100px;
  width: 750px;
  height: 32px;
  margin-top: 20px;
  border: none;
  > div {
    width: 200px;
    margin-top: -5px;
  }
  > button {
    border: 1px solid #ccc;
    width: 100px;
    height: 30px;
    cursor: pointer;
  }
}
.footer {
  padding-top: 20px;
  border-top: none;
  .control-container {
    justify-content: space-around;
    display: flex;
    margin: 40px auto;
    width: 600px;
    padding: 0;
    text-align: center;
    border: none;
    margin-bottom: 120px;
    > button {
      width: 130px;
      height: 50px;
    }
  }
}
.dialog {
  background: none;
  .btn-list {
    position: absolute;
    display: flex;
    justify-content: space-between;
    z-index: 100;
    right: 100px;
    width: 450px;
    height: 32px;
    margin-top: 20px;
    border: none;
    > div {
      width: 200px;
      margin-top: -5px;
    }
  }
}
</style>
