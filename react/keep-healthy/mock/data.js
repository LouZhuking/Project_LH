import Mock from 'mockjs'

const getImages = (page, pageSize = 10) => {
  // es6 使用的亮点 随机高度的随机图片的来源
  return Array.from({
    length: pageSize
  }, (_, i) => ({
    // 索引唯一
    id: `${page}-${i}`,
    height: Mock.Random.integer(200, 300),
    url: Mock.Random.image('300x400', Mock.Random.color(), '#fff', 'img')
  }))
}

export default [{
  url: '/api/images',
  method: 'get',
  response: ({
    query
  }) => {
    const page = Number(query.page) || 1;
    return {
      code: 0,
      data: getImages(page)
    }
  }
},
{
  url: '/api/search',
  method: 'get',
  timeout: 1000,
  response: (req, res) => {
    // ? keyword=库洛米
    const keyword = req.query.keyword;
    let num = Math.floor(Math.random() * 10) + 1;
    let list = [];
    for (let i = 0; i < num; i++) {
      // 随机内容
      const randomData = Mock.mock({
        title: '@ctitle(3,6)',
      })
      list.push(`${randomData.title}${keyword}`)
    }
    return {
      code: 0,
      data: list,
    }
  }
},
{
  // 搜索热门建议
  url: '/api/hotlist',
  method: 'get',
  timeout: 1000,
  response: (req, res) => {
    return {
      code: 0,
      data: [{
        id: "101",
        title: "库洛米",
      },
      {
        id: "102",
        title: "美乐蒂",
      },
      {
        id: "103",
        title: "詹姆斯",
      }, 
      {
        id: "108",
        title: "夜游珠江微笑骑行派对",
      }, 
      {
        id: "109",
        title: "夜游珠江微笑骑行派对",
      }, 
      {
        id: "110",
        title: "夜游珠江微笑骑行派对",
      },
      ]
    }
  }
}

]