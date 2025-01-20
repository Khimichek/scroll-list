interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
}

export const fetchRepositories = async (
  page: number
): Promise<Repository[]> => {
  const response = await fetch(
    `https://api.github.com/repositories?since=${page}`
  );
  if (!response.ok) {
    throw new Error("Ошибка при загрузке репозиториев");
  }
  return response.json();
};
