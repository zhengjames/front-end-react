'use strict';

exports.__esModule = true;
exports.getTabsCount = getTabsCount;
exports.getPanelsCount = getPanelsCount;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TabList = require('../components/TabList');

var _TabList2 = _interopRequireDefault(_TabList);

var _Tab = require('../components/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

var _TabPanel = require('../components/TabPanel');

var _TabPanel2 = _interopRequireDefault(_TabPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTabsCount(children) {
  var tabLists = _react2.default.Children.toArray(children).filter(function (x) {
    return x.type === _TabList2.default;
  });

  if (tabLists[0] && tabLists[0].props.children) {
    return _react2.default.Children.count(_react2.default.Children.toArray(tabLists[0].props.children).filter(function (x) {
      return x.type === _Tab2.default;
    }));
  }

  return 0;
}

function getPanelsCount(children) {
  return _react2.default.Children.count(_react2.default.Children.toArray(children).filter(function (x) {
    return x.type === _TabPanel2.default;
  }));
}