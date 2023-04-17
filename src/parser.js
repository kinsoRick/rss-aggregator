const parse = (response) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(response.data.contents, 'text/xml');
  const error = data.querySelector('parsererror');

  return {
    data, error,
  };
};

export default parse;
