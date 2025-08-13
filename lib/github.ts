export async function getRepoStars(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();
  return data.stargazers_count;
}