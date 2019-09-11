// 下拉选择数据，可以更新
const selectMenu = [
  {
    label: '状态:',
    select: [
      {
        value: 'Y',
        label: '启用'
      },
      {
        value: 'N',
        label: '过期'
      }
    ]
  },
  {
    label: '每页显示',
    select: [
      {
        value: 5,
        label: '5'
      },
      {
        value: 10,
        label: '10'
      },
      {
        value: 50,
        label: '50'
      },
      {
        value: 100,
        label: '100'
      }
    ]
  }
]

export { selectMenu }
