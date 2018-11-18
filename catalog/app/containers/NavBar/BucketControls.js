import { push } from 'connected-react-router/immutable';
import deburr from 'lodash/deburr';
import PT from 'prop-types';
import * as R from 'ramda';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Route, matchPath } from 'react-router-dom';
import * as RC from 'recompose';
import { createStructuredSelector } from 'reselect';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import * as style from 'constants/style';
import * as NamedRoutes from 'utils/NamedRoutes';
import { setSearchText, selectSearchText } from 'utils/SearchProvider';
import { composeComponent, composeHOC, wrap } from 'utils/reactTools';


const BUCKETS = [
  'alpha-quilt-storage',
  'quilt-test-public',
];

const withInvertedTheme =
  wrap(MuiThemeProvider, () => ({ theme: style.themeInverted }));

const BucketDisplay = composeComponent('NavBar.BucketControls.BucketDisplay',
  RC.setPropTypes({
    bucket: PT.string.isRequired,
    select: PT.func.isRequired,
  }),
  withStyles(({ spacing: { unit } }) => ({
    root: {
      marginRight: unit,
      textTransform: 'none !important',
    },
    s3: {
      opacity: 0.7,
    },
    bucket: {
      maxWidth: 200,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  })),
  ({ classes, bucket, select }) => (
    <Button
      color="inherit"
      className={classes.root}
      onClick={select}
    >
      <span className={classes.s3}>s3://</span>
      <span className={classes.bucket}>{bucket}</span>
      <Icon>expand_more</Icon>
    </Button>
  ));

const normalizeBucket = R.pipe(
  deburr,
  R.toLower,
  R.replace(/^[^a-z0-9]/g, ''),
  R.replace(/[^a-z0-9-.]/g, '-'),
);

const getCycled = (arr, value, offset) => {
  const index = arr.indexOf(value) + offset;
  const cycledIndex = ((index + 1 + arr.length + 1) % (arr.length + 1)) - 1;
  return arr[cycledIndex];
};

const BucketSelect = composeComponent('NavBar.BucketControls.BucketSelect',
  RC.setPropTypes({
    bucket: PT.string,
    cancel: PT.func.isRequired,
  }),
  connect(),
  NamedRoutes.inject(),
  RC.withProps({ suggestions: BUCKETS }),
  RC.withStateHandlers({
    value: '',
  }, {
    setValue: () => (value) => ({ value }),
    nextSuggestion: ({ value }, { suggestions }) => () => ({
      value: getCycled(suggestions, value, 1) || '',
    }),
    prevSuggestion: ({ value }, { suggestions }) => () => ({
      value: getCycled(suggestions, value, -1) || '',
    }),
  }),
  RC.withHandlers({
    go: ({ bucket, urls, dispatch, cancel }) => (to) => {
      if (to && bucket !== to) {
        dispatch(push(urls.bucketRoot(to)));
      }
      cancel();
    },
    handleChange: ({ setValue }) => (evt) => {
      setValue(normalizeBucket(evt.target.value));
    },
  }),
  RC.withHandlers({
    handleKey: ({
      go,
      value,
      cancel,
      nextSuggestion,
      prevSuggestion,
    }) => (evt) => {
      // eslint-disable-next-line default-case
      switch (evt.key) {
        case 'Enter':
          go(value);
          break;
        case 'Escape':
          cancel();
          break;
        case 'ArrowUp':
          prevSuggestion();
          break;
        case 'ArrowDown':
        case 'Tab':
          // prevent Tab from switching focus
          evt.preventDefault();
          nextSuggestion();
          break;
      }
    },
    handleSuggestion: ({ go, setValue }) => (s) => {
      setValue(s);
      go(s);
    },
  }),
  withStyles(({ spacing: { unit }, zIndex }) => ({
    input: {
      marginLeft: unit * 2,
    },
    button: {
      borderColor: 'rgba(255, 255, 255, 0.23)',
      marginLeft: unit,
    },
    popper: {
      zIndex: zIndex.appBar + 1,
    },
  })),
  RC.withState('inputRef', 'setInputRef', null),
  ({
    value,
    inputRef,
    setInputRef,
    handleKey,
    handleChange,
    suggestions,
    handleSuggestion,
    classes,
  }) => (
    <React.Fragment>
      <NavInput
        startAdornment={<InputAdornment>s3://</InputAdornment>}
        value={value}
        className={classes.input}
        autoFocus
        onKeyDown={handleKey}
        onChange={handleChange}
        placeholder=" jump to bucket"
        inputRef={setInputRef}
      />
      <Popper
        open
        anchorEl={inputRef}
        placement="bottom-end"
        className={classes.popper}
      >
        <Paper>
          <MenuList>
            {suggestions.map((s) => (
              <MenuItem
                key={s}
                onClick={() => handleSuggestion(s)}
                selected={s === value}
              >
                s3://{s}
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </Popper>
    </React.Fragment>
  ));

const getBucketSection = (pathname, paths) => {
  if (matchPath(pathname, { path: paths.bucketRoot, exact: true })) {
    return 'overview';
  }
  if (matchPath(pathname, { path: paths.bucketPackageList })) {
    return 'packages';
  }
  if (matchPath(pathname, { path: paths.bucketTree })) {
    return 'tree';
  }
  return false;
};

const NavTab = composeComponent('NavBar.BucketControls.Tab',
  withStyles(({ spacing: { unit } }) => ({
    root: {
      minHeight: 8 * unit,
      minWidth: 120,
      color: 'inherit !important',
      textDecoration: 'none !important',
    },
  })),
  RC.withProps({ component: Link }),
  Tab);

const NavInput = composeComponent('NavBar.BucketControls.NavInput',
  withInvertedTheme,
  withStyles(({ palette }) => ({
    underline: {
      '&:after': {
        borderBottomColor: palette.secondary.main,
      },
    },
    input: {
      textOverflow: 'ellipsis',
    },
  })),
  Input);

const Search = composeComponent('NavBar.BucketControls.Search',
  RC.setPropTypes({
    bucket: PT.string.isRequired,
  }),
  connect(createStructuredSelector({
    searchText: selectSearchText,
  })),
  NamedRoutes.inject(),
  RC.withHandlers({
    handleChange: ({ dispatch }) => (evt) => {
      dispatch(setSearchText(evt.target.value));
    },
    handleEnter: ({ dispatch, urls, bucket, searchText }) => (evt) => {
      if (evt.key === 'Enter') {
        /* suppress onSubmit (didn't actually find this to be a problem tho) */
        evt.preventDefault();
        // TODO: check out if encodeURIComponent is required
        dispatch(push(urls.bucketSearch(bucket, encodeURIComponent(searchText))));
      }
    },
  }),
  withStyles(({ shape: { borderRadius }, spacing: { unit }, palette }) => ({
    root: {
      background: fade(palette.common.white, 0.9),
      borderRadius,
      marginRight: 3 * unit,
      '&:hover': {
        background: palette.common.white,
      },
    },
    focused: {
      background: palette.common.white,
    },
    input: {
      paddingLeft: 4 * unit,
      textOverflow: 'ellipsis',
    },
    adornment: {
      justifyContent: 'center',
      pointerEvents: 'none',
      position: 'absolute',
      width: 4 * unit,
    },
  })),
  ({
    classes: { adornment, ...classes },
    handleChange,
    handleEnter,
    searchText,
  }) => (
    <InputBase
      startAdornment={
        <InputAdornment className={adornment}>
          <Icon>search</Icon>
        </InputAdornment>
      }
      classes={classes}
      placeholder="Search"
      onChange={handleChange}
      onKeyPress={handleEnter}
      value={searchText}
    />
  ));

const withBucket = composeHOC('NavBar.BucketControls.withBucket',
  NamedRoutes.inject({ urls: false }),
  (Component) => ({ paths, ...props }) => (
    <Route path={paths.bucketRoot}>
      {({ location, match }) => (
        <Component
          bucketSection={getBucketSection(location.pathname, paths)}
          bucket={match && match.params && match.params.bucket}
          {...props}
        />
      )}
    </Route>
  ));

export default composeComponent('NavBar.BucketControls',
  withBucket,
  NamedRoutes.inject({ paths: false }),
  RC.withStateHandlers({
    selecting: false,
  }, {
    select: () => () => ({ selecting: true }),
    cancel: () => () => ({ selecting: false }),
  }),
  withStyles(({ palette }) => ({
    root: {
      alignItems: 'center',
      display: 'flex',
      minWidth: 400,
      position: 'relative',
    },
    button: {
      borderColor: fade(palette.common.white, 0.23),
    },
  })),
  ({
    classes,
    urls,
    selecting,
    select,
    cancel,
    bucket,
    bucketSection,
  }) => (
    <div className={classes.root}>
      {bucket // eslint-disable-line no-nested-ternary
        ? (
          <React.Fragment>
            {selecting
              ? <BucketSelect bucket={bucket} cancel={cancel} />
              : <BucketDisplay bucket={bucket} select={select} />
            }
            <Search bucket={bucket} />
            <Tabs
              value={bucketSection}
              textColor="inherit"
            >
              <NavTab
                label="Overview"
                value="overview"
                to={urls.bucketRoot(bucket)}
              />
              <NavTab
                label="Packages"
                value="packages"
                to={urls.bucketPackageList(bucket)}
              />
              <NavTab
                label="Files"
                value="tree"
                to={urls.bucketTree(bucket)}
              />
            </Tabs>
          </React.Fragment>
        )
        : selecting
          ? <BucketSelect bucket={bucket} cancel={cancel} />
          : (
            <Button
              onClick={select}
              variant="outlined"
              className={classes.button}
              color="inherit"
            >
              Jump to bucket
            </Button>
          )
      }
    </div>
  ));