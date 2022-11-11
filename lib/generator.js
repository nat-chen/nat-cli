import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import downloadGitRepo from 'download-git-repo';
import util from 'util';
import path from 'path';
import { getRepoList, getTagList } from './http.js';

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();
  try {
    const result = await fn(...args);
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail('Request failed, refetch...')
  }
}

export default class Generator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 获取用户选择的模板
  async getRepo() {
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
    if (!repoList) return;
    // 过滤
    const repos = repoList.map(item => item.name);
    // 选择模板
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project',
    });
    return repo;
  }

  async getTag(repo) {
    const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo);
    if (!tags) return;
    // 过滤
    const tagsList = tags.map(item => item.name);
    // 选择需要下载的 tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: 'Please choose a tag to create project',
    });
    return tag;
  }

  async download(repo, tag) {
    const requestUrl = `vuejs/${repo}${tag?'#'+tag:''}`;
    await wrapLoading(
      this.downloadGitRepo,
      'waiting download template',
      requestUrl,
      path.resolve(process.cwd(), this.targetDir)
    );
  }

  async create() {
    const repo = await this.getRepo();
    const tag = await this.getTag(repo);
    await this.download(repo, tag);
    // 4）模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
    console.log('  npm run dev\r\n');
  }
}