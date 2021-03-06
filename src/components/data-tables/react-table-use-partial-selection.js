// Copy patsted from https://github.com/TanStack/table/blob/46bcc7c29d5f515f05f03a88a1e059cf240b54e0/src/plugin-hooks/useRowSelect.js
// Only added a filter for rowsById

import {
  useMountedLayoutEffect,
  actions,
  makePropGetter,
  ensurePluginOrder,
  useGetLatest,
} from 'react-table';

import { useMemo, useCallback } from 'react';

const pluginName = 'useRowSelect';

// Actions
actions.resetSelectedRows = 'resetSelectedRows';
actions.toggleAllRowsSelected = 'toggleAllRowsSelected';
actions.toggleRowSelected = 'toggleRowSelected';
actions.toggleAllPageRowsSelected = 'toggleAllPageRowsSelected';

export const useRowSelect = hooks => {
  hooks.getToggleRowSelectedProps = [defaultGetToggleRowSelectedProps];
  hooks.getToggleAllRowsSelectedProps = [defaultGetToggleAllRowsSelectedProps];
  hooks.getToggleAllPageRowsSelectedProps = [
    defaultGetToggleAllPageRowsSelectedProps
  ];
  hooks.stateReducers.push(reducer);
  hooks.useInstance.push(useInstance);
  hooks.prepareRow.push(prepareRow);
};

useRowSelect.pluginName = pluginName;

const defaultGetToggleRowSelectedProps = (props, { instance, row }) => {
  const { manualRowSelectedKey = 'isSelected' } = instance;
  let checked = false;

  if (row.original && row.original[manualRowSelectedKey]) {
    checked = true;
  } else {
    checked = row.isSelected;
  }

  return [
    props,
    {
      onChange: e => {
        row.toggleRowSelected(e.target.checked);
      },
      style: {
        cursor: 'pointer'
      },
      checked,
      title: 'Toggle Row Selected',
      indeterminate: row.isSomeSelected
    }
  ];
};

const defaultGetToggleAllRowsSelectedProps = (props, { instance }) => [
  props,
  {
    onChange: e => {
      instance.toggleAllRowsSelected(e.target.checked);
    },
    style: {
      cursor: 'pointer'
    },
    checked: instance.isAllRowsSelected,
    title: 'Toggle All Rows Selected',
    indeterminate: Boolean(
      !instance.isAllRowsSelected
      && Object.keys(instance.state.selectedRowIds).length
    )
  }
];

const defaultGetToggleAllPageRowsSelectedProps = (props, { instance }) => [
  props,
  {
    onChange(e) {
      instance.toggleAllPageRowsSelected(e.target.checked);
    },
    style: {
      cursor: 'pointer'
    },
    checked: instance.isAllPageRowsSelected,
    title: 'Toggle All Current Page Rows Selected',
    indeterminate: Boolean(
      !instance.isAllPageRowsSelected
      && instance.page.some(({ id }) => instance.state.selectedRowIds[id])
    )
  }
];

const filterOutDisabledRows = (rowsById) => {
  return Object.entries(rowsById).reduce((acc, [rowId, row]) => {
    if (!row.original.disableSelection) {
      acc[rowId] = row;
    }
    return acc;
  }, {})
}

// eslint-disable-next-line max-params
function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      selectedRowIds: {},
      ...state
    };
  }

  if (action.type === actions.resetSelectedRows) {
    return {
      ...state,
      selectedRowIds: instance.initialState.selectedRowIds || {}
    };
  }

  if (action.type === actions.toggleAllRowsSelected) {
    const { value: setSelected } = action;
    const {
      isAllRowsSelected,
      rowsById: origRowsById,
      nonGroupedRowsById: origNonGroupedRowsById = origRowsById
    } = instance;

    const rowsById = filterOutDisabledRows(origRowsById);
    const nonGroupedRowsById = filterOutDisabledRows(origNonGroupedRowsById);

    const selectAll
      = typeof setSelected !== 'undefined' ? setSelected : !isAllRowsSelected;

    // Only remove/add the rows that are visible on the screen
    //  Leave all the other rows that are selected alone.
    const selectedRowIds = Object.assign({}, state.selectedRowIds);

    if (selectAll) {
      Object.keys(nonGroupedRowsById).forEach(rowId => {
        selectedRowIds[rowId] = true;
      });
    } else {
      Object.keys(nonGroupedRowsById).forEach(rowId => {
        delete selectedRowIds[rowId];
      });
    }

    return {
      ...state,
      selectedRowIds
    };
  }

  if (action.type === actions.toggleRowSelected) {
    const { id, value: setSelected } = action;
    const { rowsById: origRowsById, selectSubRows = true, getSubRows } = instance;
    const rowsById = filterOutDisabledRows(origRowsById);

    const isSelected = state.selectedRowIds[id];
    const shouldExist
      = typeof setSelected !== 'undefined' ? setSelected : !isSelected;

    if (isSelected === shouldExist) {
      return state;
    }

    const newSelectedRowIds = { ...state.selectedRowIds };

    const handleRowById = id => {
      const row = rowsById[id];

      if (row) {
        if (!row.isGrouped) {
          if (shouldExist) {
            newSelectedRowIds[id] = true;
          } else {
            delete newSelectedRowIds[id];
          }
        }

        if (selectSubRows && getSubRows(row)) {
          return getSubRows(row).forEach(row => handleRowById(row.id));
        }
      }
    };

    handleRowById(id);

    return {
      ...state,
      selectedRowIds: newSelectedRowIds
    };
  }

  if (action.type === actions.toggleAllPageRowsSelected) {
    const { value: setSelected } = action;
    const {
      page,
      rowsById: origRowsById,
      selectSubRows = true,
      isAllPageRowsSelected,
      getSubRows
    } = instance;

    const rowsById = filterOutDisabledRows(origRowsById);

    const selectAll
      = typeof setSelected !== 'undefined' ? setSelected : !isAllPageRowsSelected;

    const newSelectedRowIds = { ...state.selectedRowIds };

    const handleRowById = id => {
      const row = rowsById[id];

      if (row) {
        if (!row.isGrouped) {
          if (selectAll) {
            newSelectedRowIds[id] = true;
          } else {
            delete newSelectedRowIds[id];
          }
        }

        if (selectSubRows && getSubRows(row)) {
          return getSubRows(row).forEach(row => handleRowById(row.id));
        }
      }
    };

    page.forEach(row => handleRowById(row.id));

    return {
      ...state,
      selectedRowIds: newSelectedRowIds
    };
  }
  return state;
}

