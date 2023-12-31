import {Route, Routes} from "react-router-dom";
import {PageNotFound} from "./Utils/PageNotFound";
import {Home} from "./Component/Home";
import {Rules} from "./Component/Rules";
import {GameSetup} from "./Component/GameSetup";
import {GameScreen} from "./Component/GameScreen";

export const AppRoutes =(props: any)=>{
    return (
        <Routes>
            <Route path="*" element={<PageNotFound/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/rules" element={<Rules/>} />
            <Route path="/setup" element={<GameSetup/>} />
            <Route path="/game" element={<GameScreen/>} />
        </Routes>
    )
}