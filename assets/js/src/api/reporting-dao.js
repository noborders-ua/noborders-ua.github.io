/**
 * NoBorders API - ReportingsDAO
 */
import qs from '../utils/qs';

const ReportingsDAO = (() => {

  const getAll = (options) => {

    const filters = options ? { filters: options.filters } : {};
    const queryParams = qs({
      populate: '*',
      ...filters,
    });

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${window.API_KEY}`);

    return fetch(`${window.API_URL}/api/reportings?${queryParams}`, {
      headers,
    }).then(res => res.json());

  };

  return {
    getAll,
  };
})();

export default ReportingsDAO;
