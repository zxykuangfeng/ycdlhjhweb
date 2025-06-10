import request from '@/utils/request';

// 镇信息管理接口
export function getTownList(params) {
  return request({
    url: '/town/list',
    method: 'get',
    params
  });
}


///screen/town/list
export function addTown(data) {
  return request({
    url: '/town/add',
    method: 'post',
    data
  });
}

export function getTownDetail(id) {
  return request({
    url: `/town/detail/${id}`,
    method: 'get'
  });
}

export function updateTown(data) {
  return request({
    url: '/town/edit',
    method: 'put',
    data
  });
}

export function deleteTown(id) {
  return request({
    url: `/town/delete/${id}`,
    method: 'delete'
  });
}

export function getChildData(pid) {
  return request({
    url: `/town/getChildData/${pid}`,
    method: 'get'
  });
}

// 隐患类型管理接口
export function getYhlxglList(params) {
  return request({
    url: '/yhlxgl/list',
    method: 'get',
    params
  });
}

export function addYhlxgl(data) {
  return request({
    url: '/yhlxgl/add',
    method: 'post',
    data
  });
}

export function getYhlxglDetail(id) {
  return request({
    url: `/yhlxgl/detail/${id}`,
    method: 'get'
  });
}

export function updateYhlxgl(data) {
  return request({
    url: '/yhlxgl/edit',
    method: 'put',
    data
  });
}

export function deleteYhlxgl(id) {
  return request({
    url: `/yhlxgl/delete/${id}`,
    method: 'delete'
  });
}

// 主道路管理接口
export function getRoadList(params) {
  return request({
    url: '/road/list',
    method: 'get',
    params
  });
}

export function addRoad(data) {
  return request({
    url: '/road/add',
    method: 'post',
    data
  });
}

export function getRoadDetail(id) {
  return request({
    url: `/road/detail/${id}`,
    method: 'get'
  });
}

export function getFacilityCount(id) {
  return request({
    url: `/road/getFacilityCount/${id}`,
    method: 'get'
  });
}

export function updateRoad(data) {
  return request({
    url: '/road/edit',
    method: 'put',
    data
  });
}

export function deleteRoad(id) {
  return request({
    url: `/road/delete/${id}`,
    method: 'delete'
  });
}

// 路段管理接口
export function getRoadSectionList(params) {
  return request({
    url: '/roadSection/list',
    method: 'get',
    params
  });
}

export function addRoadSection(data) {
  return request({
    url: '/roadSection/add',
    method: 'post',
    data
  });
}

export function getRoadSectionDetail(id) {
  return request({
    url: `/roadSection/detail/${id}`,
    method: 'get'
  });
}

export function updateRoadSection(data) {
  return request({
    url: '/roadSection/edit',
    method: 'put',
    data
  });
}

export function deleteRoadSection(id) {
  return request({
    url: `/roadSection/delete/${id}`,
    method: 'delete'
  });
}

// 路口管理接口
export function getRoadCrossingList(params) {
  return request({
    url: '/roadCrossing/list',
    method: 'get',
    params
  });
}

export function addRoadCrossing(data) {
  return request({
    url: '/roadCrossing/add',
    method: 'post',
    data
  });
}

export function getRoadCrossingDetail(id) {
  return request({
    url: `/roadCrossing/detail/${id}`,
    method: 'get'
  });
}

export function updateRoadCrossing(data) {
  return request({
    url: '/roadCrossing/edit',
    method: 'put',
    data
  });
}

export function deleteRoadCrossing(id) {
  return request({
    url: `/roadCrossing/delete/${id}`,
    method: 'delete'
  });
}

// 单位管理接口
export function getCompanyList(params) {
  return request({
    url: '/company/list',
    method: 'get',
    params
  });
}

export function addCompany(data) {
  return request({
    url: '/company/add',
    method: 'post',
    data
  });
}

export function getCompanyDetail(id) {
  return request({
    url: `/company/detail/${id}`,
    method: 'get'
  });
}

export function updateCompany(data) {
  return request({
    url: '/company/edit',
    method: 'put',
    data
  });
}

export function deleteCompany(id) {
  return request({
    url: `/company/delete/${id}`,
    method: 'delete'
  });
}

// 部门管理接口
export function getDeptList(params) {
  return request({
    url: '/dept/list',
    method: 'get',
    params
  });
}

export function addDept(data) {
  return request({
    url: '/dept/add',
    method: 'post',
    data
  });
}

