'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactHls = require('components/react-hls');

var _reactHls2 = _interopRequireDefault(_reactHls);

require('styles/index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Index = function (_React$Component) {
    _inherits(Index, _React$Component);

    function Index(props) {
        _classCallCheck(this, Index);

        var _this = _possibleConstructorReturn(this, (Index.__proto__ || Object.getPrototypeOf(Index)).call(this, props));

        _this.state = {
            hlsUrl: 'http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8',
            destroy: false
        };

        _this._handleInputBlur = _this._handleInputBlur.bind(_this);
        _this._handleEnter = _this._handleEnter.bind(_this);
        _this._handleDestroyClick = _this._handleDestroyClick.bind(_this);
        return _this;
    }

    _createClass(Index, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            return !_lodash2.default.isEqual(nextState, this.state) || !_lodash2.default.isEqual(nextProps, this.props);
        }
    }, {
        key: '_handleInputBlur',
        value: function _handleInputBlur(e) {
            this.setState({
                hlsUrl: e.target.value
            });
        }
    }, {
        key: '_handleEnter',
        value: function _handleEnter(e) {
            if (e.keyCode === 13) {
                this.setState({
                    hlsUrl: e.target.value
                });
            }
        }
    }, {
        key: '_handleDestroyClick',
        value: function _handleDestroyClick() {
            this.setState({
                destroy: true
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                hlsUrl = _state.hlsUrl,
                destroy = _state.destroy;


            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'url-input-area' },
                    _react2.default.createElement(
                        'label',
                        null,
                        'hsl url : '
                    ),
                    _react2.default.createElement('input', { type: 'text',
                        defaultValue: hlsUrl,
                        onBlur: this._handleInputBlur,
                        onKeyUp: this._handleEnter })
                ),
                !destroy ? _react2.default.createElement(_reactHls2.default, { url: hlsUrl, videoProps: { loop: true } }) : null,
                _react2.default.createElement('br', null),
                _react2.default.createElement(
                    'button',
                    { className: 'destroy-btn',
                        onClick: this._handleDestroyClick },
                    'Destroy Video'
                )
            );
        }
    }]);

    return Index;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(Index, null), document.getElementById('container'));