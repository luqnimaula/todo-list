import React, {memo} from "react";
import {Route, Switch} from "react-router-dom";
import ToDo from "./ToDo";
import Detail from "./Detail";

export default memo(({match}) => (
    <Switch>
        <Route exact path={`${match.url}`} component={ToDo}/>
        <Route path={`${match.url}/detail`} component={Detail}/>
    </Switch>
));