export function getDeptDetail(id) {
  return request({
    url: `/dept/detail/${id}`,
    method: 'get'
  });
}

export function updateDept(data) {
  return request({
    url: '/dept/edit',
    method: 'put',
    data
  });
}

export function deleteDept(id) {
  return request({
    url: `/dept/delete/${id}`,
    method: 'delete'
  });
}

// 隐患管理接口
export function getPitfallList(params) {
  return request({
    url: '/pitfall/list',
    method: 'get',
    params
  });
}

export function approvePitfall(id) {
  return request({
    url: `/pitfall/approved/${id}`,
    method: 'post'
  });
}

export function rejectPitfall(data) {
  return request({
    url: '/pitfall/reject',
    method: 'post',
    data
  });
}

export function getPitfallDetail(id) {
  return request({
    url: `/pitfall/detail/${id}`,
    method: 'get'
  });
}

export function assignRepairTeam(data) {
  return request({
    url: `/pitfall/distribute`,
    method: 'post',
    data
  });
}


// 隐患修复申请接口
export function applyRepair(data) {
  return request({
    url: '/repair/apply',
    method: 'post',
    data
  });
}

export function getRepairApplyList(params) {
  return request({
    url: '/repair/applyList',
    method: 'get',
    params
  });
}

export function approveRepairApply(id) {
  return request({
    url: `/repair/applyApproved/${id}`,
    method: 'post'
  });
}

export function rejectRepairApply(data) {
  return request({
    url: '/repair/applyReject',
    method: 'post',
    data
  });
}

export function approveWorksRepair(data) {
  return request({
    url: '/works/repairApproved',
    method: 'post',
    data
  });
}

export function rejectWorksRepair(data) {
  return request({
    url: '/works/repairReject',
    method: 'post',
    data
  });
}


// 隐患修复接口
export function addRepair(data) {
  return request({
    url: '/repair/add',
    method: 'post',
    data
  });
}

export function getRepairList(params) {
  return request({
    url: '/repair/list',
    method: 'get',
    params
  });
}

export function approveRepair(id) {
  return request({
    url: `/repair/approved/${id}`,
    method: 'post'
  });
}

export function rejectRepair(data) {
  return request({
    url: '/repair/reject',
    method: 'post',
    data
  });
}

// 隐患库接口
export function getPitfallLibList(params) {
  return request({
    url: '/pitfallLib/list',
    method: 'get',
    params
  });
}

export function addPitfallLib(data) {
  return request({
    url: '/pitfallLib/add',
    method: 'post',
    data
  });
}

export function getPitfallLibDetail(id) {
  return request({
    url: `/pitfallLib/detail/${id}`,
    method: 'get'
  });
}

export function updatePitfallLib(data) {
  return request({
    url: '/pitfallLib/edit',
    method: 'put',
    data
  });
}

export function deletePitfallLib(id) {
  return request({
    url: `/pitfallLib/delete/${id}`,
    method: 'delete'
  });
}

export function deletePitfall(id) {
  return request({
    url: `/pitfall/delete/${id}`,
    method: 'delete'
  });
}
// 安全评分接口
export function getSafetyRatingTypes() {
  return request({
    url: '/safetyRating/types',
    method: 'get'
  });
}

export function getSafetyRatingList(params) {
  return request({
    url: '/safetyRating/list',
    method: 'get',
    params
  });
}

export function addSafetyRating(data) {
  return request({
    url: '/safetyRating/add',
    method: 'post',
    data
  });
}

export function getSafetyRatingDetail(id) {
  return request({
    url: `/safetyRating/detail/${id}`,
    method: 'get'
  });
}

export function updateSafetyRating(data) {
  return request({
    url: '/safetyRating/edit',
    method: 'put',
    data
  });
}

export function deleteSafetyRating(id) {
  return request({
    url: `/safetyRating/delete/${id}`,
    method: 'delete'
  });
}

// 占道施工接口
export function getRoadOccupationList(params) {

  console.log(7777777777777)
  return request({
    url: '/roadOccupation/list',
    method: 'get',
    params
  });
}

export function addRoadOccupation() {
  return request({
    url: `/roadOccupation/add`,
    method: 'post'
  });
}

export function approveRoadOccupation(id) {
  return request({
    url: `/roadOccupation/approved/${id}`,
    method: 'post'
  });
}

export function rejectRoadOccupation(data) {
  return request({
    url: '/roadOccupation/reject',
    method: 'post',
    data
  });
}

