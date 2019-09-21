import React, { useState, useEffect, useRef, useCallback } from "react"

import BackgroundImage from "gatsby-background-image"

import style from "./index.module.scss"

import Icon from "@mdi/react"
import {
    mdiArrowRight,
    mdiArrowLeft,
    mdiPause,
    mdiPlay,
    mdiLoading,
} from "@mdi/js"

import { CSSTransition, TransitionGroup } from "react-transition-group"

const BackgroundSlider = props => {
    const [cursor, setCursor] = useState(0)
    const [isPaused, setPaused] = useState(false)
    const [loading, setLoading] = useState(false)
    const [delay, setDelay] = useState(5000)
    const maxLen = props.data.allFile.edges.length - 1

    const isLoading = loading[0] || loading[1]

    const _pause = () => {
        setPaused(true)
    }

    const _resume = () => {
        setPaused(false)
    }

    const _reset = () => {
        setDelay(null)
        setDelay(delay)
    }

    const _next = reset => () => {
        if (isLoading) return
        setCursor(cursor === maxLen ? 0 : cursor + 1)
        setLoading([false, true])

        if (reset) {
            _reset()
        }
    }

    const _prev = reset => () => {
        if (isLoading) return

        setCursor(cursor === 0 ? maxLen : cursor - 1)
        setLoading([true, false])

        if (reset) {
            _reset()
        }
    }

    const _onLoad = inx => () => {
        if (inx === 2) {
            setLoading([loading[0], false])
        }

        if (inx === 0) {
            setLoading([false, loading[1]])
        }

        if ((inx === 0 || inx === 2) && !isPaused) {
            _resume()
        }
    }

    const _start = () => {
        useInterval(_next(maxLen, false), isPaused || isLoading ? null : delay)
    }

    const listCursors = () => {
        switch (cursor) {
            case 0:
                return [maxLen - 1, cursor, cursor + 1]
            case maxLen:
                return [cursor - 1, cursor, 0]
            default:
                return [cursor - 1, cursor, cursor + 1]
        }
    }

    _start()

    const [prev, next, cursors] = [_prev(true), _next(true), listCursors()]

    const sliderController = (
        <>
            <div className={style.control_wrapper}>
                <div className={style.tracker}>
                    {cursors[1]}/{maxLen}
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
                    onClick={isPaused ? _resume : _pause}
                >
                    {isPaused ? (
                        <Icon path={mdiPlay} title="Resume" size={1.1} />
                    ) : (
                        <Icon path={mdiPause} title="Pause" size={1.1} />
                    )}
                </div>
            </div>
            <div className={style.loader}>
                {isLoading && (
                    <Icon
                        path={mdiLoading}
                        title="Loading..."
                        size={2}
                        spin={true}
                        color={"white"}
                    />
                )}
            </div>
        </>
    )

    return (
        <div className={`${style.background_slider}`}>
            {sliderController}

            <TransitionGroup>
                {cursors.map((cur, inx) => (
                    <CSSTransition
                        key={`slide-${inx}`}
                        in={inx === 1}
                        timeout={1000}
                        classNames={style.slide}
                        classNames={{ ...style }}
                        onEnter={() => {
                            console.log("onEnter")
                        }}
                        enter
                    >
                        <Slide
                            imageData={props.data.allFile.edges[cur].node}
                            current={inx === 1}
                            onLoad={_onLoad(inx, cur)}
                        >
                            <div className={style.metadata}>
                                {JSON.stringify(cursors, null, 2)}
                            </div>
                        </Slide>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    )
}

const Slide = props => {
    const { onLoad, onStartLoad, imageData, current, children } = props
    const classCSS = current && style.slide_active
    return (
        <BackgroundImage
            Tag={`div`}
            className={`${style.background_image} ${style.slide}`}
            fluid={imageData.childImageSharp.fluid}
            onLoad={onLoad}
            onStartLoad={onStartLoad}
            fadeIn={false}
            loading={"eager"}
            critical={true}
            backgroundColor={imageData.colors.muted}
            preserveStackingContext={false}
        >
            <div
                className={style.background_tint}
                style={{ backgroundColor: `${imageData.colors.muted}40` }}
            />
            {children}
        </BackgroundImage>
    )
}

function useInterval(callback, delay) {
    const savedCallback = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        function tick() {
            savedCallback.current()
        }
        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}

export default BackgroundSlider
