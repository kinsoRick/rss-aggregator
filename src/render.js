import { flatten } from 'lodash';
import constants from './constant.js';
import nodes from './nodes.js';

const clearFeedback = () => {
  nodes.label.classList.remove('text-danger', 'text-success');
  nodes.label.textContent = '';
};

// <Creators> //
const createCard = (code, translate) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = translate(code);

  cardBody.append(cardTitle);
  card.append(cardBody);

  return card;
};

const createButton = (id, translate) => {
  const btn = document.createElement('button');
  btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  btn.dataset.id = id.toString();
  btn.dataset.bsToggle = 'modal';
  btn.dataset.bsTarget = '#modal';
  btn.textContent = translate('ui.VIEW');
  return btn;
};

const createFeedItem = (feed) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');

  const title = document.createElement('h3');
  title.classList.add('h6', 'm-0');
  title.textContent = feed.title;

  const description = document.createElement('p');
  description.classList.add('m-0', 'small', 'text-black-50');
  description.textContent = feed.description;

  li.append(title, description);
  return li;
};

const createPostItem = (post, viewedPosts, translate) => {
  const li = document.createElement('li');
  li.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );
  li.dataset.postId = post.id.toString();

  const link = document.createElement('a');
  if (viewedPosts.includes(post.id)) {
    link.classList.add('fw-normal', 'text-secondary');
  } else {
    link.classList.add('fw-bold');
  }
  link.href = post.link;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = post.title;

  const btn = createButton(post.id, translate);
  li.append(link, btn);
  return li;
};

// </CREATORS> //

// <FORM> //
const enableForm = () => {
  clearFeedback();
  nodes.rssInput.removeAttribute('readonly');
  nodes.rssbtn.disabled = false;
};

const disableForm = () => {
  clearFeedback();
  nodes.rssInput.setAttribute('readonly', 'true');
  nodes.rssbtn.disabled = true;
};

// </FORM> //

const renderError = (state, translate) => {
  if (state.error === null) return;
  clearFeedback();
  nodes.label.classList.add('text-danger');
  nodes.label.textContent = translate(`errors.${state.error}`);
};

const renderSuccess = (translate) => {
  clearFeedback();
  nodes.label.classList.add('text-success');
  nodes.label.textContent = translate('status.SUCCESS');
  nodes.form.reset();
};

const changeModalValues = (post) => {
  if (post === null) throw new Error(`Post Value must be more not null: ${post}`);
  nodes.modalTitle.textContent = post.title;
  nodes.modalInfo.textContent = post.description;
  nodes.modalBtn.href = post.link;
};

const setPostViewed = (postId) => {
  const item = nodes.posts.querySelector(`li[data-post-id="${postId}"]`);
  const link = item.querySelector('a');
  link.classList.remove('fw-bold');
  link.classList.add('fw-normal', 'text-secondary');
};

// <RENDERS> //
const renderFeeds = (feeds, translate) => {
  const card = createCard('ui.FEEDS', translate);

  nodes.feeds.textContent = '';
  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'rounded-0', 'border-0');
  const feedsItems = feeds.map(createFeedItem);

  feedsItems.forEach((item) => {
    feedsList.append(item);
  });

  nodes.feeds.append(card, feedsList);
};

const renderPosts = (postsFeed, viewedPosts, translate) => {
  nodes.posts.textContent = '';

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  const card = createCard('ui.POSTS', translate);

  const posts = flatten(postsFeed);
  if (posts.length < 1) return;

  const postsItems = posts.map((post) => createPostItem(post, viewedPosts, translate));
  postsItems.forEach((item) => {
    postsList.append(item);
  });

  nodes.posts.append(card, postsList);
};
// </RENDERS> //

const renderByStatus = (state, translate) => {
  enableForm();
  switch (state.status) {
    case constants.status.FILLING:
      break;
    case constants.status.SENDING:
      disableForm();
      break;
    case constants.status.INVALID:
      renderError(state, translate);
      break;
    case constants.status.RECEIVED:
      renderFeeds([...state.feeds], translate);
      renderPosts([...state.posts], [...state.postsViewed.all], translate);
      renderSuccess(translate);
      break;
    default:
      throw new Error(`Unknown status type -> ${state.status}`);
  }
};

const render = (state, path, translate) => {
  switch (path) {
    case 'error':
      renderError(state, translate);
      break;
    case 'status':
      renderByStatus(state, translate);
      break;
    case 'posts.0':
      renderPosts([...state.posts], [...state.postsViewed.all], translate);
      break;
    case 'postsViewed.current':
      changeModalValues(state.postsViewed.current);
      setPostViewed(state.postsViewed.current.id);
      break;
    default:
      break;
  }
};

export default render;
