var py = require('pinyin.js')
/**
 * 本地数组搜索工具
 */
function localSearch(groups,search){
  // console.log(groups,search)
  //防止干扰，深拷贝对象
  groups = JSON.parse(JSON.stringify(groups))
  
  if (isArray(groups)){
    //新的联系人组
    let newGroups = [] 
      groups.forEach(group=>{
        //遍历联系人组
        let users = group.users
        //搜索后的联系人
        let newUsers = [] 
        if(isArray(users)){
          //遍历联系人组中的联系人
          users.forEach(user=>{
            //判断是否显示联系人
            if(isShowUser(user,search)){
              newUsers.push(user)
            }
          })
          group.users = newUsers
        }
        //存在联系人添加到联系人组
        if (newUsers.length > 0) {
          newGroups.push(group)
        }
       
      })
      return newGroups
  }
  return groups
}
/**
 * 根据条件判断是否显示联系人
 */
function isShowUser(user,search){
  if (!search.name){
    return true
  }
  //name文字匹配
  if (search.name && search.name.length>0 && user.name.indexOf(search.name)>=0){
    return true
  }
  //中文首字母匹配
  let pyletter = py.getFirstLetter(user.name).toUpperCase()
  if(pyletter && pyletter.length>0 && pyletter.indexOf(search.name.toUpperCase())>=0){
    return true
  }
  return false
}
/**
 * 判断是否是数组
 */
function isArray(o) {
  return Object.prototype.toString.call(o) == '[object Array]';
}
/**
 * 联系人组装换为分组的联系人组
 */
function contactsToGroups(contacts){
  let groups = []
  if (isArray(contacts)){
    //遍历联系人组
    contacts.forEach(contact=>{
      //获取首字母
      let indexLetter = contact.pyFirst || py.getIndex(contact.name)
      let group = getObjByArrayOfKV(groups,"groupName",indexLetter)
      if (group){
        group.users.push(contact)
      }else{
        groups.push({
          groupName:indexLetter,
          users:[
            contact
          ]
        })
      }
    })
    //排序
    groups.sort(function(obj1,obj2){
      if (obj1.groupName==='#'){
        return -1
      } else if (obj2.groupName === '#'){
        return 1
      }
      if (obj1.groupName > obj2.groupName){
        return 1
      }else{
        return -1
      }
     
    })
   
  }
  return groups
}
//对象数组，通过对象中的k-v值来返回匹配的第一个对象
function getObjByArrayOfKV(array, key, value) {
  let obj = null
  if ("object" === typeof (array)) {
    array.every(item => {
      if ("object" === typeof item) {
        if ("undefined" !== typeof item[key]) {
          if (item[key] == value) {
            obj = item
            return false
          }
        }
      }
      return true
    })
  }
  return obj
}
module.exports = {
  localSearch: localSearch,
  contactsToGroups: contactsToGroups
}