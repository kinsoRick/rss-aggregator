import constants from './constant.js';

const parse = (response) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(response.data.contents, 'text/xml');
  const error = data.querySelector('parsererror');
  const channel = data.querySelector('channel');
  if (error) {
    const context = new Error(constants.errors.PARSE);
    throw context;
  }

  return {
    postsNodes: [...data.querySelectorAll('item')],
    channel,
  };
};

export default parse;
