import axios from 'axios';
import { Command } from 'commander';
import chalk from 'chalk';

// Create a new commander command
const program = new Command();

// Function to fetch repository details
async function getRepoDetails(repoUrl: string) {
  const repoName = repoUrl.split('github.com/')[1];
  const apiUrl = `https://api.github.com/repos/${repoName}`;

  try {
    const response = await axios.get(apiUrl);
    const repo = response.data;

    console.log(chalk.blue(`Repository: ${repo.full_name}`));
    console.log(chalk.green(`Stars: ${repo.stargazers_count}`));
    console.log(chalk.yellow(`Forks: ${repo.forks_count}`));
    console.log(chalk.cyan(`Open Issues: ${repo.open_issues_count}`));
    console.log(chalk.magenta(`Latest Commit: ${repo.pushed_at}`));

    return repo;
  } catch (error) {
    console.error(chalk.red('Error fetching repo details:', error));
  }
}

// Function to list top contributors
async function getTopContributors(repoUrl: string) {
  const repoName = repoUrl.split('github.com/')[1];
  const apiUrl = `https://api.github.com/repos/${repoName}/contributors`;

  try {
    const response = await axios.get(apiUrl);
    const contributors = response.data;

    console.log(chalk.blue('\nTop Contributors:'));
    contributors.slice(0, 5).forEach((contributor: { login: string; contributions: number }) => {
      console.log(chalk.green(`${contributor.login}: ${contributor.contributions} contributions`));
    });
  } catch (error) {
    console.error(chalk.red('Error fetching contributors:', error));
  }
}

// Set up command-line interface
program
  .name('repo-analyzer')
  .description('CLI Tool to analyze GitHub repositories')
  .argument('<repo-url>', 'GitHub repository URL')
  .option('-c, --contributors', 'Show top contributors')
  .action(async (repoUrl, options) => {
    await getRepoDetails(repoUrl);

    if (options.contributors) {
      await getTopContributors(repoUrl);
    }
  });

// Parse command-line arguments
program.parse(process.argv);
