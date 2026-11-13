/* Прайс-лист: DataTables з українською локалізацією та групуванням за напрямом */
(function () {
  'use strict';
  if (!window.jQuery || !jQuery.fn.DataTable) return;

  jQuery('#price-table').DataTable({
    paging: false,
    info: true,
    responsive: true,
    autoWidth: false,
    order: [],
    columnDefs: [
      { targets: 0, responsivePriority: 1 },
      { targets: 2, responsivePriority: 2 },
      { targets: 1, responsivePriority: 3 },
    ],
    language: {
      search: 'Пошук послуги:',
      searchPlaceholder: 'наприклад, ін’єкції',
      zeroRecords: 'За вашим запитом нічого не знайдено',
      emptyTable: 'Прайс-лист оновлюється',
      info: 'Показано позицій: _TOTAL_',
      infoEmpty: 'Немає позицій',
      infoFiltered: '(знайдено серед _MAX_)',
      aria: {
        orderable: 'Сортувати за цим стовпцем',
        orderableReverse: 'Сортувати у зворотному порядку',
      },
    },
  });
})();
