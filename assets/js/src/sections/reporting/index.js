// noinspection JSVoidFunctionReturnValueUsed

/**
 * Reporting section
 */
import ReportingDAO from '../../api/reporting-dao';

const Reporting = (() => {

  const section = document.querySelector('#reporting');

  const categoriesRoot = section.querySelector('.reporting-categories');
  const articlesRoot = section.querySelector('.reporting-articles');

  const category = categoriesRoot.firstElementChild.cloneNode(true);
  const article = articlesRoot.firstElementChild.cloneNode(true);

  /** rendering categories */
  category.style.display = 'inherit';
  category.firstElementChild.classList.remove('active');

  // TODO: add translation
  let categoriesEnum = ['ВСІ'];

  const handleCategoryClick = (index) => () => {
    const options = {};
    if (index !== 0) {
      options.filters = {
        category: {
          $eq: categoriesEnum[index],
        },
      };
    }

    ReportingDAO.getAll(options).then((res) => {
      // removing active flag
      categories.forEach((item) => {
        item.firstElementChild.classList.remove('active');
      });
      // setting active flag to the current category
      categories[index].firstElementChild.classList.add('active');

      // displaying data
      displayArticles(res, categoriesEnum[index]);
    });
  };

  const appendCategory = (title, index) => {
    const element = category.cloneNode(true);
    const anchor = element.firstElementChild;
    anchor.innerText = title;
    // listen for a category click
    element.addEventListener('click', handleCategoryClick(index));
    categoriesRoot.append(element);
    return element;
  };

  const generateCategories = (res) => {
    const categoriesSet = new Set();
    res.data.forEach((report) => categoriesSet.add(report.attributes.category));
    categoriesSet.forEach((item) => categoriesEnum.push(item.toUpperCase()));

    const categories = categoriesEnum.map(appendCategory);
    // by default 'All' category is selected - no filters applied
    categories[0].firstElementChild.classList.add('active');
  };

  const displayArticles = (res, category) => {
    // remove prev. articles
    articlesRoot.innerHTML = '';

    // hide the section if no data at all
    if (!category && res.data && !res.data.length) {
      section.classList.add('d-none');
      return;
    }

    res.data.forEach((report) => {
      const articleEl = article.cloneNode(true);

      // setting preview image
      const bgEl = articleEl.querySelector('.article-bg');
      bgEl.style['background-image'] = `url(${ window.API_URL }${ report.attributes.preview.data.attributes.url })`;

      // setting category
      const badgeEl = articleEl.querySelector('.badge');
      badgeEl.innerText = report.attributes.category;

      // setting title
      const titleEl = articleEl.querySelector('.article-title');
      titleEl.innerText = report.attributes.title;

      // setting preview text
      const textEl = articleEl.querySelector('.article-text');
      // textEl.innerHTML = marked.parse(report.attributes.text.slice(0, 600).concat('...'));
      textEl.innerHTML = marked.parse(report.attributes.previewText);

      // setting preview text
      const dateEl = articleEl.querySelector('.article-date');
      dateEl.innerText = new Date(report.attributes.createdAt).toLocaleString('uk-UA', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });

      articlesRoot.append(articleEl);
    });
  };

  // TODO: add pagination
  /** fetching all reportings from API */
  ReportingDAO.getAll().then((res) => {
    generateCategories(res);
    displayArticles(res);
  });

})();

export default Reporting;
