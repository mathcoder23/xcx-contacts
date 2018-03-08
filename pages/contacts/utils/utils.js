/**
 * 本地数组搜索工具
 */
function localSearch(groups,search){
  console.log(groups,search)
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
  if (search.name && search.name.length>0 && user.name.indexOf(search.name)<0){
    return false
  }
  return true
}
/**
 * 判断是否是数组
 */
function isArray(o) {
  return Object.prototype.toString.call(o) == '[object Array]';
}
module.exports = {
  localSearch: localSearch
}