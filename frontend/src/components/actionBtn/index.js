import React from "react"

import style from "./index.module.scss"

const QuickActionButton = ({ children }) => {
    return <button className={style.action_btn}>{children}</button>
}

export default QuickActionButton
