const root = document.querySelector('#root');

const fetchAPI = async (inputValue) => {
  try {
    const apiFetch = await fetch(
      `https://cataas.com/cat/says/${inputValue}?json=true`
    );
    const apiJSON = await apiFetch.json();
    const catMeme = 'https://cataas.com' + apiJSON.url;
    console.log(catMeme);
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

const App = () => {
  const [error, setError] = React.useState('');
  const [catImage, setCatImage] = React.useState('');
  const [likeCounter, setLikeCounter] = React.useState(0);

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
  const handleLike = (e) => {
    setLikeCounter((prev) => prev + 1);
  };
  return (
    <div>
      <h1>Cat Meme Generator</h1>
      <p className="input_error">
        {error ? `Error : ${error} is not supported` : null}
      </p>
      <Form makeMeme={makeMeme} errorMessage={errorMessage} />
      <img className="cat_main_image" src={catImage} alt="" />
      <p></p>
      <button onClick={handleLike}>Like {likeCounter}</button>
    </div>
  );
};

ReactDOM.render(<App />, root);