export function applyRoadOccupation(data) {
  return request({
    url: '/roadOccupation/apply',
    method: 'post',
    data
  });
}

export function getRoadOccupationApplyList(params) {
  return request({
    url: '/roadOccupation/applyList',
    method: 'get',
    params
  });
}

export function approveRoadOccupationApply(id) {
  return request({
    url: `/roadOccupation/applyApproved/${id}`,
    method: 'post'
  });
}

export function rejectRoadOccupationApply(data) {
  return request({
    url: '/roadOccupation/applyReject',
    method: 'post',
    data
  });
}

export function repairRoadOccupation(data) {
  return request({
    url: '/roadOccupation/repair',
    method: 'post',
    data
  });
}

export function getRoadOccupationRepairList(params) {
  return request({
    url: '/roadOccupation/repairList',
    method: 'get',
    params
  });
}

export function approveRoadOccupationRepair(id) {
  return request({
    url: `/roadOccupation/repairApproved/${id}`,
    method: 'post'
  });
}

export function rejectRoadOccupationRepair(data) {
  return request({
    url: '/roadOccupation/repairReject',
    method: 'post',
    data
  });
}

// 安全规则接口
export function getSafetyRulesList(params) {
  return request({
    url: '/safetyRules/list',
    method: 'get',
    params
  });
}

export function addSafetyRules(data) {
  return request({
    url: '/safetyRules/add',
    method: 'post',
    data
  });
}

export function getSafetyRulesDetail(id) {
  return request({
    url: `/safetyRules/detail/${id}`,
    method: 'get'
  });
}

export function updateSafetyRules(data) {
  return request({
    url: '/safetyRules/edit',
    method: 'put',
    data
  });
}

export function deleteSafetyRules(id) {
  return request({
    url: `/safetyRules/delete/${id}`,
    method: 'delete'
  });
}

//占道施工

export function getWorksList(params) {
  return request({
    url: '/works/list',
    method: 'get',
    params
  });
}

export function supplementWorks(data) {
  return request({
    url: '/works/supplement',
    method: 'post',
    data
  });
}

export function seeWorks(id) {
  return request({
    url: `/works/see/${id}`,
    method: 'get'
  });
}

export function worksRepair(data) {
  return request({
    url: `/works/repair`,
    method: 'post',
    data
  });
}

export function approveWorks(data) {
  return request({
    url: '/works/approved',
    method: 'post',
    data
  });
}

export function rejectWorks(data) {
  return request({
    url: '/works/reject',
    method: 'post',
    data
  });
}

export function repairWorks(data) {
  return request({
    url: '/works/repair',
    method: 'post',
    data
  });
}

export function seeRepairWorks(id) {
  return request({
    url: `/works/seeRepair/${id}`,
    method: 'get'
  });
}

export function approveRepairWorks(data) {
  return request({
    url: '/works/repairApproved',
    method: 'post',
    data
  });
}

export function rejectRepairWorks(data) {
  return request({
    url: '/works/repairReject',
    method: 'post',
    data
  });
}


export function screenRoadList(params) {
  return request({
    url: '/screen/road/road',
    method: 'get',
    params // 会被自动拼接成 query string: ?aid=xxx
  });
}

export function screenRoadChildList(id) {
  if(id){
    return request({
      url: `/screen/road/child/${id}`,
       method: 'get'
   });
  }else{
    return request({
      url: '/screen/road/child',
      method: 'get'
     });
  }
}
export function roadFacility(id) {
  if(id){
    return request({
      url: `/screen/road/facility/1/${id}`,
       method: 'get'
   });
  }else{
    return request({
      url: '/screen/road/facility/1',
      method: 'get'
     });
  }
}


export function roadFacilityRoad(id) {
  if(id){
    return request({
      url: `/screen/road/facility/3/${id}`,
       method: 'get'
   });
  }else{
    return request({
      url: '/screen/road/facility/3',
      method: 'get'
     });
  }
}


export function roadFacilityAll() {
    return request({
      url: `/screen/road/facility/0/100`,
       method: 'get'
   });

}
export function screenTownList(mid) {
  if(mid){
    return request({
    url: '/screen/town/list?mid='+mid,
    method: 'get'
   });
  }else{
    return request({
      url: '/screen/town/list',
      method: 'get'
     });
  }
  
}


// export function yhCount(mid) {
//   return request({
//     url: '/yh/count?mid='+mid,
//     method: 'get',
//     data
//   });
// }



