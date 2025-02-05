import request from '@/utils/request'

export function getBook(params) {
  return request({
    url: 'book/data',
    method: 'get',
    params
  })
}

export function updateBook(data) {
  return request({
    url: 'book/update',
    method: 'put',
    data
  })
}
export function delBook(data) {
  return request({
    url: 'book/destroy',
    method: 'delete',
    data
  })
}

export function addBook(data) {
  return request({
    url: 'bookaudit/store',
    method: 'post',
    data
  })
}
export function getAuditBook(params) {
  return request({
    url: 'bookaudit/data',
    method: 'get',
    params
  })
}
export function updateAuditBook(data) {
  return request({
    url: 'bookaudit/update',
    method: 'post',
    data
  })
}
export function delAuditBook(data) {
  return request({
    url: 'bookaudit/destroy',
    method: 'delete',
    data
  })
}

export function addCategory(data) {
  return request({
    url: 'category/store',
    method: 'post',
    data
  })
}
export function updateCategory(data) {
  return request({
    url: 'category/update',
    method: 'post',
    data
  })
}

export function delCategory(data) {
  return request({
    url: 'category/destroy',
    method: 'delete',
    data
  })
}

export function getTag(params) {
  return request({
    url: 'tag/data',
    method: 'get',
    params
  })
}
export function addTag(data) {
  return request({
    url: 'tag/store',
    method: 'post',
    data
  })
}
export function updateTag(data) {
  return request({
    url: 'tag/update',
    method: 'post',
    data
  })
}
export function delTag(data) {
  return request({
    url: 'tag/destroy',
    method: 'delete',
    data
  })
}
// 章节审核小说列表

export function getChapterAll(params) {
  return request({
    url: 'chapteraudit/dataall',
    method: 'get',
    params
  })
}
export function batchAudit(data) {
  return request({
    url: 'book/batchAudit',
    method: 'post',
    data
  })
}
// 小说章节审核列表
export function getAuditChapter(params) {
  return request({
    url: 'chapteraudit/data',
    method: 'get',
    params
  })
}
export function addAuditChapter(data) {
  return request({
    url: 'chapteraudit/store',
    method: 'post',
    data
  })
}
export function updateAuditChapter(data) {
  return request({
    url: 'chapter/updateAuditChapter',
    method: 'post',
    data
  })
}
export function getChapterAuditContent(data) {
  return request({
    url: 'chapter/getChapterAuditContent',
    method: 'post',
    data
  })
}
export function toAuditChapter(data) {
  return request({
    url: 'chapteraudit/doaudit',
    method: 'post',
    data
  })
}
export function delAuditChapter(data) {
  return request({
    url: 'chapteraudit/destroy',
    method: 'post',
    data
  })
}
export function getChapterContent(data) {
  return request({
    url: 'chapteraudit/getChapterContent',
    method: 'post',
    data
  })
}
export function getChapterTitle(params) {
  return request({
    url: 'chapteraudit/getChapterTitle',
    method: 'get',
    params
  })
}

// 章节列表
export function getChapter(params) {
  return request({
    url: 'chapter/data',
    method: 'get',
    params
  })
}

export function updateChapter(data) {
  return request({
    url: 'chapter/update',
    method: 'post',
    data
  })
}
export function delChapter(data) {
  return request({
    url: 'chapter/del',
    method: 'post',
    data
  })
}

export function getLog(params) {
  return request({
    url: 'book/logData',
    method: 'get',
    params
  })
}
export function getAuditLog(params) {
  return request({
    url: 'bookaudit/logData',
    method: 'get',
    params
  })
}

export function bookImportDo(data) {
  return request({
    url: 'chapteraudit/importDo',
    method: 'post',
    data
  })
}
export function bookExport(data) {
  return request({
    url: 'book/export',
    method: 'post',
    data
  })
}

export function getComment(params) {
  return request({
    url: 'bookcomment/data',
    method: 'get',
    params
  })
}
export function replyComment(data) {
  return request({
    url: 'bookcomment/doreply',
    method: 'post',
    data
  })
}
export function delComment(data) {
  return request({
    url: 'bookcomment/destroy',
    method: 'post',
    data
  })
}
export function bookAuditImportDo(data) {
  return request({
    url: 'bookaudit/importDo',
    method: 'post',
    data
  })
}

export function preprocess(data) {
  return request({
    url: '/aetherupload/preprocess',
    method: 'post',
    data
  })
}

// 隔离书单
export function getBookBlackList(params) {
  return request({
    url: 'book/getBookBlackList',
    method: 'get',
    params
  })
}
export function addBookBlackList(data) {
  return request({
    url: 'book/addBookBlackList',
    method: 'post',
    data
  })
}
export function delBookBlackList(data) {
  return request({
    url: 'book/delBookBlackList',
    method: 'delete',
    data
  })
}

// 小说权利
export function getCopyright(params) {
  return request({
    url: 'bookCopyright/data',
    method: 'get',
    params
  })
}
export function updateCopyright(data) {
  return request({
    url: 'bookCopyright/updateCopyright',
    method: 'post',
    data
  })
}
export function importDoCopyright(params) {
  return request({
    url: 'bookCopyright/importDo',
    method: 'get',
    params
  })
}

export function destroyChapterByBookId(data) {
  return request({
    url: 'destroyChapterByBookId',
    method: 'post',
    data
  })
}