function useInstance(instance) {
  const {
    data,
    rows,
    getHooks,
    plugins,
    rowsById: origRowsById,
    nonGroupedRowsById: origNonGroupedRowsById = origRowsById,
    autoResetSelectedRows = true,
    state: { selectedRowIds },
    selectSubRows = true,
    dispatch,
    page,
    getSubRows
  } = instance;

  const rowsById = filterOutDisabledRows(origRowsById);
  const nonGroupedRowsById = filterOutDisabledRows(origNonGroupedRowsById);

  ensurePluginOrder(
    plugins,
    ['useFilters', 'useGroupBy', 'useSortBy', 'useExpanded', 'usePagination'],
    'useRowSelect'
  );

  const selectedFlatRows = useMemo(() => {
    const selectedFlatRows = [];

    rows.forEach(row => {
      const isSelected = selectSubRows
        ? getRowIsSelected(row, selectedRowIds, getSubRows)
        : !!selectedRowIds[row.id];
      row.isSelected = !!isSelected;
      row.isSomeSelected = isSelected === null;

      if (isSelected) {
        selectedFlatRows.push(row);
      }
    });

    return selectedFlatRows;
  }, [rows, selectSubRows, selectedRowIds, getSubRows]);

  let isAllRowsSelected = Boolean(
    Object.keys(nonGroupedRowsById).length && Object.keys(selectedRowIds).length
  );

  let isAllPageRowsSelected = isAllRowsSelected;

  if (isAllRowsSelected) {
    if (Object.keys(nonGroupedRowsById).some(id => !selectedRowIds[id])) {
      isAllRowsSelected = false;
    }
  }

  if (!isAllRowsSelected) {
    if (page && page.length && page.some(({ id }) => !selectedRowIds[id])) {
      isAllPageRowsSelected = false;
    }
  }

  const getAutoResetSelectedRows = useGetLatest(autoResetSelectedRows);

  useMountedLayoutEffect(() => {
    if (getAutoResetSelectedRows()) {
      dispatch({ type: actions.resetSelectedRows });
    }
  }, [dispatch, data]);

  const toggleAllRowsSelected = useCallback(
    value => dispatch({ type: actions.toggleAllRowsSelected, value }),
    [dispatch]
  );

  const toggleAllPageRowsSelected = useCallback(
    value => dispatch({ type: actions.toggleAllPageRowsSelected, value }),
    [dispatch]
  );

  const toggleRowSelected = useCallback(
    (id, value) => dispatch({ type: actions.toggleRowSelected, id, value }),
    [dispatch]
  );

  const getInstance = useGetLatest(instance);

  const getToggleAllRowsSelectedProps = makePropGetter(
    getHooks().getToggleAllRowsSelectedProps,
    { instance: getInstance() }
  );

  const getToggleAllPageRowsSelectedProps = makePropGetter(
    getHooks().getToggleAllPageRowsSelectedProps,
    { instance: getInstance() }
  );

  Object.assign(instance, {
    selectedFlatRows,
    isAllRowsSelected,
    isAllPageRowsSelected,
    toggleRowSelected,
    toggleAllRowsSelected,
    getToggleAllRowsSelectedProps,
    getToggleAllPageRowsSelectedProps,
    toggleAllPageRowsSelected
  });
}

function prepareRow(row, { instance }) {
  row.toggleRowSelected = set => instance.toggleRowSelected(row.id, set);

  row.getToggleRowSelectedProps = makePropGetter(
    instance.getHooks().getToggleRowSelectedProps,
    { instance, row }
  );
}

function getRowIsSelected(row, selectedRowIds, getSubRows) {
  if (selectedRowIds[row.id]) {
    return true;
  }

  const subRows = getSubRows(row);

  if (subRows && subRows.length) {
    let allChildrenSelected = true;
    let someSelected = false;

    subRows.forEach(subRow => {
      // Bail out early if we know both of these
      if (someSelected && !allChildrenSelected) {
        return;
      }

      if (getRowIsSelected(subRow, selectedRowIds, getSubRows)) {
        someSelected = true;
      } else {
        allChildrenSelected = false;
      }
    });
    return allChildrenSelected ? true : someSelected ? null : false;
  }

  return false;
}
