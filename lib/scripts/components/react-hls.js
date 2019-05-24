'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _hls = require('hls.js');

var _hls2 = _interopRequireDefault(_hls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactHls = function (_React$Component) {
    _inherits(ReactHls, _React$Component);

    function ReactHls(props) {
        _classCallCheck(this, ReactHls);

        var _this = _possibleConstructorReturn(this, (ReactHls.__proto__ || Object.getPrototypeOf(ReactHls)).call(this, props));

        _this.frag = null;
        _this.video = null;
        _this.hls = null;
        _this.m3u8 = null;
        return _this;
    }

    _createClass(ReactHls, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            // Only want to reload if the url is different;
            if (this.m3u8 !== this.props.url) {
                this.video.muted = true;
                this._initPlayer();
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._initPlayer();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var hls = this.hls;


            if (hls) {
                hls.destroy();
            }
        }
    }, {
        key: '_initPlayer',
        value: function _initPlayer() {
            var _this2 = this;

            if (this.hls) {
                this.hls.destroy();
            }

            var _props = this.props,
                url = _props.url,
                autoplay = _props.autoplay,
                hlsConfig = _props.hlsConfig;

            var hls = new _hls2.default(hlsConfig);
            this.m3u8 = url; // Used to determine if url has changed for componentDidUpdate()

            hls.loadSource(url);
            hls.attachMedia(this.video);

            hls.on(_hls2.default.Events.FRAG_LOADED, function (e, d) {
                // TODO Figure out why data.levels[0].details is returning undefined
                // data.levels[0] shows details undefined collapsed, but shows everything when expanded
                // Can remove this listener once resolved
                // Only want the very first fragment to determine DateTime local player's currentTime is in relation to
                if (!_this2.frag) {
                    _this2.frag = d.frag.rawProgramDateTime; // Should be what local player's currentTime is in relation to
                    if (_this2.props.getTime) {
                        _this2.props.getTime(_this2.frag);
                    }
                }
            });

            hls.on(_hls2.default.Events.MANIFEST_PARSED, function () {
                // TODO Figure out why data.levels[0].details is returning undefined
                // data.levels[0] shows details undefined collapsed, but shows everything when expanded
                _this2.frag = null;
                if (autoplay) {
                    _this2.video.play();
                }
            });

            hls.on(_hls2.default.Events.ERROR, function (error, data) {
                var errorobject = {};
                errorobject[error] = data;
                if (_this2.props.errorGetter) {
                    _this2.props.errorGetter(errorobject);
                }
            });

            this.hls = hls;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var playerId = this.props.playerId;
            var _props2 = this.props,
                controls = _props2.controls,
                width = _props2.width,
                height = _props2.height,
                poster = _props2.poster,
                videoProps = _props2.videoProps;


            return _react2.default.createElement(
                'div',
                { key: 'react-hls-' + playerId, className: 'player-area' },
                _react2.default.createElement('video', _extends({ ref: function ref(video) {
                        _this3.video = video;
                    },
                    className: 'hls-player',
                    id: playerId,
                    controls: controls,
                    width: width,
                    height: height,
                    poster: poster
                }, videoProps))
            );
        }
    }]);

    return ReactHls;
}(_react2.default.Component);

ReactHls.propTypes = {
    url: _propTypes2.default.string.isRequired,
    playerId: _propTypes2.default.string.isRequired,
    getTime: _propTypes2.default.func,
    autoplay: _propTypes2.default.bool,
    hlsConfig: _propTypes2.default.object, //https://github.com/dailymotion/hls.js/blob/master/API.md#fine-tuning
    controls: _propTypes2.default.bool,
    width: _propTypes2.default.number,
    height: _propTypes2.default.number,
    poster: _propTypes2.default.string,
    videoProps: _propTypes2.default.object
};

ReactHls.defaultProps = {
    autoplay: false,
    hlsConfig: {},
    controls: true,
    width: 500,
    height: 375
};

exports.default = ReactHls;