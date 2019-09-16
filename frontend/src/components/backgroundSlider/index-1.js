import React, { PureComponent } from "react"
import style from "./index.module.scss"

import BackgroundImage from "gatsby-background-image"

import Icon from "@mdi/react"
import {
    mdiArrowRight,
    mdiArrowLeft,
    mdiPause,
    mdiPlay,
    mdiLoading,
} from "@mdi/js"

// props: data.allFile.edges[].node.childImageSharp.fluid
class BackgroundSliderMain extends PureComponent {
    state = {
        cursor: 0,
        paused: false,
        loading: false,
    }

    componentDidMount() {
        this._start()
    }

    componentWillUnmount() {
        this._pause()
    }

    // Load next after timeout
    _start = () => {
        const loadNext = this._next(
            this.state.cursor,
            this.props.data.allFile.edges.length - 1,
            false
        )

        this.handleTimeout = setTimeout(loadNext, 1000)
    }

    // onLoad, start new cycle
    _onLoad = (inx, cur) => () => {
        if (inx === 2 && cur !== 1) {
            this.setState({ loading: false })

            if (!this.state.paused) {
                this._start()
            }
        }
    }

    _next = (cursor, maxLength, reset) => () => {
        this.setState({
            cursor: cursor === maxLength ? 0 : cursor + 1,
            loading: true,
        })
        if (reset) {
            this._reset()
        }
    }

    _prev = (cursor, maxLength, reset) => () => {
        this.setState({
            cursor: cursor === 0 ? maxLength : cursor - 1,
            loading: true,
        })
        if (reset) {
            this._reset()
        }
    }

    _pause = () => {
        clearTimeout(this.handleTimeout)
        this.setState({ paused: true })
    }

    _resume = () => {
        clearTimeout(this.handleTimeout)
        this.setState({ paused: false })
        this._start()
    }

    _reset = () => {
        clearTimeout(this.handleTimeout)
    }

    listCursors = (cursor, maxLength) => {
        switch (cursor) {
            case maxLength:
                return [cursor - 1, cursor, 0]
            case 0:
                return [maxLength - 1, cursor, cursor + 1]
            default:
                return [cursor - 1, cursor, cursor + 1]
        }
    }

    render() {
        const maxLength = this.props.data.allFile.edges.length - 1

        const [prev, next, cursors] = [
            this._prev(this.state.cursor, maxLength, true),
            this._next(this.state.cursor, maxLength, true),
            this.listCursors(this.state.cursor, maxLength),
        ]

        const sliderController = (
            <div className={style.control_wrapper}>
                <div className={style.tracker}>
                    {cursors[1]}/{maxLength}
                </div>
                <div className={style.arrow} onClick={next}>
                    <Icon path={mdiArrowRight} title="Next" size={1.1} />
                </div>
                <div className={style.space} />
                <div className={style.arrow} onClick={prev}>
                    <Icon path={mdiArrowLeft} title="Previous" size={1.1} />
                </div>

                <div
                    className={style.pause}
                    onClick={this.state.paused ? this._resume : this._pause}
                >
                    {this.state.paused ? (
                        <Icon path={mdiPlay} title="Resume" size={1.1} />
                    ) : (
                        <Icon path={mdiPause} title="Pause" size={1.1} />
                    )}
                </div>
            </div>
        )

        return (
            <div className={`${style.background_slider}`}>
                {sliderController}

                <div className={style.loader}>
                    {this.state.loading && (
                        <Icon
                            path={mdiLoading}
                            title="Loading..."
                            size={2}
                            spin={true}
                            color={"white"}
                        />
                    )}
                </div>

                {cursors.map((cur, inx) => {
                    return (
                        <Slide
                            loading={!this.state.loading}
                            key={`slide-${inx}`}
                            imageData={this.props.data.allFile.edges[cur].node}
                            current={inx === 1}
                            onLoad={this._onLoad(inx, cur)}
                        >
                            <div className={style.metadata}>
                                {JSON.stringify(cursors, null, 2)}{" "}
                            </div>
                        </Slide>
                    )
                })}
            </div>
        )
    }
}

const Slide = ({ onLoad, onStartLoad, imageData, current, children }) => {
    return (
        <BackgroundImage
            Tag={`div`}
            className={`${style.background_image} ${
                current ? style.current : style.slide
            }`}
            fluid={imageData.childImageSharp.fluid}
            onLoad={onLoad}
            onStartLoad={onStartLoad}
            fadeIn={false}
            loading={"eager"}
            backgroundColor={imageData.colors.muted}
            preserveStackingContext={true}
        >
            <div
                className={style.background_tint}
                style={{ backgroundColor: `${imageData.colors.muted}40` }}
            />
            {children}
        </BackgroundImage>
    )
}

// export default BackgroundSliderMain
