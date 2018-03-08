var utils = require('utils/utils.js');

var app = getApp()
var bus = app.globalData.bus
Page({
  data:{
    // 当前选择的导航字母
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: 'A',
    // 导航字母
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'W', 'X', 'Y', 'Z'],
    groups: [
    ]
  },
  onLoad:function(options){
    //请求更新组列表数据
    bus.emit('contactsUpdateGroups').then(groups=>{
      if(groups){
        this.setData({ ConstGroups: groups })
        this.setData({ groups: groups })
      }
     
    })
    //请求更新联系人组数据
    bus.emit('contactsUpdateContacts').then(contacts => {
      //contacts 转换为groups
      if (contacts){
        let groups = utils.contactsToGroups(contacts)
        this.setData({ ConstGroups: groups })
        this.setData({ groups: groups })
      }
    })
    const res = wx.getSystemInfoSync(),
          letters = this.data.letters;
    //备份原始数据
    this.setData({ConstGroups:this.data.groups})
    // 设备信息
    this.setData({
      windowHeight: res.windowHeight,
      windowWidth: res.windowWidth,
      pixelRatio: res.pixelRatio
    });
    // 第一个字母距离顶部高度，css中定义nav高度为94%，所以 *0.94
    const navHeight = this.data.windowHeight * 0.94, // 
          eachLetterHeight = navHeight / 26,
          comTop = (this.data.windowHeight - navHeight) / 2, 
          temp = [];

    this.setData({
      eachLetterHeight: eachLetterHeight
    });

    // 求各字母距离设备左上角所处位置

    for(let i = 0, len = letters.length; i < len; i++) {
      const x = this.data.windowWidth - (10 + 50) / this.data.pixelRatio,
            y = comTop + (i * eachLetterHeight);
      temp.push([x, y]);
    }
    this.setData({
      lettersPosition: temp
    })
  },
  tabLetter(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index;
    this.setData({
      selected: index,
      scrollIntoView: index
    })
    
    this.cleanAcitvedStatus();
  },
  // 清除字母选中状态
  cleanAcitvedStatus() {
    setTimeout(() => {
      this.setData({
          selected: 0
      })
    }, 500);
  },
  touchmove(e) {
    const x = e.touches[0].clientX,
          y = e.touches[0].clientY,
          lettersPosition = this.data.lettersPosition,
          eachLetterHeight = this.data.eachLetterHeight,
          letters = this.data.letters;
    console.log(y);
    // 判断触摸点是否在字母导航栏上
    if(x >= lettersPosition[0][0]) {
      for(let i = 0, len = lettersPosition.length; i < len; i++) {
        // 判断落在哪个字母区域，取出对应字母所在数组的索引，根据索引更新selected及scroll-into-view的值
        const _y = lettersPosition[i][1], // 单个字母所处高度
              __y = _y + eachLetterHeight; // 单个字母最大高度取值范围
        if(y >= _y && y <= __y) {
           this.setData({
            selected: letters[i],
            scrollIntoView: letters[i]
          });
          break;
        }
      }
    }
  },
 
  touchend(e) {
    this.cleanAcitvedStatus();
  },
  search(){
    this.data.groups = utils.localSearch(this.data.ConstGroups, {
      name: this.data.searchText
    })
    this.setData({
      groups: this.data.groups
    })
  },
  //****************事件处理
  //点击搜索
  wxSearchFn(e) {
    
    this.search()
  },
  //搜索框
  wxSearchInput(e){
    let value = e.detail.value;
    this.setData({
      searchText:value
    })
    //搜索
    this.search()
  },
  //点击添加用户
  clickAddUser(e){
    wx.navigateTo({
      url: 'example/pages/contact/index'
    })
    
  
  },
  //点击联系人
  clickUser(e){
    let user = e.currentTarget.dataset.user
    bus.emit('contactsClicContact', user)
  }
  //长按联系人
  , longUserTap(e){
    let user = e.currentTarget.dataset.user
    console.log(user)
    wx.showActionSheet({
      itemList: ['编辑', '添加到手机通讯录'],
      success: function (res) {
        if (res.tapIndex == 0) {
          // 编辑联系人
          wx.navigateTo({
            url: 'example/pages/contact/index?params='+JSON.stringify(user)
          })
        } else if (res.tapIndex == 1) {
          // 添加到手机通讯录
          wx.addPhoneContact({
            nickName: user.name,
            firstName: user.name,
            remark: user.remarks,
            mobilePhoneNumber: user.tel1
          })
        
        }
      }
    })
  }
})