export function yhCount(params = {}) {
  return request({
    url: '/screen/yh/count',
    method: 'get',
    params
  });
}




//资产列表
export function property(params = {}) {
  return request({
    url: '/screen/road/property',
    method: 'get',
    params, // 将参数传递到请求中
  });
}

//报告列表
export function getReportList(params) {
  return request({
    url: '/pitfall/report',
    method: 'get',
    params
  });
}


//报告添加
export function addReport(data) {
  return request({
    url: '/pitfall/report',
    method: 'post',
    data
  });
}
//报告下载
export function downloadReport(id) {
  return request({
    url: '/pitfall/report/'+id,
    method: 'get',
  });
}
//报告下载
export function reportShow(id) {
  return request({
    url: '/pitfall/report/'+id,
    method: 'get',
  });
}


export function updateReport(data) {
  return request({
    url: '/pitfall/report',
    method: 'put',
    data
  });
}


export function seeReport(id) {
  return request({
    url: '/pitfall/report/see/'+id,
    method: 'get'
  });
}
export function safeRoadScore(params) {
  return request({
    url: '/screen/road/safeRoadScore',
    method: 'get',
    params
  });
}


export function pitfallDetail(id) {
    return request({
      url: `/pitfall/detail/${id}`,
       method: 'get'
   });
}

// export function safeRoadChild(params) {
//   return request({
//     url: '/screen/road/safeRoadChild',
//     method: 'get',
//     params
//   });
// }


export function safeRoadChild(params = {}) {
  // 过滤掉 `null`、`undefined` 和 `""` 的参数
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== null && v !== undefined && v !== "")
  );

  // 生成查询字符串
  const queryString = new URLSearchParams(filteredParams).toString();

  return request({
    url: `/screen/road/safeRoadChild${queryString ? '?' + queryString : ''}`,
    method: 'get'
  });
}



//施工单位列表

export function worksMember() {
  return request({
    url: `/works/member2`,
     method: 'get'
 });
}


export function worksRepairAuditList() {
  return request({
    url: `/works/repairAuditList`,
     method: 'get'
 });
}


export function worksReason(params) {
  return request({
    url: `/works/reason`,
    method: 'get',
    params
 });
}

export function jcvDetail(params) {
  return request({
    url: `/screen/jcv/detail`,
     method: 'get',
     params
 });
}


export function jcvOp(params) {
  if (params.direction == 'next') {
    return request({
      url: `/screen/jcv/${params.id}/next`,
      method: 'get'
    });
  } else {
    return request({
      url: `/screen/jcv/${params.id}/pre`,
      method: 'get'
    });
  }

 
}




// addStrategy

export function addInspectionPlan(data) {
  return request({
    url: '/inspectionPlan/add',
    method: 'post',
    data
  });
}


export function inspectionPlanList() {
  return request({
    url: `/inspectionPlan/list`,
     method: 'get'
 });
}



export function inspectionPlanDetail(id) {
  return request({
    url: `/inspectionPlan/detail/${id}`,
     method: 'get'
 });
}


export function inspectionPlanChange(id) {
  return request({
    url: `/inspectionPlan/change/${id}`,
     method: 'get'
 });
}
 
export function adminCount(id) {
  return request({
    url: `/jb/tj`,
     method: 'get'
 });
}
 
export function sgqyList() {
  return request({
    url: `/sgqy/list`,
     method: 'get'
 });
}

export function sgqyAdd() {
  return request({
    url: `/sgqy/add`,
     method: 'get'
 });
}

export function sgqyCheck() {
  return request({
    url: `/sgqy/check`,
     method: 'get'
 });
}

export function sgqyDetail(id) {
  return request({
    url: `/sgqy/detail/${id}`,
     method: 'get'
 });
}

export function getCompanyInfo() {
  return request({
    url: `/sgqy/check`,
     method: 'get'
 });
}

export function addCompanyInfo(data) {
  console.log('data11111')
  console.log(data)
  return request({
    url: `/sgqy/add`,
    method: 'post',
    data
 });
}


export function sgxmList() {
  return request({
    url: `/sgxm/list`,
    method: 'get'
  });
}

export function sgxmAdd(data) {
  return request({
    url: `/sgxm/add`,
    method: 'post',
    data
  });
}

export function sgxmEdit(data) {
  return request({
    url: `/sgxm/edit`,
    method: 'put',
    data
  });
}

export function sgxmDetail(id) {
  return request({
    url: `/sgxm/detail/${id}`,
    method: 'get'
  });
}

