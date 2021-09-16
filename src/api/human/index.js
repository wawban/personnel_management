import request from '@/router/axios'
// 机构用户 // url: "/mgr/task-engine-jvs/dept/tree/includeUsers",
//机构
export function dept_list() {
    return request({
        url: "/mgr/upms/dept/list",
        method: 'get'
    })
}
// 通过id查用户
export function dept_id(e) {
    return request({
        url: "/mgr/upms/get/query/dept/id/" + e.data,
        method: 'get'
    })
}

// 新增班次
export const shift_add = (data) => {
    return request({
        url: "/mgr/task-engine-jvs/shift/add",
        method: 'post',
        data: data
    })
}


