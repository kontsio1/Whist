import {Route, Routes} from "react-router-dom";
import {PageNotFound} from "./Utils/PageNotFound";
import {Home} from "./Component/Home";
import {Rules} from "./Component/Rules";
import {GameSetup} from "./Component/GameSetup";
import {GameScreen} from "./Component/GameScreen/GameScreen";
import {Stats} from "./Component/EndGameScreen/Stats";
import {EndGame} from "./Component/EndGameScreen/EndGame";
import {PlayerStats} from "./Component/EndGameScreen/PlayerStats";

export const AppRoutes =(props: any)=>{
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="*" element={<PageNotFound/>}/>
            <Route path="/rules" element={<Rules/>} />
            <Route path="/setup" element={<GameSetup/>} />
            <Route path="/game" element={<GameScreen/>} />
            <Route path="/endGame" element={<EndGame/>} />
            <Route path="/stats" element={<Stats/>} />
            <Route path="/stats" element={<Stats/>} />
            <Route path="/stats/:player" element={<PlayerStats/>} />
        </Routes>
    )
}