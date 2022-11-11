import axios from 'axios';

axios.interceptors.response.use(res => {
  return res.data;
});

// 获取模板列表
export async function getRepoList() {
  return axios.get('https://api.github.com/orgs/vuejs/repos');
}

// 获取版本信息
export async function  getTagList(repo) {
  return axios.get(`https://api.github.com/repos/vuejs/${repo}/tags`)
}