export function sgxmDelete(id) {
  return request({
    url: `/sgxm/delete/${id}`,
    method: 'delete'
  });
}

export function sgxmApply(id) {
  return request({
    url: `/sgxm/apply/${id}`,
    method: 'get'
  });
}

export function sgxmApplyAdd(data) {
  return request({
    url: `/sgxm/apply/add`,
    method: 'post',
    data
  });
}

export function sgxmApplyEdit(data) {
  return request({
    url: `/sgxm/apply/edit`,
    method: 'put',
    data
  });
}

export function sgxmApplyDelete(id) {
  return request({
    url: `/sgxm/apply/delete/${id}`,
    method: 'delete'
  });
}

export function sgxmApplyList() {
  return request({
    url: `/sgxm/apply`,
    method: 'get'
  });
}

export function sgxmAudit(data) {
  return request({
    url: `/sgxm/audit`,
    method: 'post',
    data
  });
}

export function sgxmYs(data) {
  return request({
    url: `/sgxm/ys`,
    method: 'post',
    data
  });
}

export function sgxmRepair(data) {
  return request({
    url: `/sgxm/repair`,
    method: 'post',
    data
  });
}

export function sgxmApplyFor(id, data) {
  return request({
    url: `/sgxm/applyFor/${id}`,
    method: 'post',
    data
  });
}

export function sgxmApplyComplete(id, data) {
  return request({
    url: `/sgxm/applyComplete/${id}`,
    method: 'post',
    data
  });
}


export function facilityType(data) {
  return request({
    url: `/facilityType/list`,
    method: 'get',
    data
  });
}

export function applyAdd(data) {
  return request({
    url: `/sgxm/apply/add2`,
    method: 'post',
    data
  });
}


export function sgxmsAdd(data) {
  return request({
    url: '/sgxms/add',
    method: 'post',
    data
  });
}

export function sgxmsList(params) {
  return request({
    url: '/sgxms/list',
    method: 'get',
    params
  });
}

export function sgxmsDelete(id) {
  return request({
    url: `/sgxms/delete/${id}`,
    method: 'delete'
  });
}

export function sgxmsDetail(id) {
  return request({
    url: `/sgxms/detail/${id}`,
    method: 'get'
  });
}

export function sgxmsAudit(data) {
  return request({
    url: '/sgxms/audit',
    method: 'post',
    data
  });
}

export function sgxmsSg(data) {
  return request({
    url: '/sgxms/sg',
    method: 'post',
    data
  });
}

export function sgxmsYs(data) {
  return request({
    url: '/sgxms/ys',
    method: 'post',
    data
  });
}

// 排查结果记录接口
export function addResult(data) {
  return request({
    url: '/sgxms/result/add',
    method: 'post',
    data
  });
}

export function editResult(data) {
  return request({
    url: '/sgxms/result/edit',
    method: 'put',
    data
  });
}

export function getResultDetail(id) {
  return request({
    url: `/sgxms/result/detail/${id}`,
    method: 'get'
  });
}

export function getResultList(params) {
  return request({
    url: '/sgxms/result/list',
    method: 'get',
    params
  });
}

export function deleteResult(id) {
  return request({
    url: `/sgxms/result/delete/${id}`,
    method: 'delete'
  });
}

export function sgxmsAllList(id) {
  return request({
    url: `sgxms/allList`,
    method: 'get'
  });
}


// 事故管理接口
export function getAccidentList(params) {
  return request({
    url: '/accident/list',
    method: 'get',
    params
  });
}

export function getAccidentDetail(id) {
  return request({
    url: `/accident/detail/${id}`,
    method: 'get'
  });
}

export function accidentRecord(case_number) {
  return request({
    url: `/accident/record?case_number=${case_number}`,
    method: 'get'
  });
}


export function addAccident(data) {
  return request({
    url: '/accident/add',
    method: 'post',
    data
  });
}

export function editAccident(data) {
  return request({
    url: '/accident/edit',
    method: 'put',
    data
  });
}

export function deleteAccident(id) {
  return request({
    url: `/accident/delete/${id}`,
    method: 'delete'
  });
}

export function importAccident(data) {
  return request({
    url: '/accident/import',
    method: 'post',
    data
  });
}



export function screenAccidentList(params = {}) {
  return request({
    url: 'screen/accident/list',
    method: 'get',
    params
  });
}

export function screenAccidentCount(params = {}) {
  return request({
    url: 'screen/accident/count',
    method: 'get',
    params
  });
}
