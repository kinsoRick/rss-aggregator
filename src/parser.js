import constants from './constant.js';

const parse = (response) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(response.data.contents, 'text/xml');
  const error = data.querySelector('parsererror');
  if (error) {
    const context = new Error(constants.errors.PARSE);
    throw context;
  }

  return {
    data, error,
  };
};

export default parse;
