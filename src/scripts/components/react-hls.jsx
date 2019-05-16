'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';
let $video;

class ReactHls extends React.Component {
    constructor (props) {
        super(props);

        this.hls = null;
    }

    componentDidUpdate () {
        this._initPlayer();
    }

    componentDidMount () {
        this._initPlayer();
    }

    componentWillUnmount () {
        let { hls } = this;

        if (hls) {
            hls.destroy();
        }
    }

    _initPlayer () {
        if (this.hls) {
            this.hls.destroy();
        }

        let { url, autoplay, hlsConfig } = this.props;
        let hls = new Hls(hlsConfig);

        hls.loadSource(url);
        hls.attachMedia($video);
        hls.on(Hls.Events.FRAG_CHANGED, (event, data) => {
            console.log(data.frag);
            if (this.props.getTime){this.props.getTime({
                rawProgramDateTime: data.frag.rawProgramDateTime,
                start: data.frag.start
            });}
        })
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (autoplay) {
                $video.play();
            }
        });

        this.hls = hls;
    }

    render () {
        let { playerId } = this.props;
        const { controls, width, height, poster, videoProps } = this.props;

        return (
            <div key={`react-hls-${playerId}`} className="player-area">
                <video ref={video => {$video = video;}}
                       className="hls-player"
                       id={playerId}
                       controls={controls}
                       width={width}
                       height={height}
                       poster={poster}
                       {...videoProps}></video>
            </div>
        )
    }
}

ReactHls.propTypes = {
    url : PropTypes.string.isRequired,
    playerId: PropTypes.string.isRequired,
    getTime: PropTypes.func,
    autoplay : PropTypes.bool,
    hlsConfig : PropTypes.object, //https://github.com/dailymotion/hls.js/blob/master/API.md#fine-tuning
    controls : PropTypes.bool,
    width : PropTypes.number,
    height : PropTypes.number,
    poster : PropTypes.string,
    videoProps : PropTypes.object
}

ReactHls.defaultProps = {
    autoplay : false,
    hlsConfig : {},
    controls : true,
    width : 500,
    height : 375
}

export default ReactHls;
