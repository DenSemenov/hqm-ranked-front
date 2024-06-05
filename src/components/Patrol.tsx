import { useSearchParams } from "react-router-dom";
import ReplayViewer from "./ReplayViewer";
import { useEffect, useState } from "react";

const Patrol = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [currentId, setCurrentId] = useState<string>("");

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setCurrentId(id)
        }
    }, []);

    return currentId ? <ReplayViewer reportId={currentId} /> : <div />
}

export default Patrol;