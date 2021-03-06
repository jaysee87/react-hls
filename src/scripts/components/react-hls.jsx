'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';

class ReactHls extends React.Component {
    constructor (props) {
        super(props);
        this.frag = null;
        this.video = null;
        this.hls = null;
        this.m3u8 = null;
    }

    componentDidUpdate () {
    // Only want to reload if the url is different;
        if (this.m3u8 !== this.props.url){
            this.video.muted = true;
            this._initPlayer();
        }
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
        this.m3u8 = url;  // Used to determine if url has changed for componentDidUpdate()

        hls.loadSource(url);
        hls.attachMedia(this.video);
    
        hls.on(Hls.Events.FRAG_LOADED, (e, d)=>{
            // TODO Figure out why data.levels[0].details is returning undefined
            // data.levels[0] shows details undefined collapsed, but shows everything when expanded
            // Can remove this listener once resolved
            // Only want the very first fragment to determine DateTime local player's currentTime is in relation to
            if(!this.frag) {
                this.frag = d.frag.rawProgramDateTime; // Should be what local player's currentTime is in relation to
                if(this.props.getTime){
                    this.props.getTime(this.frag);
                }
            }
        })

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            // TODO Figure out why data.levels[0].details is returning undefined
            // data.levels[0] shows details undefined collapsed, but shows everything when expanded
            this.frag = null;
            if (autoplay) {
                this.video.play();
            }
        });

        hls.on(Hls.Events.ERROR, (error, data)=>{
            const errorobject = {}
            errorobject[error] = data;
            if (this.props.errorGetter){
                this.props.errorGetter(errorobject)
            }
        })

        this.hls = hls;
    }

    render () {
        let { playerId } = this.props;
        const { controls, width, height, poster, videoProps } = this.props;

        return (
            <div key={`react-hls-${playerId}`} className="player-area">
                <video ref={video => {this.video = video;}}
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
