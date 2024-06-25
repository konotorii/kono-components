import {ReactNode} from "react";

const context: ReactNode = <></>

interface ApiProps {
    type: "INFO" | "SUCCESS" | "WARNING" | "DEBUG",
    title: string | ReactNode,
    message: string | ReactNode,
}

function api(props: ApiProps) {
    switch (props.type) {
        case "WARNING":

            break;
        case "DEBUG":

            break;
        case "INFO":

            break;
        case "SUCCESS":

            break;
    }
}

const useNotifications = () => {
    return {context, api}
}

export default useNotifications;