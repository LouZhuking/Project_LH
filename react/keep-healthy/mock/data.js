import Mock from 'mockjs'

const getImages = (page, pageSize = 10) => {
  // es6 使用的亮点 随机高度的随机图片的来源
  return Array.from({length:pageSize}, (_, i) => ({
    // 索引唯一
    id: `${page}-${i}`,
    height: Mock.Random.integer(200,300),
    url: Mock.Random.image('300x400', Mock.Random.color(), '#fff', 'img')
  }))
}

export default [
  {
    url: '/api/images',
    method : 'get',
    response: ({query}) => {
      const page = Number(query.page) || 1;
      return {
        code: 0,
        data: getImages(page)
      }
    }
  },

]