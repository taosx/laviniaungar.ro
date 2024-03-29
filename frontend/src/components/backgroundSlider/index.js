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
    const [isLoading, setLoading] = useState(true)
    const [delay, setDelay] = useState(5000)
    const maxLen = props.data.allFile.edges.length - 1

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

        if (reset) {
            _reset()
        }
    }

    const _prev = reset => () => {
        if (isLoading) return

        setCursor(cursor === 0 ? maxLen : cursor - 1)

        if (reset) {
            _reset()
        }
    }

    const _onLoad = () => {
        setLoading(false)

        if (!isPaused) {
            _resume()
        }
    }

    const _start = () => {
        useInterval(
            _next(maxLen, false),
            isPaused || isLoading ? null : delay,
            delay
        )
    }

    _start()

    const [prev, next] = [_prev(true), _next(true)]

    const sliderController = (
        <>
            <div className={style.control_wrapper}>
                <div className={style.tracker}>
                    {cursor}/{maxLen}
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

            <TransitionGroup component={null}>
                <CSSTransition
                    in={cursor != undefined}
                    key={`slide-${cursor}`}
                    timeout={2000}
                    classNames={{ ...style }}
                    unmountOnExit
                    mountOnEnter
                >
                    <Slide
                        onStartLoad={({ wasCached }) => {
                            setLoading(wasCached ? false : true)
                        }}
                        onLoad={_onLoad}
                        imageData={props.data.allFile.edges[cursor].node}
                    >
                        {props.children && (
                            <div className={style.metadata}>
                                {props.children}
                            </div>
                        )}
                    </Slide>
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}

const Slide = props => {
    const { onLoad, onStartLoad, imageData, current, children } = props

    return (
        <BackgroundImage
            Tag={`div`}
            className={`${style.background_image}`}
            fluid={imageData.childImageSharp.fluid}
            onLoad={onLoad}
            onStartLoad={onStartLoad}
            fadeIn={false}
            loading={"eager"}
            backgroundColor={imageData.colors.vibrant}
            preserveStackingContext={true}
        >
            <div
                className={style.background_tint}
                style={{ backgroundColor: `${imageData.colors.vibrant}40` }}
            />
            {children}
        </BackgroundImage>
    )
}

function useInterval(callback, delay, reset) {
    const savedCallback = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback, reset])

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
