/**
 * Created by huangjinsheng468 on 2017/3/9.
 */

const getGuid = function () {
    var key = 'PARS-H5-DID'
    if(sessionStorage.getItem(key) === void 0 || sessionStorage.getItem(key) === null) {
        var res = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
            const r = Math.random() * 16 | 0
            const v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
        sessionStorage.setItem(key, res)
        return res
    }else{
        return sessionStorage.getItem(key)
    }
}

// export default getGuid
