interface Repository {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
  }
  
  export const fetchRepositories = async (pageNumber: number): Promise<Repository[]> => {
    const response = await fetch(`${process.env.REACT_APP_GITHUB_API_URL}?q=javascript&sort=stars&order=asc&page=${pageNumber}`);
    
    if (!response.ok) {
      throw new Error('Не удалось получить репозитории');
    }
  
    const data = await response.json();
    return data.repositories || [];
  };