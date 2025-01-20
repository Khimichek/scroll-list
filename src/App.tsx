import React, { useEffect, useState } from 'react';
import { fetchRepositories } from './Api';
import './App.css';
import { List, Button, Space, Input, Typography, Spin, Alert } from 'antd';

const { Title } = Typography;

interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
}

const App: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Новые состояния для редактирования
  const [editIndex, setEditIndex] = useState<number | null>(null); // Индекс редактируемого репозитория
  const [editValue, setEditValue] = useState<string>(''); // Значение для редактирования


  useEffect(() => {
    const loadRepositories = async () => {
      try {
        setLoading(true);
        const repositories = await fetchRepositories(page);
        setRepos((prev) => [...prev, ...repositories]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    loadRepositories();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Проверяем, достиг ли пользователь конца страницы
      if (scrollY + windowHeight >= documentHeight - 100 && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]);

   // Функция для начала редактирования репозитория
   const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(repos[index].name); // Устанавливаем текущее значение для редактирования
  };

  // Функция для сохранения изменений
  const saveEdit = () => {
    if (editIndex !== null) {
      const updatedRepos = [...repos];
      updatedRepos[editIndex].name = editValue; // Обновляем название репозитория
      setRepos(updatedRepos); // Обновляем состояние
      setEditIndex(null); // Сбрасываем индекс редактируемого элемента
      setEditValue(''); // Сбрасываем значение
    }
  };

  // Функция для удаления репозитория
  const deleteRepo = (index: number) => {
    const updatedRepos = repos.filter((_, i) => i !== index); // Удаляем репозиторий по индексу
    setRepos(updatedRepos); // Обновляем состояние
  };

  return (
    <div className="App" style={{ padding: '20px' }}> 
      <Title level={1}>Репозитории JavaScript</Title>
      {error && <Alert message={error} type="error" />}
      <List
        bordered
        dataSource={repos}
        renderItem={(repo, index) => (
          <List.Item key={repo.id}>
            {editIndex === index ? (
            <>
              <Input
                type="text"
                value={editValue} // Поле ввода для редактирования
                onChange={(e) => setEditValue(e.target.value)} // Обновляем значение редактируемого репозитория
              />
              <Button onClick={saveEdit}>Сохранить</Button> {/* Кнопка для сохранения изменений */}
            </>
          ) : (
            <>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
            <Space>
            <Button onClick={() => handleEdit(index)}>Редактировать</Button> {/* Кнопка для редактирования */}
              <Button onClick={() => deleteRepo(index)}>Удалить</Button> {/* Кнопка для удаления репозитория */}
              </Space>
            </>
          )}
          </List.Item>
        )}
      />
      {loading && <Spin tip="Загрузка..." />}
    </div>
  );
};

export default App;