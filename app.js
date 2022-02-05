const root = document.querySelector('#root');

const fetchAPI = async (inputValue) => {
  try {
    const apiFetch = await fetch(
      `https://cataas.com/cat/says/${inputValue}?json=true`
    );
    const apiJSON = await apiFetch.json();
    const catMeme = 'https://cataas.com' + apiJSON.url;
    return catMeme;
  } catch (error) {
    console.log(error);
  }
};

const characterValidation = (inputValue) => {
  if (inputValue === '') {
    return 'Empty';
  } else if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/g.test(inputValue)) {
    return '한국어';
  } else {
    return true;
  }
};

const Form = ({ makeMeme, errorMessage }) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (characterValidation(inputValue) !== true) {
      errorMessage(characterValidation(inputValue));
      return;
    }
    makeMeme(inputValue);
  };
  return (
    <div>
      <form action="" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Create a meme "
          value={inputValue}
          onChange={handleInputChange}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

const Favorites = ({ favorites }) => {
  if (favorites.length === 0) {
    return (
      <div className="favorites_box">
        <span>하트를 눌러 사진을 저장할 수 있어요^^</span>
      </div>
    );
  }

  const favoritesCounter = favorites.length === 0 ? null : favorites.length;
  return (
    <div className="favorites_box">
      <p>Favorites : {favoritesCounter}</p>
      <ul>
        {favorites.map((favorite) => (
          <li>
            <img src={favorite} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [error, setError] = React.useState('');
  const [catImage, setCatImage] = React.useState('');
  const [favorites, setFavorites] = React.useState(
    JSON.parse(localStorage.getItem('favorites')) || []
  );
  const initCat = async () => {
    const initMeme = await fetchAPI('Hello There');
    setCatImage(() => initMeme);
  };

  React.useEffect(() => {
    initCat();
  }, []);

  const makeMeme = async (inputValue) => {
    const catMeme = await fetchAPI(inputValue);
    setCatImage(() => catMeme);
  };
  const errorMessage = (validation) => {
    setError((prev) => validation);
  };
  const handleSave = (e) => {
    setFavorites((prev) => [...favorites, catImage]);
    localStorage.setItem('favorites', JSON.stringify([...favorites, catImage]));
  };
  return (
    <div>
      <h1>Cat Meme Generator</h1>
      <p className="input_error">
        {error ? `Error : ${error} is not supported` : null}
      </p>
      <Form makeMeme={makeMeme} errorMessage={errorMessage} />
      <div className="cat_main_box">
        {catImage ? <img src={catImage} alt="" /> : '...Loading, please wait!!'}
        <button onClick={handleSave}>❤</button>
      </div>
      <Favorites favorites={favorites} />
    </div>
  );
};

ReactDOM.render(<App />, root);
